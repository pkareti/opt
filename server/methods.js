import {
  Collections
}
from 'meteor/digi:urma-core';
import fwUpdateSimulator from './firmware-update-simulator.js';
import {
  exec, spawn
}
from 'child_process';
import {
  Buffer
}
from 'buffer';
import Fiber from 'fibers';

let log = new Logger('server/methods');

let State = Collections.State;
let Settings = Collections.Settings;
let CliOutput = Collections.CliOutput;


Meteor.methods({
  updateFirmware: function(filename, options) {
    log.debug('Applying firmware file ' + filename +
      ' to the device. options:', options);
    fwUpdateSimulator.simulateFirmwareUpdate(filename, options);
  },
  reboot: function(delay) {
    log.debug('Rebooting the device in ' + delay + ' minutes...');
    //TODO: simulate reboot - can we close the DDP connection?
  },
  resetUsernamePwd: function(userId, username, password) {
    if (username && username.length) {
      Accounts.setUsername(userId, username);
    }
    if (password && password.length) {
      Accounts.setPassword(userId, password, {
        logout: false
      });
    }
  },
  provisionDevice: function(username, password, deviceId, server) {
    log.debug('Provision device with device id ' + deviceId +
      'to device cloud server ' + server + ', using username: ',
      username);
    let auth = 'Basic ' + new Buffer(username + ':' + password).toString(
      'base64');
    let cloudUrl = "https://" + server + "/ws/v1/devices/inventory";
    let httpConn, error, result;
    let options = {
      data: {},
      headers: {
        "Authorization": auth,
        "content-type": "application/json",
        "Accept": "application/json"
      }
    };

    try {
      /** first check to see if device is already provisioned **/
      httpConn = HTTP.get(cloudUrl + "/" + deviceId, options);
      if (httpConn.statusCode == 200 || httpConn.statusCode == 201) {
        result = httpConn.statusCode;
      }
    } catch (e) {
      if (e.response.statusCode == 404) {
        try {
          options.data = {
            "id": deviceId
          };
          httpConn = HTTP.post(cloudUrl, options);
          if (httpConn.statusCode == 200 || httpConn.statusCode == 201) {
            /** successfully provisioned... return success **/
            result = httpConn.statusCode;
          } else {
            /** something went wrong on the provision call, return what we know **/
            error = new Meteor.Error(httpConn.statusCode,
              "Unable to provision the device.");
          }
        } catch (e) {
          error = new Meteor.Error(e.response.statusCode,
            "Failed to provision the device.");
        }
      } else {
        error = new Meteor.Error(e.response.statusCode,
          "Unable to read the device list.");
      }
    }

    return {
      'error': error,
      'result': result
    }
  },

  cliSendText: function (encodedCommandText) {
      var commandText = new Buffer(encodedCommandText, 'base64').toString();
      log.debug('performing command', commandText);
      // TODO: this really should be fully async (and it is in the python server). But for now we are just running
      //       the command locally and inserting the results into the collection before we return to the caller
      console.log('performing command', commandText);

      // First echo the command typed
      log.info('cliSendText echoing command:', commandText.trim());
      CliOutput.insert({
          cliId: 1,
          timestamp: new Date().getTime(),
          msg: encodedCommandText.trim()
      });


      var cmd = exec(commandText);
      cmd.stdout.on('data', (data) => {
          // data is in hex, and has a line break at the end
          console.log(('' + data));
          Fiber(function () {
              let system = Settings.findOne({_groupName: 'system', _groupIndex: 0});
              let output = new Buffer('' + data + '\n\r' + system.prompt).toString(
                  "base64");
              CliOutput.insert({
                  cliId: 1,
                  timestamp: new Date().getTime(),
                  msg: output
              });
          }).run();
      });

      cmd.stderr.on('data', (data) => {
          // data is in hex, and has a line break at the end
          console.log(('Error:' + data).slice(0, -1));
          Fiber(function () {
              let system = Settings.findOne({_groupName: 'system', _groupIndex: 0});
              let output = new Buffer('Error: ' + data + '\r\n' + system.prompt).toString(
                  "base64");
              CliOutput.insert({
                  cliId: 1,
                  timestamp: new Date().getTime(),
                  msg: output
              });
          }).run();
      });

      cmd.on('close', (code) => {
          console.log('command exited with code ' + code);
      });
  }
});
