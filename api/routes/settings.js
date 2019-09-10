const express = require('express');
const router = express.Router();
const auth = require('../auth');
//need to make new model for settings
const Settings = require('../models/settings');

//GET request

//POST request when creating new setting
//This should only be done by app creators


//PUT request when updating setting


router.get('/', auth.requiresLogin, (req, res) => {
  let names = req.query.name;
  console.log(names);
  if(names) {
    //change names string into array
    var nameList = names.split(',');
    console.log("nameList", nameList);
    Settings.getSettings(nameList, function(error, settings) {
      if(error) {
        let err = new Error("Error finding settings.");
        err.status = 404;
        err.msg = "Error finding settings.";
        return res.status(err.status).json({error: err});
      } else {
        console.log(settings);
        //change array of settings into easily accessible object
        var settingsOb = {};
        settings.forEach(function (setting) {
          settingsOb[setting.name] = setting;
        });
        console.log("settingsOb", settingsOb);
        res.status(200).json({
          settings: settingsOb
        });
      }
    });
  }
  else {
    Settings.getAllSettings(function(error, settings) {
      if(error) {
        let err = new Error("Error finding settings.");
        err.status = 404;
        err.msg = "Error finding settings.";
        return res.status(err.status).json({error: err});
      } else {
        res.json({
          settings: settings
        });
      }
    });
  }
});

//no longer using this method.  instead we are using query params
//get setting by name
//for example if setting name = message return message and value
router.get('/:settingName', auth.requiresLogin, (req, res) => {
  Settings.findOne({name: req.params.settingName})
    .exec(function(error, setting) {
      if (error) {
        var err = new Error('Error finding setting');
        err.status = 400;
        res.status(err.status).json({error: true, message: err.message});
      } else if (!setting) {
        var err = new Error('Setting not found.');
        err.status = 401;
        res.status(err.status).json({error: true, message: err.message});
      }
      if(setting) {
        return res.status(200).json({
          setting: setting
        });
      }
    });
});

//Add a new setting
router.post('/', auth.requiresLogin, function(req, res, next) {
  const setting = req.body;
  if(setting.name &&
    setting.value
  ) {
      //if everything is validated then let's pop it into mongodb
      //create object with form input
      var settingData = {
        name: setting.name,
        value: setting.value
      }

      Settings.create(settingData, function(err, setting) {
        if(err) {
          if(err.code === 11000) {
            res.status("400").json({error: true, message: "This setting has already been added"});
          } else {
            res.status("400").json({error: true, message: "Setting entry error."});
          }
        } else {
          return res.json(
            {
              error: false,
              success: "New setting added successfully",
            }
          );
        }
      });
    } else {
    res.status(200).json({
      success: 'false',
      message: 'All fields are required',
    });
  }
});

//Update a setting
router.put('/', auth.requiresLogin, function(req, res, next) {
  const settings = req.body;
  console.log(settings);
  /*
    setting {
      message: "message is here",
      survey: "http://surveylink.com"
    }

  */
  if(settings.message &&
    settings.survey
  ) {

      var settingsArr = Object.keys(settings).map( (obj) => {
        settingObj = {};
        settingObj[obj] = settings[obj];
        return settingObj;
      });
      console.log(settingsArr);

      //for each setting we will need to call the update command

      // each arrItem { "name" : "value" }
      settingsArr.forEach(function(arrItem) {
        for(var i in arrItem) {
          console.log(i);
          console.log(arrItem[i]); //alerts key's value
        }
      });

      // Settings.update(settings, function(err, setting) {
      //   if(err) {
      //     if(err.code === 11000) {
      //       res.status("400").json({error: true, message: "This setting has already been added"});
      //     } else {
      //       res.status("400").json({error: true, message: "Setting entry error."});
      //     }
      //   } else {
      //     return res.json(
      //       {
      //         error: false,
      //         success: "New setting added successfully",
      //       }
      //     );
      //   }
      // });

      res.status(200).json({
        success: 'true',
        message: 'We have updated these klondikes',
      });

    } else {
    res.status(200).json({
      success: 'false',
      message: 'All fields are required',
    });
  }
});

module.exports = router;
