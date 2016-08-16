// Can we refernce the objects that are used to map the tables and forms?
// var wifiDetails = require('meteor/digi:urma-tlr/interfaces/components/wifi-details.jsx');

module.exports = function (client, wrapperClass) {

    this.openAccordion = function () {
        client
            .click(wrapperClass+' .expander-trigger')
            .waitForElementVisible('.accordion-content', 5000)

        return client;
    };

    this.validateLan = function (group, wifiIndex) {
        var url = client.globals.get_Device.url;
        var interfaceName = group + wifiIndex;

        // Validate modal appears when changes made and clicking on lan network link.
        // Check route works, reopen wifi interface config
        client
            .waitForElementVisible(wrapperClass+' .js-wifi-details', 5000)
            .setInput(wrapperClass+' input[name=ssid]', 'test ssid')
            .click(wrapperClass+' .js-'+interfaceName+' .js-lan-path')
            .waitForElementVisible('.js-confirm-dialog', 5000)
            .click('.js-confirm-dialog .js-ok-btn')
            .waitForElementVisible('.js-local-networks', 5000)
            // ToDo -> validate proper lan url query and lan accordion opened.

            // back to interface page
            .url(url+'/interfaces').waitForElementVisible(wrapperClass, 5000);

        this.openAccordion();

        return client;
    };

    // Validates the settings displayed in wifi-details.jsx
    this.validateDetails = function (group) {

        client
            .waitForElementVisible(wrapperClass+' .js-wifi-details.js-'+group, 5000)
            .expect.element(wrapperClass+' .js-wifi-details .js-value').to.have.value.not.equals('');

        // for each wifi setting, verify displayed data matches query:
        // client.perform(function (client, done) {
            client.page.query().settings(group).then(function (data) {
                for (var i = 0; i < data[group].length; i++) {
                    var wifiIndex = i + 1;
                    var interfaceName = group + wifiIndex;
                    var settingsClass = wrapperClass + ' .js-' + interfaceName;
                    console.log('data '+interfaceName+': ', data);
                    client
                        .assert.containsText(settingsClass + ' .js-value-ssid', data.wifi.ssid)
                        .assert.containsText(settingsClass + ' .js-value-description', data.wifi.description)
                        .assert.containsText(settingsClass + ' .js-value-state', data.wifi.state)
                        .assert.containsText(settingsClass + ' .js-value-broadcast_ssid', data.wifi.broadcast_ssid)
                        .assert.containsText(settingsClass + ' .js-value-security', data.wifi.security)
                }
            });
        // });

        return client;
    };

    // Validate changing selected interface after editing settings displays dialog alert
    this.validateChangeSelectedInterface = function (group, wifiIndex) {
        var interfaceName = group + wifiIndex;

        client
            .waitForElementVisible(wrapperClass+' .js-wifi-details.js-' + group, 5000)
            .setInput(wrapperClass+' input[name=ssid]', 'test ssid')
            .click(wrapperClass + ' input[type=radio][name='+interfaceName+']') // select provide input
            .waitForElementVisible('.js-confirm-dialog', 5000)
            .click('.js-confirm-dialog .js-ok-btn')

            // validate radio is checked
            .element('css selector', 'input[type=radio][name='+interfaceName+']', function(response) {
                client.elementIdSelected(response.value.ELEMENT, function(result) {
                    client.verify.ok(result.value, 'Checkbox is selected');
                });
            });

        return client;
    };

    // Validates the functionality of editing global wifi settings
    this.validateEditGlobal = function () {
        // ToDo -> get current values
        var current_wifi_channel = '';
        var current_wifi5g_channel = '';

        // verify unique values
        var wifiValue = current_wifi_channel !== '11' ? '11' : '10';
        var wifi5gValue = current_wifi5g_channel !== '48' ? '48' : '44';

        client
            .waitForElementVisible(wrapperClass + ' .js-wifi-globals-form', 5000)
            .setSelect(wrapperClass+' select[name=wifi_channel]', wifiValue)
            .setSelect(wrapperClass+' select[name=wifi5g_channel]', wifi5gValue)
            .click(wrapperClass + ' .js-apply')

            // .perform(function (client, done) {
                client.page.query().settings("wifi_global").then(function(data){
                    client.assert.equal(data.wifi_global.wifi_channel, wifiValue, "wifi_channel succefully changed")
                    client.assert.equal(data.wifi_global.wifi5g_channel, wifiValue, "wifi5g_channel succefully changed")
                    done();
                });
            // });

        // return to previous settings
        // .setSelect(wrapperClass+' select[name=wifi_channel]', current_wifi_channel)
        // .setSelect(wrapperClass+' select[name=wifi5g_channel]', current_wifi5g_channel)

        return client;
    };

    // Validates the functionality of editing a selected intereface
    this.validateEditSelected = function (group, wifiIndex) {

        var settingWrapper = wrapperClass + ' .js-wifi-interface-form';
        var interfaceName = group + wifiIndex;

        // ToDo -> get current values
        var current_state = '';
        var current_broadcast_ssid = '';
        var current_isolate_clients = '';
        var current_isolate_ap = '';

        var stateValue = current_state !== 'on' ? 'on' : 'off';
        var broadcastSsidValue = current_broadcast_ssid !== 'on' ? 'on' : 'off';
        var isolateClientValue = current_isolate_clients !== 'on' ? 'on' : 'off';
        var isolateApValue = current_isolate_ap !== 'on' ? 'on' : 'off';


        client
            .waitForElementVisible(wrapperClass, 5000)
            .click(wrapperClass + ' input[type=radio][name='+interfaceName+']') // select provide input
            .waitForElementVisible(wrapperClass + ' .js-wifi-interface-form', 5000)
            .setSelect(settingWrapper+' select[name=security]', 'wpa2_personal')
            .setInput(settingWrapper+' input[name=ssid]', 'test edit ssid')
            .setInput(settingWrapper+' input[name=password]', 'w1fi_p@ssw0rd')
            .setInput(settingWrapper+' textarea[name=description]', 'functional test description')

            .click(settingWrapper + ' input[name=state][value=' + stateValue + ']')
            .click(settingWrapper + ' input[name=broadcast_ssid][value=' + broadcastSsidValue + ']')
            .click(settingWrapper + ' input[name=isolate_clients][value=' + isolateClientValue + ']')
            .click(settingWrapper + ' input[name=isolate_ap][value=' + isolateApValue + ']')

            // ToDo -> test radius settings change
            // .setInput(wrapperClass+' input[name=radius_server]', <ipNumber>);
            // .setInput(wrapperClass+' input[name=radius_server_port]', 81);

            .click(wrapperClass + ' .js-apply')


            // .perform(function (client, done) {
                client.page.query().settings(group, wifiIndex).then(function (data) {
                    console.log('data '+group+':', data);
                    client
                        .assert.containsText(settingsClass + ' .js-value-ssid', data.wifi.ssid)
                        .assert.containsText(settingsClass + ' .js-value-description', data.wifi.description)
                        .assert.containsText(settingsClass + ' .js-value-state', data.wifi.state)
                        .assert.containsText(settingsClass + ' .js-value-broadcast_ssid', data.wifi.broadcast_ssid)
                        .assert.containsText(settingsClass + ' .js-value-security', data.wifi.security)
                        .assert.containsText(settingsClass + ' .js-value-isolate_clients', data.wifi.isolate_clients)
                        .assert.containsText(settingsClass + ' .js-value-isolate_ap', data.wifi.isolate_ap)

                        // password not returned
                });
            // });

            // ToDo -> return to previous settings

        return client;
    };
}
