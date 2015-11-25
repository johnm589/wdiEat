// require modules
var   mongoose = require('mongoose'),
        bcrypt = require('bcrypt-nodejs'),
        Schema = mongoose.Schema

// create a user schema
var userSchema = new Schema ({
  local: {
    name: String,
    email: {type: String, require: true, unique: true},
    password: {type: String, require:true},
  },
  facebook: {
    id: String,
    name: String,
    token: String, // check if the user has authorized
    email: String,
  },
  favorites: [{type: Schema.Types.ObjectId, ref: 'Favorite'}]
})

// generate an encrypted password
userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

// compare the password entered with the password stored in this user
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

// create a constructor for User
var User = mongoose.model('User', userSchema)

module.exports = User
