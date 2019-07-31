const express = require('express');
const router = express.Router();
const User = require('../models/user');

//we need to delete this get request.
router.get('/', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'authenticate retrieved successfully'
  })
});

router.post('/', function(req, res, next) {
  if (req.body.email && req.body.password) {
      User.authenticate(req.body.email, req.body.password, function(error, user) {
        if(error || !user) {
          let err = new Error("Wrong email or password.");
          err.status = 401;
          err.msg = "Wrong email or password";
          return res.status(err.status).json({error: err});
        } else {
          //  This starts session. express adds session data to the request object
          // ._id is unique id mongo gives user when entered into the database
          // send this back as JSON with { redirectURI: '/profile' }
          // .userId is something of your choosing.
          // This should be saved in HTTP-only cookie.  When the client makes another request this will be sent with it in an HTTP-only cookie.
          try {
            req.session.userId = user._id;
          } catch (error) {
              console.log("session created", error);
          }

          console.log("Return Object", {
              success: true,
              name: user.name,
              id: user._id
          });
          //note that .json is express .json function middleware
          res.json({
            success: true,
            name: user.name,
            id: user._id
          });
        }
      });
    }
    else {
    res.status(401).json({
      success: 'false',
      msg: 'Email and Password are required.',
      username: req.body.email,
      password: req.body.password
    });
  }
});

module.exports = router;
