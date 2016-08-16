module.exports = {
    tags: ['uiwanconfigcellular'],

    before: function (client, done) {
        console.log('Setting up...');
        client.page.query().set_settings({system: {wizard: 'off'}}).then(function (data) {
            done();
        });
        done();
    },
    after: function (client) {
        console.log('Closing up...');
        client.page.query().set_settings({wan: {interface: 'cellular1'}}).then(function (data) {
            done();
        });
    },
};

// Add the suites with the appropriate testrail annotations
var sar = require('../../sareportable');
var tcInfo = {
    title: 'WAN Config Cellular',
    description: 'Validates the contents and form submission of the Device UI for the cellular WAN config accordion',
    reference: 'URMA-614',
    sectionName: sar.dftSectionName(__filename)
};

module.exports[sar.encode(tcInfo)] = function (client) {
    var url = client.globals.get_Device.url;
    var user = client.globals.get_Device.username;
    var pwd = client.globals.get_Device.password;

    client
        .url(url)
        .waitForElementVisible(".js-dashboard", 5000)
        .page.device_ui().login(user, pwd)
        .page.device_ui().selectNavMenu("wan")
        .waitForElementVisible(".js-wan-cellular1", 5000)
        .page.wan_config().openAccordion(".js-wan-cellular1")
        .page.wan_config().validate_cellular("1")
        .page.wan_config().validateFields_cellular("1")
        .page.wan_config().validateProbe("1")
        .page.wan_config_cellular().validateCancel("1")
        .page.device_ui().logout()
        .end();
};
