const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter
  .route('/')
  .get((req, res) => {
    Dishes.find({}, (err, dish) => {
      if (err) throw err;
      res.json(dish);
    });
  })
  .post((req, res) => {
    Dishes.create(req.body, (err, dish) => {
      const id = dish._id;
      if (err) throw err;

      console.log('Dish created!');

      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });

      res.end(`Added the dish with id: ${id}`);
    });
  })
  .delete((req, res) => {
    Dishes.remove({}, (err, resp) => {
      if (err) throw err;
      res.json(resp);
    });
  });

dishRouter
  .route('/:dishId')
  .get((req, res) => {
    Dishes.findById(req.params.dishId, (err, dish) => {
      if (err) throw err;
      res.json(dish);
    });
  })
  .put((req, res) => {
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
  .delete((req, res) => {
    Dishes.findByIdAndRemove(req.params.dishId, (err, resp) => {
      if (err) throw err;
      res.json(resp);
    });
  });

dishRouter
  .route('/:dishId/comments')
  .get((req, res) => {
    Dishes.findById(req.params.dishId, (err, dish) => {
      if (err) throw err;
      res.json(dish.comments);
    });
  })
  .post((req, res) => {
    Dishes.findById(req.params.dishId, (err, dish) => {
      if (err) throw err;
      dish.comments.push(req.body);
      dish.save((err, dish) => {
        if (err) throw err;
        console.log('Updated Comments!');
        res.json(dish);
      });
    });
  })
  .delete((req, res) => {
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
  .get((req, res) => {
    Dishes.findById(req.params.dishId, (err, dish) => {
      if (err) throw err;
      res.json(dish.comments.id(req.params.commentId));
    });
  })
  .put((req, res) => {
    // We delete the existing commment and insert the updated
    // comment as a new comment
    Dishes.findById(req.params.dishId, (err, dish) => {
      if (err) throw err;
      dish.comments.id(req.params.commentId).remove();
      dish.comments.push(req.body);
      dish.save((err, dish) => {
        if (err) throw err;
        console.log('Updated Comments!');
        res.json(dish);
      });
    });
  })
  .delete((req, res) => {
    Dishes.findById(req.params.dishId, (err, dish) => {
      dish.comments.id(req.params.commentId).remove();
      dish.save((err, resp) => {
        if (err) throw err;
        res.json(resp);
      });
    });
  });

module.exports = dishRouter;
