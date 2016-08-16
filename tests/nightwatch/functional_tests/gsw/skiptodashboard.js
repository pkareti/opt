module.exports = {
    tags: ['setupwizardskiptodashboard'],

    beforeEach: function (client, done) {
        console.log('Setting up...');
        client.page.query().set_settings({system: {wizard: 'on'}}).then(function (data) {
            done();
        });
    },

    after: function (client) {
        console.log('Closing up...');
    },
};

// Add the suites with the appropriate testrail annotations
var sar = require('../../sareportable');
var tcInfo = {
    title: 'Skip to dashboard function - Ethernet results page',
    description: 'Tests the skip to dashboard functionality from Ethernet results page',
    reference: 'URMA-27',
    sectionName: sar.dftSectionName(__filename)
};

module.exports[sar.encode(tcInfo)] = function (client) {
    var url = client.globals.get_Device.url;
    var user = client.globals.get_Device.username;
    var pwd = client.globals.get_Device.password;

    client

        .url(url)
        .waitForElementVisible(".js-wz-welcome", 5000, "Welcome page opened")
        .page.device().go_next('.js-wz-login')
        .page.login().valid_credential(user, pwd)
        .page.device().go_next(['.js-wz-change-password', '.logout'])
        .page.device().go_next('.js-wz-select-connection')
        .page.select_connection().select("Ethernet")
        .page.device().skip_to_dashboard()

        .end();


};

// Add the suites with the appropriate testrail annotations
var sar = require('../../sareportable');
var tcInfo = {
    title: 'Skip to dashboard function - Remote manager page',
    description: 'Tests the skip to dashboard functionality from Remote manager page',
    reference: 'URMA-427',
    sectionName: sar.dftSectionName(__filename)
};

module.exports[sar.encode(tcInfo)] = function (client) {
    var url = client.globals.get_Device.url;
    var user = client.globals.get_Device.username;
    var pwd = client.globals.get_Device.password;

    client

        .url(url)
        .waitForElementVisible(".js-wz-welcome", 5000, "Welcome page opened")
        .page.device().go_next('.js-wz-login')
        .page.login().valid_credential(user, pwd)
        .page.device().go_next(['.js-wz-change-password', '.logout'])
        .page.device().go_next('.js-wz-select-connection')
        .page.select_connection().select("Ethernet")
        .page.device().go_next('.js-wz-firmware-update')
        .page.fw_update().skipToRM()
        .page.device().skip_to_dashboard()

        .end();


};
