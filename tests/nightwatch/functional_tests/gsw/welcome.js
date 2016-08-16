module.exports = {
    tags: ['setupwizardwelcome'],

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
    title: 'Welcome page',
    description: 'Validates the contents of the welcome page and its navigation behavior',
    reference: 'URMA-22',
    sectionName: sar.dftSectionName(__filename)
};

module.exports[sar.encode(tcInfo)] = function (client) {

    var url = client.globals.get_Device.url;
    var user = client.globals.get_Device.username;
    var pwd = client.globals.get_Device.password;

    client
        .url(url)
        .waitForElementVisible(".js-wz-welcome", 5000, "Welcome page opened")
        //Welcome page
        .page.welcome().validate()
        .page.welcome().links()
        .page.device().go_next('.js-wz-login')

        .end();
}
