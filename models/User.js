// require modules
var   mongoose = require('mongoose'),
        bcrypt = require('bcrypt-nodejs'),
        Schema = mongoose.Schema

// create a user schema
var userSchema = new Schema ({
  local: {
    name: String,
    email: String,
    password: String,
    favorites: [{type: Schema.Types.ObjectId, ref: 'Favorite'}]
  },
  facebook: {
    id: String,
    name: String,
    token: String, // check if the user has authorized
    email: String,
    favorites: [{type: Schema.Types.ObjectId, ref: 'Favorite'}]
  }
})

var favoriteSchema = Schema({
  _owner: {type: Schema.Types.ObjectId, ref: 'User'},
  rating: Number,
  review_count: Number,
  name: String,
  url: String,
  display_phone: String,
  address: String,
  categories: Array,
  image_url: String
})

// generate an encrypted password
userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

// compare the password entered with the password stored in this user
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password)
}

// create a constructor for user
var User = mongoose.model('User', userSchema)
var Favorite = mongoose.model('History', favoriteSchema)

module.exports = User
