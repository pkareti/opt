module.exports = {
    tags: ['setupwizardcellular'],

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
    title: 'Cellualr config page',
    description: 'Validates the contents of the Cellular config page and its navigation behaviors',
    reference: 'URMA-25, URMA-547',
    sectionName: sar.dftSectionName(__filename)
};

module.exports[sar.encode(tcInfo)] = function (client) {

    // positive test -> Next (works)
    var url = client.globals.get_Device.url;
    var user = client.globals.get_Device.username;
    var pwd = client.globals.get_Device.password;
    var cellularCountry = client.globals.get_Device.cellularcountry ? client.globals.get_Device.cellularcountry : "United States";
    var cellularProvider = client.globals.get_Device.cellularprovider ? client.globals.get_Device.cellularprovider : "AT&T";
    var cellularApnType = client.globals.get_Device.cellularapntype ? client.globals.get_Device.cellularapntype : null;
    var cellularApn = (client.globals.get_Device.cellularapn != undefined) ? client.globals.get_Device.cellularapn : "broadband";

    client
        .url(url)
        .waitForElementVisible(".js-wz-welcome", 5000, "Welcome page opened")
        .page.device().go_next('.js-wz-login')
        .page.login().valid_credential(user, pwd)
        .page.device().go_next(['.js-wz-change-password', '.logout'])
        .page.device().go_next('.js-wz-select-connection')
        .page.select_connection().validate()
        .page.select_connection().select("Cellular")
        .page.cellular_config().selectCountry(cellularCountry)
        .page.cellular_config().selectProvider(cellularProvider)
    if (cellularApnType == "custom") {
        client
            .page.cellular_config().selectAPN("custom")
            .page.cellular_config().selectCustomAPN(cellularApn)
    } else {
        client
            .page.cellular_config().selectAPN(cellularApn)
    }
    client
        .page.device().go_next('.js-wz-cellular-results')
        .page.cellular_results().validate()
        .page.device().go_next('.js-wz-firmware-update')
        .end();

};

// Add the suites with the appropriate testrail annotations
var sar = require('../../sareportable');
var tcInfo = {
    title: 'Cellualr config page - Negative tests',
    description: 'Validates the contents of the Cellular config page and its navigation behaviors for Wrong apn and verify connection times out',
    reference: 'URMA-25, URMA-547',
    sectionName: sar.dftSectionName(__filename)
};

module.exports[sar.encode(tcInfo)] = function (client) {

    //Negative test -> Next (connection timeout works)
    var url = client.globals.get_Device.url;
    var user = client.globals.get_Device.username;
    var pwd = client.globals.get_Device.password;
    var cellularCountry = "other";
    var cellularProvider = "other";
    var cellularApnType = "custom";
    var cellularApn = "xyz";

    client
        .url(url)
        .waitForElementVisible(".js-wz-welcome", 5000, "Welcome page opened")
        .page.device().go_next('.js-wz-login')
        .page.login().valid_credential(user, pwd)
        .page.device().go_next(['.js-wz-change-password', '.logout'])
        .page.device().go_next('.js-wz-select-connection')
        .page.select_connection().validate()
        .page.select_connection().select("Cellular")
        .page.cellular_config().selectCountry(cellularCountry)
        .page.cellular_config().selectProvider(cellularProvider)
        .page.cellular_config().selectAPN("custom")
        .page.cellular_config().selectCustomAPN(cellularApn)
        .page.cellular_config().next("negative")
        .page.cellular_config().verifyTimer()
        .page.cellular_config().retry()
        .page.cellular_config().cancel()
        .end();
};

// Add the suites with the appropriate testrail annotations
var sar = require('../../sareportable');
var tcInfo = {
    title: 'Cellualr config page - All dropdown values',
    description: 'Validates the contents of the Cellular config page and verify right values are populated for cellular config when country,provider, apn drop down are changed',
    reference: 'URMA-25, URMA-547',
    sectionName: sar.dftSectionName(__filename)
};

module.exports[sar.encode(tcInfo)] = function (client) {

    var url = client.globals.get_Device.url;
    var user = client.globals.get_Device.username;
    var pwd = client.globals.get_Device.password;
    var cellularCountries = client.globals.cellularCountries;

    client
        .url(url)
        .waitForElementVisible(".js-wz-welcome", 5000, "Welcome page opened")
        .page.device().go_next('.js-wz-login')
        .page.login().valid_credential(user, pwd)
        .page.device().go_next(['.js-wz-change-password', '.logout'])
        .page.device().go_next('.js-wz-select-connection')
        .page.select_connection().validate()
        .page.select_connection().select("Cellular")
        .page.cellular_config().selectCountry("other")
        .page.cellular_config().verifyCountry("other", "other", "custom", true)
        .page.cellular_config().selectProvider("other")
        .page.cellular_config().verifyProvider("other", "custom", true)
        .page.cellular_config().selectCountry("Brazil")
        .page.cellular_config().verifyCountry("Brazil", "Amazonia", "gprs.amazoniacelular.com.br", false)
        .page.cellular_config().selectCountry("Ukraine")
        .page.cellular_config().verifyCountry("Ukraine", "Ace_Base", "www.ab.kyivstar.net", false)
        .page.cellular_config().selectProvider("other")
        .page.cellular_config().verifyProvider("other", "custom", true)
        .page.cellular_config().selectCountry("United States")
        .page.cellular_config().verifyCountry("United States", "AT&T", "broadband", false)
        .page.cellular_config().selectAPN('custom')
        .page.cellular_config().verifyAPN('custom', true)
        .page.cellular_config().selectProvider("Verizon")
        .page.cellular_config().verifyProvider("Verizon", "", false)
        .page.cellular_config().selectAPN('custom')
        .page.cellular_config().verifyProvider("Verizon", "custom", true)
        /*** call to validate all the selects in cellular page . Test will take at least 3m ***/
        .page.cellular_config().verifyCellularSelects(cellularCountries)
        .end();
};
