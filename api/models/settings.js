var mongoose = require('mongoose');
var SettingsSchema = new mongoose.Schema({
  name: {
    type: String,
    useCreateIndex: true,
    required: true,
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  }
});

//names param1 is array of names
SettingsSchema.statics.getSettings = function( names, callback ) {
  Settings.find({
    'name' : { $in: names }
  }, "-__v")
    .exec(function(error, settings) {
      if (error) {
        return callback(error);
      } else {
        return callback(null, settings);
      }
    });
}

// What functions does this model need:
// Create name value pair // this should only be done once though and the user won't do it.
// Read we will need to read the message and the link both from the frontend and backend
SettingsSchema.statics.getAllSettings = function(callback) {
  Settings.find({}, "-__v")
    .exec(function(error, settings) {
      if (error) {
        return callback(error);
      } else {
        return callback(null, settings);
      }
    });
}
// Update we will need to update the message or the link
// Delete we won't need to do this at this time it should only be edited.


var Settings = mongoose.model('Settings', SettingsSchema);
module.exports = Settings;
