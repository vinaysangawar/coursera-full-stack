const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('../config.js');

exports.getToken = user =>
  jwt.sign(user, config.secretKey, {
    expiresIn: 3600
  });

exports.verifyOrdinaryUser = (req, res, next) => {
  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secretKey, (err, decoded) => {
      if (err) {
        const err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);
      }
      // if everything is good, save to request for use in other routes
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    const err = new Error('No token provided!');
    err.status = 403;
    return next(err);
  }
};

exports.verifyAdmin = (req, res, next) => {
  // Check if request is admin, uses decoded property from previous route
  if (req.decoded._doc.admin === true) {
    return next();
  }
  const err = new Error('You are not an admin!');
  err.status = 403;
  return next(err);
};
