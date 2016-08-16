module.exports = {
    tags:['uiwanconfigeth'],

    before: function (client, done) {
        console.log('Setting up...');
        client.page.query().set_settings({system: {wizard: 'off'}}).then(function (data) {
            done();
        });
    },
    after : function(client) {
        console.log('Closing up...');
    },
};

// Add the suites with the appropriate testrail annotations
var sar = require('../../sareportable');
var tcInfo = {
    title: 'WAN config - Eth_manual',
    description: 'Validates the functionalities of the Eth config in WAN config page (Manual IP settings)',
    reference: 'URMA-618',
    sectionName: sar.dftSectionName(__filename)
};

module.exports[sar.encode(tcInfo)] =  function (client) {
    var url = client.globals.get_Device.url;
    var user = client.globals.get_Device.username;
    var pwd = client.globals.get_Device.password;
    /*** Please update globals.js with valid Ip, mask, dns1, and dns2 to run the manual IP settings test */
    client
        .url(url)
        .waitForElementVisible(".js-dashboard", 5000)
        .page.device_ui().login(user, pwd)
        .page.device_ui().selectNavMenu("wan")
        .waitForElementVisible(".js-wan-eth1", 5000)
        .page.wan_config().openAccordion(".js-wan-eth1")
        .page.wan_config_eth().validateIPSettings_manual()
        .end();
};

var sar = require('../../sareportable');
var tcInfo = {
    title: 'WAN config - Eth_DHCP',
    description: 'Validates the functionalities of the Eth config in WAN config page (DHCP settings)',
    reference: 'URMA-618',
    sectionName: sar.dftSectionName(__filename)
};

module.exports[sar.encode(tcInfo)] =  function (client) {
    var url = client.globals.get_Device.url;
    var user = client.globals.get_Device.username;
    var pwd = client.globals.get_Device.password;
    var lan1_url = client.globals.get_Device.lan1_url;
    /***For this DHCP tests, We need a better way to handle IP change (UI responsiveness).
     * If user uses only one port(eth1) and use that same port's IP to open UI the page will break when apply DHCP
     * For this test we have used second port(eth2) in device and opens eth2 IP and make changes to eth1 config
     * For automated tests device need to be connected via eth2 port also to run this test. And lan1 or Eth2 port url should be defined in globals ***/
    client
        .url(lan1_url)
        .waitForElementVisible(".js-dashboard", 5000)
        .page.device_ui().login(user, pwd)
        .page.device_ui().selectNavMenu("wan")
        .waitForElementVisible(".js-wan-eth1", 5000)
        .page.wan_config().openAccordion(".js-wan-eth1")
        .page.wan_config_eth().validateIPSettings_dhcp()
        .end();
};