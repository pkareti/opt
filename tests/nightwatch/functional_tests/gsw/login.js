module.exports = {
    tags: ['setupwizardlogin'],

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
    title: 'Login page',
    description: 'Validates the contents of the login page and tests the user authentication functionalities',
    reference: 'URMA-23, URMA-440',
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
        .page.login().validate()
        .page.login().invalid_nocredential("Failed login")
        .page.login().invalid_invalidcredential("not admin", "not admin", "Failed login")
        .page.login().valid_credential(user, pwd)
        .page.device().go_next(['.js-wz-change-password', '.logout'])
        .page.device().validate_login(user)
        .page.device().logout()

        .end();

};

