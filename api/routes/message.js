const express = require('express');
const router = express.Router();
const auth = require('../auth');
//need to make new model for messages
const Message = require('../models/message');

//we need to delete this get request.
router.get('/', auth.requiresLogin, (req, res) => {
  Message.message.getMessages(function(error, messages) {
    if(error) {
      let err = new Error("Error finding messages");
      err.status = 401;
      err.msg = "Error finding messages";
      return res.status(err.status).json({error: err});
    } else {
      res.json({
        success: true,
        messages: messages
      });
    }
  });
});

router.post('/', auth.requiresLogin, function(req, res, next) {
  if (req.body.phone && req.body.name && req.body.message) {
    //create object with form input
    //Phone numbers should be formatted with a '+' and country code e.g., +16175551212 (E.164 format). Twilio will also accept unformatted US numbers e.g., (415) 555-1212 or 415-555-1212.

    //creates new Date object
    var today = new Date();
    var messageData = {
      phone: req.body.phone,
      name: req.body.name,
      message: req.body.message,
      sent: today
    }

    Message.message.create(messageData, function(error, message) {
      if(error) {
        return next(error);
      }
      else {
        res.status(200).json({
          success: 'true',
          message: 'Message successfully added to db'
        });

        Message.sendMessage(messageData);
      }
    });
  } else {
    res.status(401).json({
      success: 'false',
      msg: 'Phone Number, Name, and Message are required.',
      phone: req.body.phone,
      name: req.body.name,
      message: req.body.message
    });
  }
});


router.delete('/', auth.requiresLogin, function(req, res, next) {
  Message.message.deleteMessage(req.body._id, function(error) {
    if(error) {
      let err = new Error("Error deleting message.");
      err.status = 401;
      err.msg = "Error deleting message.";
      return res.status(err.status).json({error});
    } else {
      res.json({
        success: true
      });
    }
  });
});


module.exports = router;
