const express = require('express');
const bodyParser = require('body-parser');
const Verify = require('./verify');

const Favorites = require('../models/favorites');

const favoritesRouter = express.Router();
favoritesRouter.use(bodyParser.json());

favoritesRouter
  .route('/')
  .get(Verify.verifyOrdinaryUser, (req, res) => {
    Favorites.findOne({ postedBy: req.decoded._doc._id })
      .populate('postedBy dishes')
      .exec((err, favorites) => {
        if (err) throw err;
        res.json(favorites);
      });
  })
  .post(Verify.verifyOrdinaryUser, (req, res, next) => {
    Favorites.findOne({ postedBy: req.decoded._doc._id }, (err, favorites) => {
      if (err) throw err;

      if (!favorites) {
        // New user favorites
        Favorites.create(
          {
            postedBy: req.decoded._doc._id,
            dishes: [req.body._id]
          },
          (err, favorite) => {
            if (err) throw err;
            console.log('Created new favorites list!');
            res.json(favorite);
          }
        );
      } else if (favorites.dishes.indexOf(req.body._id) !== -1) {
        const err = new Error('Dish already in favorites list!');
        err.status = 500;
        return next(err);
      } else {
        // Update favorites to existing user with favorites
        favorites.dishes.push(req.body._id);
        favorites.save((err, favorites) => {
          if (err) throw err;
          res.json(favorites);
        });
      }
    });
  })
  .delete(Verify.verifyOrdinaryUser, (req, res) => {
    Favorites.remove({ postedBy: req.decoded._doc._id }, (err, resp) => {
      if (err) throw err;
      res.json(resp);
    });
  });

favoritesRouter
  .route('/:dishId')
  .delete(Verify.verifyOrdinaryUser, (req, res, next) => {
    Favorites.findOne({ postedBy: req.decoded._doc._id }, (err, favorites) => {
      if (err) throw err;

      if (!favorites) {
        const err = new Error('No favorites found for user');
        err.status = 404;
        return next(err);
      } else if (favorites.dishes.indexOf(req.params.dishId) === -1) {
        // Dish not in favorites list
        const err = new Error('Dish not in favorites list');
        err.status = 404;
        return next(err);
      }
      favorites.dishes.remove(req.params.dishId);
      favorites.save((err, favorites) => {
        if (err) throw err;
        console.log(`Removed ${req.params.dishId} from favorites`);
        res.json(favorites);
      });
    });
  });

module.exports = favoritesRouter;
