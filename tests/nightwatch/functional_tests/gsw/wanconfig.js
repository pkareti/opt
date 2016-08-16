module.exports = {
    tags: ['setupwizardwanconfig'],

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
    title: 'WAN config page',
    description: 'Validates the contents of the WAN config page and its navigation behavior by selecting different connection types',
    reference: 'URMA-26, URMA-520',
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
        .page.select_connection().validate()
        .page.select_connection().select("Cellular")
        .page.device().go_back('.js-wz-select-connection')
        .page.select_connection().select("Ethernet")
        .page.device().logout()
        .end();

};
