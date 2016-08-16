module.exports = {
    tags: ['setupwizardcellularVerizon'],

    before: function (client, done) {
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
    title: 'Cellular config page: Verizon (valid)',
    description: 'Validates the contents of the Cellular config page and its functionalities with a Verizon Sim card with getting valid connection via Set up wizard',
    reference: 'URMA-25, URMA-547',
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
        .page.select_connection().select("Cellular")
        .page.cellular_config().validate()
        .page.cellular_config().selectCountry("United States")
        .page.cellular_config().selectProvider("Verizon")
        .assert.elementNotPresent("#AdvancedLink")
        .page.cellular_config().selectAPN("")
        .page.cellular_config().next()
        .waitForElementVisible(".cellularResults", 5000)
        .page.cellular_results().validate()
        .page.device().logout()
        .end();
};

// Add the suites with the appropriate testrail annotations
var sar = require('../../sareportable');
var tcInfo = {
    title: 'Cellular config page: Verizon (invalid)',
    description: 'Validates the contents of the Cellular config page and its functionalities with a Verizon Sim card with getting failed to connect via Set up wizard',
    reference: 'URMA-25, URMA-547',
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
        .page.select_connection().select("Cellular")
        .page.cellular_config().selectCountry("United States")
        .page.cellular_config().selectProvider("AT&T")
        .page.cellular_config().selectAPN("broadband")
        .page.cellular_config().next('negative')
        .page.cellular_config().cancel()
        .end();
};
