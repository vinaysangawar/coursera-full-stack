var http = require('http');

var hostname = 'localhost';
var port = 3000;

var server = http.createServer(function (req, res) {
    console.log(req.headers);

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Hello World</h1>');
});

server.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});