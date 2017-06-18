const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const Verify = require('./verify');

const router = express.Router();

router.get('/', Verify.verifyOrdinaryUser, Verify.verifyAdmin, (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) {
      const err = new Error('You are not an admin!');
      err.status = 403;
      return next(err);
    }
    res.json(users);
  });
});

router.get('/facebook', passport.authenticate('facebook'), () => {});

router.get('/facebook/callback', (req, res, next) => {
  passport.authenticate('facebook', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      const token = Verify.getToken(user);
      res.status(200).json({
        status: 'Login successful!',
        success: true,
        token
      });
    });
  })(req, res, next);
});

router.post('/register', (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      return res.status(500).json({ err });
    }

    if (req.body.firstname) {
      user.firstname = req.body.firstname;
    }

    if (req.body.lastname) {
      user.lastname = req.body.lastname;
    }

    user.save(() => {
      passport.authenticate('local')(req, res, () => {
        res.status(200).json({ status: 'Registration Successful!' });
      });
    });
  });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }

      const token = Verify.getToken(user);
      res.status(200).json({
        status: 'Login successful!',
        success: true,
        token
      });
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

module.exports = router;
