// require modules and instantiate the shakerRouter
var oauthSignature = require('oauth-signature'),
           express = require('express'),
           request = require('request'),
                 n = require('nonce')(),
                qs = require('querystring'),
                 _ = require('lodash'),
      shakerRouter = express.Router()

// post route for /result;
shakerRouter.post('/result', function(req,res) {
  // category stores the selected values to be used in the category filter
  var category;
  // convert req.body.cuisines from an array into a string
  if (req.body.cuisines !== undefined) {
    category = req.body.cuisines.toString()
  } else {
    // if no value is selected for category filter, set category equal to "restaurants" so that the displayed result only includes restaurants
    category = "restaurants"
  }

  // pass in the search criterias
  var current_search = {
    location: req.body.location,
    term: req.body.term,
    cll: req.body.cll,
    category_filter: category
  }

  // create a function that handles
  var request_yelp = function(set_parameters) {

    var httpMethod = 'GET'
    var url = 'http://api.yelp.com/v2/search'
  
    var required_parameters = {
      oauth_consumer_key : "aXYVJiMRADRj7lPUeQwiqg",
      oauth_token : "3rxm2icV9K7TMdf8e2-uYAbKS0IIbptm",
      oauth_nonce : n(),
      oauth_timestamp : n().toString().substr(0,10),
      oauth_signature_method : 'HMAC-SHA1',
      oauth_version : '1.0'
    };
    /* We combine all the parameters in order of importance */
    var parameters = _.assign(set_parameters, required_parameters);
    /* We set our secrets here */
    var consumerSecret = "6I0h-1lPyTLDPD8Avq86HwiMVOM";
    var tokenSecret = "F2teTYsVWz7eGpkm5p8_9_XsbD4";

    /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
    /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
    var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

    /* We add the signature to the list of paramters */
    parameters.oauth_signature = signature;

    /* Then we turn the paramters object, to a query string */
    var paramURL = qs.stringify(parameters);

    /* Add the query string to the url */
    var apiURL = url+'?'+paramURL;

  // console.log(apiURL)
   request(apiURL, function(error, response, body){
     if (error) {
       res.render('shaker', {user:req.user, message: req.flash('Cannot make request to API!')})
     }
     else {
       if (JSON.parse(body)["total"] !== 0) {
         console.log(JSON.parse(body))
         var random = Math.floor((Math.random() * JSON.parse(body).businesses.length))
         var chosen = JSON.parse(body).businesses[random]
         res.render('result', {chosen: chosen, user:req.user, cll: req.body.cll})
       }
       else {
         res.render('shaker', {user:req.user, message: req.flash('No Result!Try Again')})
         console.log('no result!')
       }

     }
  })
}

request_yelp(current_search)
})



module.exports = shakerRouter
