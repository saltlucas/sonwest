var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../auth');


/* GET home page. */
// GET /register
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sonwest API' });
});

/* Registration page */
router.post('/register', function(req, res, next) {
  if(req.body.email &&
    req.body.name &&
    req.body.password &&
    req.body.confirmPassword
  ) {
    //confirm that user typed password twice.
    if (req.body.password !== req.body.confirmPassword) {
      var err = new Error('Passwords do not match.');
      err.status = 400;
      return next(err);
    }

    //create object with form input
    var userData = {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password
    }

    User.create(userData, function(error, user) {
      if(error) {
        return next(error);
      }
      else {
        return res.redirect('/profile');
      }
    });
  }
    else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
});

module.exports = router;
