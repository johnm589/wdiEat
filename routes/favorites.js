var        express = require('express'),
favoriteController = require('../controllers/favorite_controller'),
    favoriteRouter = express.Router()

favoriteRouter.route('/favorites')
  .post(favoriteController.createFavorite)


favoriteRouter.route('/myfavorites')
  .post(favoriteController.showMyFavorite)

module.exports = favoriteRouter
