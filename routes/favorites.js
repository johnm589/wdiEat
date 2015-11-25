// require modules and instantiate the favoriteRouter
var favoriteController = require('../controllers/favorite_controller'),
               express = require('express'),
        favoriteRouter = express.Router()

// set routes for url /favorites/:user_id where :user_id is a parameter to be passed in when the request is to be made
favoriteRouter.route('/favorites/:user_id')
  .get(favoriteController.showMyFavorites)
  .post(favoriteController.createFavorite)

// // set routes for url /favorites
// favoriteRouter.route('/favorites')
//   // create anobject in Favorite by calling the kreate function (it does not set the _owner when it is saved into the database)
//   .post(favoriteController.kreateFavorite)

// set route for url /favorite/delete/:favorite_id; :favorite_id is a parameter to be passed in when the request is to be made
favoriteRouter.route('/favorite/delete/:favorite_id')
  .delete(favoriteController.deleteFavorite)

// set route for url /favorite/:favorite_id to show the information of a ONE saved entry
favoriteRouter.route('/favorite/:favorite_id')
  .get(favoriteController.showFavorite)

module.exports = favoriteRouter
