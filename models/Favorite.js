var   mongoose = require('mongoose'),
        Schema = mongoose.Schema

var favoriteSchema = Schema({
  _owner: {type: Schema.Types.ObjectId, ref: 'User'},
  rating: Number,
  name: String,
  url: String,
  display_phone: String,
  address: String,
  categories: Array,
  image_url: String,
  rating_img_url_large: String,
})

var Favorite = mongoose.model('Favorite', favoriteSchema)

module.exports = Favorite
