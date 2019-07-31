var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../auth');


/* See if user is authenticated */
router.get('/', auth.requiresLogin, function(req, res, next) {
  //If next is hit it will execute code below.
  User.findById(req.session.userId)
    .exec(function(error, user) {
      if(error) {
        let err = new Error("User not logged in.");
        //err.status = 401;
        err.msg = "User not logged in.";
        return res.json({error: err});
      } else {
      res.json({
        success: true,
        name: user.name,
        id: user._id
      });
      }
    });
});

/*Delete Session if user logs out */
router.delete('/', auth.logOut, function(req, res) {
  res.json({msg: "User session deleted" })
});

module.exports = router;
