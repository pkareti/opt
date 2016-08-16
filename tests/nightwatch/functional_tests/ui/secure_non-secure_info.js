module.exports = {
    tags: ['secure_non-secure'],

    before: function (client, done) {
        console.log('Setting up...');
        client.page.query().set_settings({system: {wizard: 'off'}}).then(function (data) {
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
    title: 'Secure and Non-secure Info',
    description: 'Test to verify the functionality of displaying secure and non-secure info in dashboard before login and after login',
    reference: 'URMA-216',
    sectionName: sar.dftSectionName(__filename)
};

module.exports[sar.encode(tcInfo)] = function (client) {

    var url = client.globals.get_Device.url;
    var user = client.globals.get_Device.username;
    var pwd = client.globals.get_Device.password;

    client
        .url(url)
        .waitForElementVisible(".js-dashboard", 15000)

        //Validating secure and non-secure info before login
        .page.dashboard().validate_info("non-secure")
        .verify.visible(".nav-menu")
        //validate_info function takes 2 inputs ("secure" and "non-secure")
        .page.device_ui().login(user, pwd)
        //Validating secure and non-secure info after login
        .page.dashboard().validate_info("secure")
        .verify.visible(".nav-menu")
        .page.device_ui().logout()
        .end();

};
