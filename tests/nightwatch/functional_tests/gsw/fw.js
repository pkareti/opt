module.exports = {
    tags: ['setupwizardfw'],

    before: function (client, done) {
        console.log('Setting up...');
        client.page.query().set_settings({system: {wizard: 'on'}}).then(function (data) {
            done();
        });
    },

    after: function (client, done) {
        console.log('Closing up...');
        done();
    },
};

// Add the suites with the appropriate testrail annotations
var sar = require('../../sareportable');
var tcInfo = {
    title: 'Firmware update page - Automated update',
    description: 'Validates the contents of the Firmware uppdate page and its functionalities to update firmware of the connected device (Automated)',
    reference: 'URMA-441',
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
        .page.fw_update().validate()
        .page.fw_update().auto()
        .waitForElementVisible(".js-wz-welcome", 5000, "Welcome page opened")
        .page.device().go_next('.js-wz-login')
        .page.login().valid_credential(user, pwd)
        .page.device().go_next(['.js-wz-change-password', '.logout'])
        .page.device().go_next('.js-wz-select-connection')
        .page.select_connection().select("Ethernet")
        .page.device().go_next('.js-wz-firmware-update')
        .page.fw_update().validate_version()
        .page.device().logout()
        .end();

};

// Add the suites with the appropriate testrail annotations
var sar = require('../../sareportable');
var tcInfo = {
    title: 'Firmware update page - Manual update',
    description: 'Validates the contents of the Firmware uppdate page and its functionalities to update firmware of the connected device (Manully selecting a Firmware image in local drive (downloaded from Digi website) and update)',
    reference: 'URMA-437',
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
        .page.fw_update().validate()
        .page.fw_update().manual()
        .waitForElementVisible(".js-wz-welcome", 5000, "Welcome page opened")
        .page.device().go_next('.js-wz-login')
        .page.login().valid_credential(user, pwd)
        .page.device().go_next(['.js-wz-change-password', '.logout'])
        .page.device().go_next('.js-wz-select-connection')
        .page.select_connection().select("Ethernet")
        .page.device().go_next('.js-wz-firmware-update')
        .page.fw_update().validate_version()
        .page.device().logout()

        .end();

};
