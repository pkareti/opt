/**
 * GET data from the specified path.
 *
 * @method get
 * @param {string}   path    The absolute path to fetch
 * @param {object}   options additional options for request if any
 * @param {function} success A callback on success
 */

var util = require('util');
var events = require('events');

function Get() {
}
util.inherits(Get, events.EventEmitter);

Get.prototype.command = function (path, options, success) {
    var request = require("request");

    request.get(path, options, function (error, response) {
        if (error) {
            console.log(error);
            return;
        }

        success(response);
        this.emit('complete');
    }.bind(this));
};

module.exports = Get;