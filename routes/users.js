//user routes
var express     = require('express'),
    passport    = require('passport'),
    userRouter  = express.Router()


userRouter.route('/login')
  .get(function(req, res) {
    res.render('login', {user: req.user, message: req.flash('loginMessage')})
  })
  // create session with passport
  .post(passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))

userRouter.route('/signup')
  .get(function(req,res){
    res.render('signup', {user: req.user, message: req.flash('signupMessage')})
  })
  .post(passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: 'signup',
    failureFlash: true
  }))

userRouter.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile', {user: req.user})
})

userRouter.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}))

userRouter.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/signup'
}))

userRouter.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/')
})
// middleware
function isLoggedIn(req,res,next) {
  if (req.isAuthenticated()) return next()
  res.redirect('/')
}

module.exports = userRouter
