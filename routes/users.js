// require modules and instantiate userRouter
var    express = require('express'),
      passport = require('passport'),
    userRouter = express.Router(),
    Favorite = require('../models/Favorite.js')

// set route for url /login
userRouter.route('/login')
  // get request for url /login; show the login form
  .get(function(req, res) {
    res.render('login', {user: req.user, message: req.flash('loginMessage')})
  })
  // post request for url /login; create a session if login was successful
  .post(passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/session',
    failureFlash: true
  }))

// set route for /signin
userRouter.route('/signup')
  // get request for url /signin; show the signup form
  .get(function(req,res){
    res.render('signup', {user: req.user, message: req.flash('signupMessage')})
  })
  // post request for url /signup; create a user in the database if signup was successful
  .post(passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/session',
    failureFlash: true
  }))

// get request for url /profile; show the user profile page
userRouter.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile', {user: req.user})
})

// get request for url /auth/facebook; send authenticate requests to facebook and request permissions to use the user's email
userRouter.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}))

// get request for auth/facebook/callback; callback url for facebook authentication
userRouter.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/profile',
  failureRedirect: '/session'
}))

// get request for url /logout; destroy current session
userRouter.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/')
})

userRouter.get('/session', function(req, res) {
    res.render('session', {user: req.user})
})

// middleware; if authentication was successful, invoke next; otherwise, redirect to root
function isLoggedIn(req,res,next) {
  if (req.isAuthenticated()) return next()
  res.redirect('/')
}

module.exports = userRouter
