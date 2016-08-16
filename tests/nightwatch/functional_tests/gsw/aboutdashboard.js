module.exports = {
    tags: ['setupwizardaboutdashboard'],

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
    title: 'About dashboard page',
    description: 'Validate the elements and its navigational behaviours of about dashboard page of setup wizard',
    reference: 'URMA-588',
    sectionName: sar.dftSectionName(__filename)
};

module.exports[sar.encode(tcInfo)] = function (client) {

    var url = client.globals.get_Device.url;
    var user = client.globals.get_Device.username;
    var pwd = client.globals.get_Device.password;
    var dcusername = client.globals.get_Device.dcusername;
    var dcpassword = client.globals.get_Device.dcpassword;

    client
        .url(url)
        .waitForElementVisible(".js-wz-welcome", 5000, "Welcome page opened")
        .page.device().go_next('.js-wz-login')
        .page.login().valid_credential(user, pwd)
        .page.device().go_next(['.js-wz-change-password', '.logout'])
        .page.device().go_next('.js-wz-select-connection')
        .page.select_connection().select("Ethernet")
        .page.device().go_next('.js-wz-firmware-update')
        .page.fw_update().skipToRM()
        .page.rm_connect().enterCredentials(dcusername, dcpassword)
        .page.rm_connect().next()
        .waitForElementVisible(".js-wz-about-the-dashboard", 5000)
        .page.about_dashboard().validate()
        .page.about_dashboard().dashboard_next()
        .end();

};
