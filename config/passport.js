var passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    FacebookStrategy= require('passport-facebook').Strategy,
    configAuth      = require('./auth.js')


var User = require('../models/User.js')

// Take information of the current user and store it as a cookie
// create a cookie
passport.serializeUser(function(user, done){
  done(null, user.id)
})

// extract information from a cookie
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user)
  })
})

// creating a user using passport
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
  function(req, email, password, done) {
    User.findOne({'local.email': email}, function(err, user) {
      if(err) return done(err)
      if(user) return done(null, false, req.flash('signupMessage','That email is already taken.'))

      var newUser = new User()
      newUser.local.name = req.body.name
      newUser.local.email = email
      newUser.local.password = newUser.generateHash(password)

      newUser.save(function(err){
        if (err) throw err
        return done(null, newUser)
      })
    })
  }
))

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  User.findOne({'local.email': email}, function(err, user) {
    if (err) throw err
    if (!user) return done(null, false, req.flash('loginMessage', 'No User Found.'))
    if (!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Invalid Cred dawg'))
    return done(null, user)
  })
}))

passport.use(new FacebookStrategy({
  clientID: configAuth.facebookAuth.clientID,
  clientSecret: configAuth.facebookAuth.clientSecret,
  callbackURL: configAuth.facebookAuth.callbackURL,
  profileFields: configAuth.facebookAuth.profileFields},
  function (token, refreshToken, profile, done){
    User.findOne({'facebook.id': profile.id}, function(err, user) {
      if (err) return done(err)
      if (user){
        return done(null, user)
      }
      else {
        var newUser = new User()
        newUser.facebook.id = profile.id
        newUser.facebook.token = token
        newUser.facebook.name = profile.displayName
        newUser.facebook.email = profile.emails[0].value

        newUser.save(function(err){
          if (err) throw err
          return done(null, newUser)
        })
      }
    })
}))

module.exports = passport
