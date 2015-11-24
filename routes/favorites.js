var        express = require('express'),
favoriteController = require('../controllers/favorite_controller'),
    favoriteRouter = express.Router()

favoriteRouter.route('/favorites')
  .post(favoriteController.createFavorite)


favoriteRouter.route('/myfavorites')
  .post(favoriteController.showMyFavorites)

favoriteRouter.route('/favorite/delete/:favorite_id')
  .delete(favoriteController.deleteFavorite)

module.exports = favoriteRouter
