module.exports = {
    tags:['uiinterfaceconfigwifi'],

    before: function (client, done) {
        console.log('Setting up...');
        // client.page.query().set_settings({system: {wizard: 'off'}}).then(function (data) {
            done();
        // });
    },
    after : function(client) {
        console.log('Closing up...');
    },
};


// Add the suites with the appropriate testrail annotations
var sar = require('../../sareportable');
var tcInfo = {
    title: 'Interface Config Wifi',
    description: 'Validates the contents and form submission of the Device UI for the wifi inteface config accordion',
    reference: 'URMA-674',
    sectionName: sar.dftSectionName(__filename)
};

module.exports[sar.encode(tcInfo)] =  function (client) {
    var url = client.globals.get_Device.url;
    var user = client.globals.get_Device.username;
    var pwd = client.globals.get_Device.password;

    const wifiInterfaceClass = '.js-interface-wifi';

    client
        .url(url)
        .waitForElementVisible(".js-dashboard", 5000)
        .login(user, pwd).waitForElementVisible('.button-logout', 5000)
        .url(url+'/interfaces').waitForElementVisible(wifiInterfaceClass, 5000)
        .page.interface_wifi(wifiInterfaceClass).openAccordion()
        .page.interface_wifi(wifiInterfaceClass).validateLan('wifi', 1)
        .page.interface_wifi(wifiInterfaceClass).validateDetails('wifi')
        .page.interface_wifi(wifiInterfaceClass).validateDetails('wifi5g')
        .page.interface_wifi(wifiInterfaceClass).validateChangeSelectedInterface('wifi', 1)
        .page.interface_wifi(wifiInterfaceClass).validateEditGlobal()
        .page.interface_wifi(wifiInterfaceClass).validateEditSelected('wifi5g', 2)
        .logout()
        .end();

};
