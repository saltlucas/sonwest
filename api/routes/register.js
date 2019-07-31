var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
// GET /register
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Register a user' });
// });

/* Registration page */
//We need post request to add a new user
router.post('/', function(req, res, next) {
  const user = req.body;
  if(user.email &&
    user.name &&
    user.passwordDup &&
    user.password
  ) {
    //confirm that user typed same password twice.
    if (user.passwordDup !== user.password) {
      var err = new Error('Passwords do not match.');
      err.status = 400;
      res.status(err.status).json({error: true, message: err.message});
    } else {
      //if everything is validated then let's pop it into mongodb
      //create object with form input
      var userData = {
        email: user.email,
        name: user.name,
        password: user.password
      }

      User.create(userData, function(err, user) {
        if(err) {
          if(err.code === 11000) {
            res.status("400").json({error: true, message: "This user has already been taken"});
          }
          else {
            res.status("400").json({error: true, message: "User entry Error"});
          }
        }
        else {
          return res.json(
            {
              error: false,
              success: "added user",
            }
          );
        }
      });
    }

  } else {
    res.status(200).json({
      success: 'false',
      message: 'all fields are required'
    });
  }
});

module.exports = router;
