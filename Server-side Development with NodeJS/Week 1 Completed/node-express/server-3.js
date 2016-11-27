"use strict";

var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));

app.use(bodyParser.json());

app.all('/dishes', (req, res, next)=> {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    next();
});

app.get('/dishes', (req, res)=> {
    res.end('Will send all dishes to you!');
});

app.post('/dishes', (req, res)=> {
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
});

app.delete('/dishes', (req, res)=> {
    res.end('Deleting all dishes');
});

app.get('/dishes/:dishId', (req, res)=> {
    res.end('Will send details of the dish: ' + req.params.dishId + ' to you!');
});

app.put('/dishes/:dishId', (req, res)=> {
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name + ' with details: ' + req.body.description);
});

app.delete('/dishes/:dishId', (req, res)=> {
    res.end('Deleting dish: ' + req.params.dishId);
});

app.use(express.static(__dirname + '/public'));

app.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});