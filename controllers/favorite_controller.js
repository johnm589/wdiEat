// require the schema & model
var Favorite = require('../models/Favorite.js'),
        User = require('../models/User.js')

// create a new favorite entry
function create(req, res) {
  // instantiate an object from Favorite
  var favorite = new Favorite()

  // set the properties using the values passed in from the ajax request (using "data" that ajax provides for the POST method)
  favorite.name = req.body.name
  favorite.id = req.body.id
  favorite.rating = req.body.rating
  favorite.url = req.body.url
  favorite.display_phone = req.body.display_phone
  favorite.address = req.body.address
  favorite.categories = req.body.categories // array
  favorite.image_url = req.body.image_url
  favorite.rating_img_url_large = req.body.rating_img_url_large
  favorite._owner = req.body._owner // setting reference to the user

  // save favorite
  favorite.save(function(err){
    if (err) res.send(err)
  })

  // find the current user object
  User.findOne({_id: req.params.user_id}, function(err, user) {
    // User.findOne returns AN OBJECT
    if (err) {console.log(err)}
    else {
      user.favorites.push(favorite) // save THIS entry to user's favorites
      user.save(function(err){ // save the change
        if (err) res.send(err)
      })
    }
  })
}

// display all the saved entry belong to the user currently logged in
function index(req,res) {
  Favorite.find({_owner: req.params.user_id},function(err, favorites) {
    // Favorite.find returns AN ARRAY of objects
    if (err) {console.log(err)}
    else {
      res.json(favorites) // return the results found as a json
    }
  })
}

// delete the saved entry
function destroy(req,res) {
  Favorite.findOneAndRemove({_id: req.params.favorite_id}, // find the saved entry using id
    function(err){
      if (err) {res.send(err)}
    }
  )
}

// function kreate(req,res) {
//   // instantiate an object from Favorite
//   var favorite = new Favorite()
//
//   // set the properties using the values passed in from the ajax request (using "data" that ajax provides for the POST method)
//   favorite.name = req.body.name
//   favorite.id = req.body.id
//   favorite.rating = req.body.rating
//   favorite.url = req.body.url
//   favorite.display_phone = req.body.display_phone
//   favorite.address = req.body.address
//   favorite.categories = req.body.categories // array
//   favorite.image_url = req.body.image_url
//   favorite.rating_img_url_large = req.body.rating_img_url_large
//   // save favorite
//   favorite.save(function(err){
//     if (err) res.send(err)
//   })
// }

// Create a function to search for a saved entry using its ID and returned that object to be used in show.ejs
function show(req, res) {
  Favorite.findOne({_id: req.params.favorite_id}, function(err, favorite) {
    if (err) {console.log(err)}
    else {
      res.render('show', {favorite: favorite, user: req.user})
    }
  })
}

// export the modules
module.exports = {
  createFavorite: create,
  showMyFavorites: index,
  deleteFavorite: destroy,
  showFavorite: show
  // kreateFavorite: kreate
}
