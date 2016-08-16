module.exports = function (client) {
    'use strict';
    var DC = require('./dc');

// Here are some examples of using the DC module
// Setup device cloud server and credentials

// Get credentials and device information from globals

    var username = client.globals.get_Device.dcusername;
    var password = client.globals.get_Device.dcpassword;
    var deviceId = client.globals.get_Device.id;

// setup options for subsequent DC calls

    var dcOpts = {
        hostname: client.globals.get_Device.dchost,
        headers: {
            Authorization: "Basic " + Buffer(username + ":" + password).toString(
                'base64')
        }

    }

    /**
     * Query settings of the device.
     * @param groupname - optional. scopes results to specified group
     * @param groupindex - optional. scopes results to specified group instance
     * @returns promise to object containing results on success. On error it throws errors[] to caller
     *    results will be keyed by group name. If group has multiple instances returned it will be an array.
     *      ex:  {
   *              system: {
   *                 ...
   *              }
   *              eth: [{
   *                   index: 2,
   *                   ...
   *                }, {
   *                   index: 2,
   *                   ...
   *                }
   *              ],
   *              ...
   *            }
     */

    this.settings = function (group, group_index) {
        // Query settings for a device
        return DC.querySettings(deviceId, dcOpts, group, group_index);
    };

    /**
     * Set settings of the device.
     * @param settings - object containing the settings to be set. The format of this object follows rules
     *    of the xml2js Builder. For example, to set lan 2 and system settings the object might look like this:
     *     {
   *       lan: {
   *         $: {index: "2"},
   *         state: "on",
   *         ip_address: "10.20.1.24"
   *       },
   *       system: {
   *         wizard: "on"
   *       }
   *     }
     * @returns promise to object containing results on success. On error it throws errors[] to caller.
     */

    this.set_settings = function (settings) {
        // Set settings for a device
        return DC.setSettings(deviceId, dcOpts, settings);
    };

    /**
     * Query state of the device.
     * @param groupname - optional. scopes results to specified group
     * @param groupindex - optional. scopes results to specified group instance
     * @returns promise to object containing results on success. On error it throws errors[] to caller
     *    results will be keyed by group name. If group has multiple instances returned it will be an array.
     *      ex:  {
   *              system: {
   *                 ...
   *              }
   *              eth: [{
   *                   index: 2,
   *                   ...
   *                }, {
   *                   index: 2,
   *                   ...
   *                }
   *              ],
   *              ...
   *            }
     */

    this.state = function (group, group_index) {
        // Query state for a device
        return DC.queryState(deviceId, dcOpts, group, group_index);
    };
}
