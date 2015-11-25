// require modules and the required parameters to use the facebook-authentication
var         passport = require('passport'),
       LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
          configAuth = require('./auth.js'),
                User = require('../models/User.js'),
            Favorite = require('../models/Favorite.js')

// store current user's information as a cookie
passport.serializeUser(function(user, done){
  done(null, user.id)
})

// extract information from a cookie
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user)
  })
})

// create a local-user using passport & passport-local
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email', //make the usernameField to store email instead
  passwordField: 'password',
  passReqToCallback: true
},
  function(req, email, password, done) {
    // check if email is already taken
    User.findOne({'email': email}, function(err, user) {
      if(err) {return done(err)}
      // if it is, inform user that the email is already taken and exit the function
      if(user) {return done(null, false)}
      // if not, create a user and save it to the database
      else {
        var newUser = new User()
        newUser.name = req.body.name
        newUser.email = email
        newUser.password = newUser.generateHash(password) // encrypt password

        newUser.save(function(err){
          if (err) {throw err}
          else {
            saveEntry(req.body.saved, newUser) // save the entry to THIS user's favorites
            return done(null, newUser)
          }
        })
      }
    })
  }
))

// create a session when logging in with a local-account using passport & passport-local
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
  function(req, email, password, done) {
    // check if a user with the email specified exists in the database
    User.findOne({'email': email}, function(err, user) {
      if (err) {throw err}
      // if no user was found, inform the user and exit the function
      if (!user) {return done(null, false)}
      // if a user was found but the password did not match, then inform the user and exit the function
      if (!user.validPassword(password)) {return done(null, false)}
      // otherwise, create a session
      else {
        saveEntry(req.body.saved, user) // save the entry to THIS user's favorites
        return done(null, user)
      }
    })
  }
))

// create a function to save an entry to a user's account once the user signed up or logged in
function saveEntry(entryId, user){
  if (entryId !== undefined) {
    Favorite.findOne({id: entryId}, function(err, favorite) {
      favorite._owner = user._id // set the owner
      favorite.save(function(err) {
        if (err) res.send(err)
      })
      user.favorites.push(favorite) // push the saved entry to user's favorites
      user.save(function(err) {
        if (err) res.send(err)
      })
    })
  }
}

module.exports = passport
