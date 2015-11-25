// require modules
var passportConfig = require('./config/passport.js')
				ejsLayouts = require('express-ejs-layouts'),
							 ejs = require('ejs'),
		 			mongoose = require('mongoose'),
			 			 flash = require('connect-flash'),
				 	 	logger = require('morgan'),
	 		cookieParser = require('cookie-parser'),
		 		bodyParser = require('body-parser'),
		 			 session = require('express-session'),
			 	 	passport = require('passport'),
			 		 express = require('express'),
					 		port = process.env.PORT || 3000,
			 	 			 app = express()

// require routes
var userRoutes = require('./routes/users.js')
var shakerRoutes = require('./routes/shakers.js')
var favoriteRoutes = require('./routes/favorites.js')

// mongoose connection
mongoose.connect('mongodb://localhost/wdiEat', function(err){
	if(err) return console.log('Cannot connect :(')
	console.log('Connected to MongoDB. Sweet!')
})

// middleware
app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// make files inside the public accessible to app
app.use(express.static(__dirname + '/public'))

// ejs configuration
app.set('view engine', 'ejs')
app.use(ejsLayouts)

// session middleware
app.use(session({
	secret: 'boomchakalaka',
	cookie: {_expires: 600000000}
}))

// passport and flash middleware
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// root route
app.get('/', function(req,res){
	res.render('shaker', {user: req.user})
})

// use routes
app.use('/', userRoutes)
app.use('/', shakerRoutes)
app.use('/', favoriteRoutes)

// start the server on port
app.listen(port || 3000, function(){
	console.log("Server Running!", port)
})
