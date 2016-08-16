module.exports = {
    tags: ['uidashboard'],

    before: function (client, done) {
        console.log('Setting up...');
        client.page.query().set_settings({system: {wizard: 'off'}}).then(function (data) {
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
    title: 'Dashboard page',
    description: 'Validates the contents of the Device UI home page (dashboard)and its navigation behaviors',
    reference: 'URMA-216, URMA-629',
    sectionName: sar.dftSectionName(__filename)
};

module.exports[sar.encode(tcInfo)] = function (client) {

    var url = client.globals.get_Device.url;
    var user = client.globals.get_Device.username;
    var pwd = client.globals.get_Device.password;

    client
        .url(url)
        .waitForElementVisible(".js-dashboard", 15000)
        .page.device_ui().login(user, pwd)
        .page.device_ui().validate_login(user)
        .page.dashboard().validateNetworkActivity()
        .page.dashboard().validateCloud()
        .page.dashboard().validateSystem()
        .page.dashboard().validateInterfaces()
        .page.dashboard().validateLAN()
        .page.device_ui().logout()
        .end();

};
