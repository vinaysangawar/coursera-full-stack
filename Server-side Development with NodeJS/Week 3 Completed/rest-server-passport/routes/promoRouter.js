const express = require('express');
const bodyParser = require('body-parser');
const Verify = require('./verify');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter
  .route('/')
  .get(Verify.verifyOrdinaryUser, (req, res) => {
    Promotions.find({}, (err, promotions) => {
      if (err) throw err;
      res.json(promotions);
    });
  })
  .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res) => {
    Promotions.create(req.body, (err, promotion) => {
      if (err) throw err;
      res.json(promotion);
    });
  })
  .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res) => {
    Promotions.remove({}, (err, promotions) => {
      if (err) throw err;
      res.json(promotions);
    });
  });

promoRouter
  .route('/:promotionId')
  .get(Verify.verifyOrdinaryUser, (req, res) => {
    Promotions.findById(req.params.promotionId, (err, promotion) => {
      if (err) throw err;
      res.json(promotion);
    });
  })
  .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res) => {
    Promotions.findByIdAndUpdate(req.params.promotionId, req.body, (err, promotion) => {
      if (err) throw err;
      res.json(promotion);
    });
  })
  .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res) => {
    Promotions.findByIdAndRemove(req.params.promotionId, (err, promotion) => {
      if (err) throw err;
      res.json(promotion);
    });
  });

module.exports = promoRouter;
