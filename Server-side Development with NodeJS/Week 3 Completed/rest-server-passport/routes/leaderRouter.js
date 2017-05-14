const express = require('express');
const bodyParser = require('body-parser');
const Verify = require('./verify');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter
  .route('/')
  .get(Verify.verifyOrdinaryUser, (req, res) => {
    res.end('Will send all leaders to you!');
  })
  .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res) => {
    res.end(`Will add the leader: ${req.body.name} with details: ${req.body.description}`);
  })
  .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res) => {
    res.end('Deleting all leaders');
  });

leaderRouter
  .route('/:leaderId')
  .get(Verify.verifyOrdinaryUser, (req, res) => {
    res.end(`Will send details of the leader: ${req.params.leaderId} to you!`);
  })
  .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res) => {
    res.write(`Updating the leader: ${req.params.leaderId}\n`);
    res.end(`Will update the leader: ${req.body.name} with details: ${req.body.description}`);
  })
  .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res) => {
    res.end(`Deleting leader: ${req.params.leaderId}`);
  });

module.exports = leaderRouter;
