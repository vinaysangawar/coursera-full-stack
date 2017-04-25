"use strict";

var express = require('express'),
    bodyParser = require('body-parser');

var leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .all((req, res, next)=> {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        next();
    })
    .get((req, res)=> {
        res.end('Will send all leaders to you!');
    })
    .post((req, res)=> {
        res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .delete((req, res)=> {
        res.end('Deleting all leaders');
    });

leaderRouter.route('/:leaderId')
    .all((req, res, next)=> {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        next();
    })
    .get((req, res)=> {
        res.end('Will send details of the leader: ' + req.params.leaderId + ' to you!');
    })
    .put((req, res)=> {
        res.write('Updating the leader: ' + req.params.leaderId + '\n');
        res.end('Will update the leader: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .delete((req, res)=> {
        res.end('Deleting leader: ' + req.params.leaderId);
    });

module.exports = leaderRouter;
