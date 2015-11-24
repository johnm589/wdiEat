var Favorite = require('../models/Favorite.js')
var User = require('../models/User.js')

function create(req, res) {
  console.log('Trying to SAVE my favorite')
  var favorite = new Favorite()

  favorite.name = req.body.name
  favorite.rating = req.body.rating
  favorite.url = req.body.url
  favorite.display_phone = req.body.display_phone
  favorite.address = req.body.address
  favorite.categories = req.body.categories
  favorite.image_url = req.body.image_url
  favorite.rating_img_url_large = req.body.rating_img_url_large
  favorite._owner = req.body._owner

  User.findOne({_id: req.body._owner}, function(err, user) {
    if (err) console.log(err)
    user.favorites.push(favorite)
    user.save(function(err){
      if (err) res.send(err)
      console.log('user saved')
    })
    console.log(user)
  })

  favorite.save(function(err){
    if (err) res.send(err)
    console.log('favorite saved')
  })
}

function index(req,res) {
  Favorite.find({_owner: req.body.userId},function(err, favorites) {
    if (err) console.log(err)
    console.log(favorites.length)
      res.json(favorites)
    })
}

module.exports = {
  createFavorite: create,
  showMyFavorite: index
}
