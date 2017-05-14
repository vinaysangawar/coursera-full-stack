const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const hostname = 'localhost';
const port = 3000;

const app = express();

app.use(morgan('dev'));
app.use(cookieParser('12345-67890-09876-54321')); // secret key

function auth(req, res, next) {
  console.log(req.headers);

  if (!req.signedCookies.user) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      const err = new Error('You are not authenticated');
      err.status = 401;
      next(err);
    }

    const auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];
    if (user === 'admin' && pass === 'password') {
      res.cookie('user', 'admin', { signed: true });
      next(); // authorized
    } else {
      const err = new Error('You are not authenticated!');
      err.status = 401;
      next(err);
    }
  } else if (req.signedCookies.user === 'admin') {
    console.log(req.signedCookies);
    next();
  } else {
    const err = new Error('You are not authenticated!');
    err.status = 401;
    next(err);
  }
}

app.use(auth);

app.use(express.static(`${__dirname}/public`));

app.use((err, req, res, next) => {
  res.writeHead(err.status || 500, {
    'WWW-Authenticate': 'Basic',
    'Content-Type': 'text/plain'
  });
  res.end(err.message);
  next();
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
