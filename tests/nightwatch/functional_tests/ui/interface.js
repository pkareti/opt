module.exports = {
    tags:['uiInterface'],
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
    title: 'Interface',
    description: 'Validates the contents and form submission of the Device UI for the WAN config accordions',
    reference: 'URMA-143, URMA-585',
    sectionName: sar.dftSectionName(__filename)
};

module.exports[sar.encode(tcInfo)] =  function (client) {
    var url = client.globals.get_Device.url;
    var user = client.globals.get_Device.username;
    var pwd = client.globals.get_Device.password;

    client
        .url(url)
        .waitForElementVisible(".js-dashboard", 5000)
        .page.device_ui().login(user, pwd)
        .page.device_ui().validate_login(user)
        .page.device_ui().selectNavMenu("interfaces")
        .waitForElementVisible(".js-interface-wifi", 5000)
        .page.interface_config().openAccordion(".js-interface-wifi")
        /*.page.interface_config().validate_wifi()
        .page.interface_config().validateFields_wifi()
        .page.interface_config().closeAccordion(".js-interface-wifi")*/
        .page.interface_config().openAccordion(".js-interface-cellular")
        .page.interface_config().validate_cellular()
        .page.interface_config().validateFields_cellular()
        .page.interface_config().closeAccordion(".js-interface-cellular")
        .page.device_ui().logout()
        .end();
};
