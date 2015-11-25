// require mongoose to create Schema
var  mongoose = require('mongoose'),
       Schema = mongoose.Schema

// create a schema for the Favorite model
var favoriteSchema = Schema({
  _owner: {type: Schema.Types.ObjectId, ref: 'User'}, // reference to user
  rating: Number,
  name: String,
  url: String,
  display_phone: String,
  address: String,
  categories: Array,
  image_url: String,
  rating_img_url_large: String,
  id: String
})

// create a constructor for Favorite
var Favorite = mongoose.model('Favorite', favoriteSchema)

module.exports = Favorite
