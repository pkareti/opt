module.exports = {
    tags:['uiwanconfig'],
    before: function (client, done) {
        console.log('Setting up...');
        client.page.query().set_settings({system: {wizard: 'off'}}).then(function (data) {
            done();
        });
        done();
    },
    after: function (client) {
        console.log('Closing up...');
    },
};

// Add the suites with the appropriate testrail annotations
var sar = require('../../sareportable');
var tcInfo = {
    title: 'WAN Config',
    description: 'Validates the contents and form submission of the Device UI for the WAN config accordions',
    reference: 'URMA-578',
    sectionName: sar.dftSectionName(__filename)
};

module.exports[sar.encode(tcInfo)] = function (client) {
    var url = client.globals.get_Device.url;
    var user = client.globals.get_Device.username;
    var pwd = client.globals.get_Device.password;
    var wrapperClassCellular = '.js-wan-cellular1';
    var wrapperClassEth = '.js-wan-eth1';

    client
        .url(url)
        .waitForElementVisible(".js-dashboard", 5000)
        .page.device_ui().login(user, pwd)
        .page.device_ui().validate_login(user)
        .page.device_ui().selectNavMenu("wan")
        .waitForElementVisible(".js-wan-eth1", 5000)
        .page.wan_config().openAccordion(".js-wan-eth1")
        .page.wan_config().validate_eth1()
        .page.wan_config().validateFields_eth1()
        .page.wan_config().closeAccordion(".js-wan-eth1")
        .page.wan_config().openAccordion(".js-wan-cellular1")
        .page.wan_config().validate_cellular("1")
        .page.wan_config().validateFields_cellular("1")
        .page.wan_config().closeAccordion(".js-wan-cellular1")
        .page.device_ui().logout()
        .end();
};
