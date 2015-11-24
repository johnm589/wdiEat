var        express = require('express'),
favoriteController = require('../controllers/favorite_controller'),
    favoriteRouter = express.Router()

favoriteRouter.route('/favorites')
  .get(favoriteController.showAllFavorite)
  .post(favoriteController.createFavorite)




module.exports = favoriteRouter
