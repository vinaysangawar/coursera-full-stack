const express = require('express');
const bodyParser = require('body-parser');
const Verify = require('./verify');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter
  .route('/')
  .get(Verify.verifyOrdinaryUser, (req, res) => {
    Dishes.find({}).populate('comments.postedBy').exec((err, dish) => {
      if (err) throw err;
      res.json(dish);
    });
  })
  .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res) => {
    Dishes.create(req.body, (err, dish) => {
      if (err) throw err;

      const id = dish._id;

      console.log('Dish created!');

      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });

      res.end(`Added the dish with id: ${id}`);
    });
  })
  .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res) => {
    Dishes.remove({}, (err, resp) => {
      if (err) throw err;
      res.json(resp);
    });
  });

dishRouter
  .route('/:dishId')
  .get(Verify.verifyOrdinaryUser, (req, res) => {
    Dishes.findById(req.params.dishId).populate('comments.postedBy').exec((err, dish) => {
      if (err) throw err;
      res.json(dish);
    });
  })
  .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res) => {
    Dishes.findByIdAndUpdate(
      req.params.dishId,
      {
        $set: req.body
      },
      {
        new: true
      },
      (err, dish) => {
        if (err) throw err;
        res.json(dish);
      }
    );
  })
  .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res) => {
    Dishes.findByIdAndRemove(req.params.dishId, (err, resp) => {
      if (err) throw err;
      res.json(resp);
    });
  });

dishRouter
  .route('/:dishId/comments')
  .get(Verify.verifyOrdinaryUser, (req, res) => {
    Dishes.findById(req.params.dishId).populate('comments.postedBy').exec((err, dish) => {
      if (err) throw err;
      res.json(dish.comments);
    });
  })
  .post(Verify.verifyOrdinaryUser, (req, res) => {
    Dishes.findById(req.params.dishId, (err, dish) => {
      if (err) throw err;

      req.body.postedBy = req.decoded._doc._id;

      dish.comments.push(req.body);
      dish.save((err, dish) => {
        if (err) throw err;
        console.log('Updated Comments!');
        res.json(dish);
      });
    });
  })
  .delete(Verify.verifyOrdinaryUser, (req, res) => {
    Dishes.findById(req.params.dishId, (err, dish) => {
      if (err) throw err;
      for (let i = dish.comments.length - 1; i >= 0; i -= 1) {
        dish.comments.id(dish.comments[i]._id).remove();
      }
      dish.save((err) => {
        if (err) throw err;
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end('Deleted all comments!');
      });
    });
  });

dishRouter
  .route('/:dishId/comments/:commentId')
  .get(Verify.verifyOrdinaryUser, (req, res) => {
    Dishes.findById(req.params.dishId).populate('comments.postedBy').exec((err, dish) => {
      if (err) throw err;
      res.json(dish.comments.id(req.params.commentId));
    });
  })
  .put(Verify.verifyOrdinaryUser, (req, res) => {
    // We delete the existing commment and insert the updated
    // comment as a new comment
    Dishes.findById(req.params.dishId, (err, dish) => {
      if (err) throw err;
      dish.comments.id(req.params.commentId).remove();

      req.body.postedBy = req.decoded._doc._id;

      dish.comments.push(req.body);
      dish.save((err, dish) => {
        if (err) throw err;
        console.log('Updated Comments!');
        res.json(dish);
      });
    });
  })
  .delete(Verify.verifyOrdinaryUser, (req, res, next) => {
    Dishes.findById(req.params.dishId, (err, dish) => {
      if (dish.comments.id(req.params.commentId).postedBy !== req.decoded._doc._id) {
        const err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
      }

      dish.comments.id(req.params.commentId).remove();
      dish.save((err, resp) => {
        if (err) throw err;
        res.json(resp);
      });
    });
  });

module.exports = dishRouter;
