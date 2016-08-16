module.exports = {
    tags:['uiinterfacecellular'],

    before: function (client, done) {
        console.log('Setting up...');
        client.page.query().set_settings({system: {wizard: 'off'}}).then(function (data) {
            done();
        });
        done();
    },
    after : function(client) {
        console.log('Closing up...');
    },
};

// Add the suites with the appropriate testrail annotations
var sar = require('../../sareportable');
var tcInfo = {
    title: 'Interface Cellular',
    description: 'Validates the contents and form submission of the Device UI for the cellular interface accordion',
    reference: 'URMA-143',
    sectionName: sar.dftSectionName(__filename)
};

module.exports[sar.encode(tcInfo)] =  function (client) {
    var url = client.globals.get_Device.url;
    var user = client.globals.get_Device.username;
    var pwd = client.globals.get_Device.password;

    const cellularInterfaceClass = '.js-interface-cellular';

    client
        .url(url)
        .waitForElementVisible(".js-dashboard", 5000)
        .page.device_ui().login(user, pwd)
        .page.device_ui().selectNavMenu("interfaces")
        .waitForElementVisible(".js-interface-cellular", 5000)
        .page.interface_cellular(cellularInterfaceClass).openAccordion()
        .page.interface_cellular(cellularInterfaceClass).validateWan('1')
        .page.interface_cellular(cellularInterfaceClass).validateSettings(1)
        .page.interface_cellular(cellularInterfaceClass).validateCancel()
        .page.interface_cellular(cellularInterfaceClass).validateConfig(1)
        .page.interface_cellular(cellularInterfaceClass).validateConfig(2)
        .page.device_ui().logout()
        .end();
};
