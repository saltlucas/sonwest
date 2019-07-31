var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../auth');


/* GET users listing. */
router.get('/', auth.requiresLogin, function(req, res, next) {
  //We need to check if they have a valid session
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if(error) {
        let err = new Error("User not found.");
        err.status = 401;
        err.msg = "User not found.";
        return res.status(err.status).json({error: err});
      } else {
        res.json([
          {
            "title": "Dashboard",
            "content": "Here is the content for the dashboard page",
            name: user.name
          }
        ]);
      }
    });
});

module.exports = router;
