// require modules and instantiate the shakerRouter
var oauthSignature = require('oauth-signature'),
           express = require('express'),
           request = require('request'),
             nonce = require('nonce')(),
       querystring = require('querystring'),
            lodash = require('lodash'),
        configAuth = require('../config/auth.js'),
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

  // create a function that compiles the search parameters and makes a request to yelp when invoked
  var request_yelp = function(set_parameters) {
    // search string without the authentication information and the search criteria
    var url = 'http://api.yelp.com/v2/search'

    // required parameters in order to authenticate and to use the yelp api
    var required_parameters = {
      oauth_consumer_key: configAuth.yelpAuth.oauth_consumer_key,
      oauth_token: configAuth.yelpAuth.oauth_token,
      oauth_nonce: nonce(), // return a raw timestamp
      oauth_timestamp: nonce().toString().substr(0,10), // get a timestamp in the format required by yelp
      oauth_signature_method: configAuth.yelpAuth.oauth_signature_method,
      oauth_version: configAuth.yelpAuth.oauth_version
    }

    // lodash.assign returns ONE object with all the key:value pairs extracted from the arguments (parameters is one object with all the key:value pairs in set_parameters and required_parameters)
    var parameters = lodash.assign(set_parameters, required_parameters)
    // retrieve the consumerSecret and tokenSecret from configAuth
    var consumerSecret = configAuth.yelpAuth.consumerSecret
    var tokenSecret = configAuth.yelpAuth.tokenSecret

    // obtain a signature
    var signature = oauthSignature.generate("GET", url, parameters, consumerSecret, tokenSecret, { encodeSignature: false})

    // add a new property 'oauth_signature' in parameters
    parameters.oauth_signature = signature

    // convert the object into one string
    var paramURL = querystring.stringify(parameters)

    // combine the url with the search parameters and authentication information into one string
    var apiURL = url+'?'+paramURL

    console.log(apiURL)
   // make a request to yelp
   request(apiURL, function(error, response, body){
     if (error) {
       res.render('shaker', {user:req.user, message: req.flash('Cannot make request to API!')})
     } else {
       // if the request was successful and the result contains information of at least one restaurant, then pick ONE restaurant randomly from the result
       if (JSON.parse(body)["total"] !== 0) {

           var random = Math.floor((Math.random() * JSON.parse(body).businesses.length))
           var chosen = JSON.parse(body).businesses[random]
           console.log(chosen)
           res.render('result', {chosen: chosen, user:req.user, cll: req.body.cll})
       } else {
        // if the request was successful and the result includes 0 restaurants, prompt user to try again
           res.render('shaker', {user:req.user, message: req.flash('No Result!Try Again')})
           console.log('no result!')
         }
       }
     })
   }
   // make a request to yelp using the search parameters
   request_yelp(current_search)
})

module.exports = shakerRouter
