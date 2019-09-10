//This needs to create a new table for messages with ID, Phone Number, Name, and Message
var mongoose = require('mongoose');
var objectId = require('mongodb').ObjectId;

const accountSid = 'AC615ca7ec3161530aaacf2067321b221e';
const authToken = 'f619ba80b86de844a5b630ba872e0cba';
const client = require('twilio')(accountSid, authToken);
const surveyLink = 'http://bit.ly/ImperialArmsSurvey';

var MessageSchema = new mongoose.Schema({
  phone: {
    type: String,
    useCreateIndex: true,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  sent: {
    type: Date,
    required: true
  }
});

//replace with variables after test.
const sendMessage = (messageData) => {
  var messageFinal = `${messageData.message} ${surveyLink}`;

  client.messages
  .create({
     body: messageFinal,
     from: '19019100137',
     to: messageData.phone
   })
  .then(message => console.log(message.sid));
}

MessageSchema.statics.getMessages = function(callback) {
  Message.find({}, "-__v")
    .exec(function(error, messages) {
      if (error) {
        return callback(error);
      } else {
        return callback(null, messages);
      }
    });
}

MessageSchema.statics.deleteMessage = function(id, callback) {
  Message.deleteOne({ "_id" : objectId(id) })
    .exec(function(error) {
      if (error) {
        return callback(error);
      } else {
        return callback();
      }
    });
}

var Message = mongoose.model('Message', MessageSchema);
module.exports.message = Message;
module.exports.sendMessage = sendMessage;
