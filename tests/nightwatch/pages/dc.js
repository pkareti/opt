'use strict';

var _ = require('lodash'); //jshint ignore:line
var qHTTP = require('q-io/http');
var xml2js = require('xml2js');
var debug = require('debug')('dc');


var DC = {
    _getDefaultOptions: function (options) {
        var o = {};
        o.scheme = options.scheme || 'https';
        o.ssl = o.scheme == 'https';
        o.hostname = options.hostname;
        o.port = options.port || o.scheme === 'https' ? 443 : 80;
        o.headers = options.headers || {}
        o.headers.Accept = o.headers.Accept || 'application/json';
        return o;
    },

    /**
     * These options are used to parse the xml output of DC into json objects
     * returned to the caller. We've defined what we think are reasonable parsing
     * options but the caller can override these if desired.
     * See: https://github.com/buglabs/node-xml2json
     */
    _xml2jsOptions: {
        explicitArray: false,
        attrkey: '@',
        mergeAttrs: true,
        trim: true,
        valueProcessors: [xml2js.processors.parseNumbers, xml2js.processors.parseBooleans],
        async: false
    },


    /**
     * Send an sci request to the specified deviceId's. Return the response
     * in json form
     *
     * @param operation - the request operation
     * @param deviceIds - a single or list of deviceId's to send the request to
     * @param payload - payload for the operation
     * @param options - optional sci operation options string: examples include:
     *     reply="all|errors|none"
     *     synchronous="true|false"
     *     syncTimeout="xxx"
     *     cache="true|false|only"
     *     allowOffline="true|false"
     *     waitForReconnect="true|false"
     * @returns {*} as {statusCode:xxx, data:yyy} on success. On error it throws errors[] to caller
     */
    sciRequest: function (operation, deviceIds, payload, sciOptions, httpOptions) {
        if (deviceIds.constructor !== Array) {
            deviceIds = [deviceIds];
        }
        var targetList = '';
        for (var i = 0; i < deviceIds.length; i++) {
            targetList += '<device id="' + deviceIds[i] + '"/>';
        }
        var xml =
            '<sci_request version="1.0">' +
            '<' + operation + ' ' + (sciOptions || '') + '>' +
            '<targets>' +
            targetList +
            '</targets>' +
            payload +
            '</' + operation + '>' +
            '</sci_request>';

        httpOptions = DC._getDefaultOptions(httpOptions);
        var request = {
            method: 'POST',
            scheme: httpOptions.scheme,
            ssl: httpOptions.ssl,
            host: httpOptions.hostname,
            port: httpOptions.port,
            path: '/ws/sci/.json?size=1',
            headers: {
                Authorization: httpOptions.headers.Authorization,
                Accept: 'application/json'
            },
            body: [xml]
        };

        debug('sending sci command: ', xml, ' with options: ',
            httpOptions);
        debug('request: ', request);
        return qHTTP.request(request).then(function (res) {
            // console.log('res: ', res);
            return res.body.read().then(function (text) {
                if (res.status == 401) {
                    throw new Error('Not Authorized');
                }
                var xmlresponse = text.toString();
                debug('** sci returned body of length ' + xmlresponse.length);
                var jsonresponse;
                xml2js.parseString(xmlresponse, DC._xml2jsOptions, function (err, result) {
                    if (err) {
                        debug('error parsing sci response: err=', err, ' msg=', xmlresponse);
                        throw err;
                    }
                    jsonresponse = result;
                });
                return jsonresponse;
            });
        }).fail(function (error) {
            debug('error sending sci request: ' + error);
            throw error;
        });
    },

    /**
     * Queries settings of a device. Return the response in json form
     *
     * @param deviceId - the connectware id of the device (ex "00000000-00000000-00000000-00000000")
     * @param httpOptions - the device cloud host and credentials
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
    querySettings: function (deviceId, httpOptions, groupname, groupindex) {
        debug('querying settings');
        var operation = 'send_message';
        var payload =
            '<rci_request version="1.1">' +
            (!groupname ?
                    '<query_setting/>' :
                    ('<query_setting>' +
                    '<' + groupname + (!groupindex ? '' : ' index="' + groupindex +
                    '"') + '/>' +
                    '</query_setting>')
            ) +
            '</rci_request>';
        var sciOptions = 'reply="all" synchronous="true" cache="false"';
        var response = DC.sciRequest(operation, deviceId, payload, sciOptions, httpOptions);
        return response.then(function (fullResponse) {
            try {
                return fullResponse.sci_reply.send_message.device.rci_reply.query_setting;
            } catch (e) {
                debug('error dereferencing query setting results', e);
                throw new Error('Query setting error: ' + JSON.stringify(response));
            }
        });
    },

    /**
     * Set settings of a device. Return the response in json form
     *
     * @param deviceId - the connectware id of the device (ex "00000000-00000000-00000000-00000000")
     * @param httpOptions - the device cloud host and credentials
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
    setSettings: function (deviceId, httpOptions, settings) {
        debug('set settings');
        var operation = 'send_message';
        var rci = '<rci_request version="1.1">{1}</rci_request>';

        var bldrOptions = {rootName: 'set_setting', headless: true, renderOpts: {pretty: false}};
        var builder = new xml2js.Builder(bldrOptions);
        var xml = builder.buildObject(settings);
        var payload = rci.replace('{1}', xml);

        var response = DC.sciRequest(operation, deviceId, payload, null, httpOptions);
        return response.then(function (fullResponse) {
            try {
                return fullResponse.sci_reply.send_message.device.rci_reply.set_setting;
            } catch (e) {
                debug('error dereferencing set setting results', e);
                throw new Error('Set setting error: ' + JSON.stringify(response));
            }
        });
    },

    /**
     * Queries state of a device. Return the response in json form
     *
     * @param deviceId - the connectware id of the device (ex "00000000-00000000-04FDFFFF-FFFF0001")
     * @param httpOptions - the device cloud host and credentials
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
    queryState: function (deviceId, httpOptions, groupname, groupindex) {
        debug('querying state');
        var operation = 'send_message';
        var payload =
            '<rci_request version="1.1">' +
            (!groupname ?
                    '<query_state/>' :
                    ('<query_state>' +
                    '<' + groupname + (!groupindex ? '' : ' index="' + groupindex +
                    '"') + '/>' +
                    '</query_state>')
            ) +
            '</rci_request>';
        var sciOptions = 'reply="all" synchronous="true" cache="false"';
        var response = DC.sciRequest(operation, deviceId, payload, sciOptions, httpOptions);
        return response.then(function (fullResponse) {
            try {
                return fullResponse.sci_reply.send_message.device.rci_reply.query_state;
            } catch (e) {
                debug('error dereferencing query state results', e);
                throw new Error('Query state error: ' + JSON.stringify(response));
            }
        });
    },

    // TODO: additional operations that would be helpful
    // setState: function() {
    //   console.log('setting settings');
    // }
}

module.exports = DC;
