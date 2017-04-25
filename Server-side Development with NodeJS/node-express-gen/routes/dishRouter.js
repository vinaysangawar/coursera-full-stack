"use strict";

var express = require('express'),
    bodyParser = require('body-parser');

var dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .all((req, res, next)=> {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        next();
    })
    .get((req, res)=> {
        res.end('Will send all dishes to you!');
    })
    .post((req, res)=> {
        res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .delete((req, res)=> {
        res.end('Deleting all dishes');
    });

dishRouter.route('/:dishId')
    .all((req, res, next)=> {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        next();
    })
    .get((req, res)=> {
        res.end('Will send details of the dish: ' + req.params.dishId + ' to you!');
    })
    .put((req, res)=> {
        res.write('Updating the dish: ' + req.params.dishId + '\n');
        res.end('Will update the dish: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .delete((req, res)=> {
        res.end('Deleting dish: ' + req.params.dishId);
    });

module.exports = dishRouter;