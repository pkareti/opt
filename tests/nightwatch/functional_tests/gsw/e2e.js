module.exports = {
    tags: ['setupwizarde2e'],

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

var sar = require('../../sareportable');
var tcInfo = {
    title: 'End-to-End testing',
    description: 'End-to-end testing of Getting started wizard',
    reference: 'URMA',
    sectionName: sar.dftSectionName(__filename)
};

module.exports[sar.encode(tcInfo)] = function (client) {

    var url = client.globals.get_Device.url;
    var user = client.globals.get_Device.username;
    var pwd = client.globals.get_Device.password;
    var newuser = 'newuser';
    var newpwd = 'newpwd!!';
    var cloudserver = client.globals.get_Device.dchost;
    var id = client.globals.get_Device.id;
    var dcusername = client.globals.get_Device.dcusername;
    var dcpassword = client.globals.get_Device.dcpassword;

    client
        .url(url)
        .waitForElementVisible(".js-wz-welcome", 5000, "Welcome page opened")

        //Login page
        .page.device().go_next('.js-wz-login')
        .page.login().validate()
        .page.login().valid_credential(user, pwd)
        .page.device().go_next(['.js-wz-change-password', '.logout'])
        .page.device().validate_login(user)

        //Change username and password page
        .waitForElementVisible(".js-wz-change-password", 5000)
        .page.change_password().validate()
        .page.change_password().change_uname_pwd(newuser, newpwd)
        .page.device().go_next('.js-wz-select-connection')
        .page.device().validate_login(newuser)
        .page.device().logout()
        .page.device().go_next('.js-wz-login')
        .page.login().valid_credential(newuser, newpwd)
        .page.device().go_next(['.js-wz-change-password', '.logout'])
        .page.change_password().change_uname_pwd(user, pwd)
        .page.device().go_next('.js-wz-select-connection')
        .page.device().validate_login(user)

        //Select connection page
        .waitForElementVisible(".js-wz-select-connection", 5000)
        .page.select_connection().validate()
        .page.select_connection().select("Cellular")
        .page.device().go_back('.js-wz-select-connection')
        .page.select_connection().select("Ethernet")

        //Ethernet Results page
        .waitForElementVisible(".js-wz-ethernet-results", 5000)
        .page.ethernet_results().validate()
        .page.device().go_back(".js-wz-select-connection")
        .page.select_connection().select("Cellular")

        //Cellular config page
        .page.cellular_config().validate()
        .page.cellular_config().selectCountry("United States")
        .page.cellular_config().selectProvider("other")
        .assert.attributeEquals("#cellularAPN", "value", "custom")
        .page.cellular_config().selectCustomAPN("12655.MCS")
        .page.cellular_config().next()
        .waitForElementVisible(".cellularResults", 5000)
        .page.cellular_results().validate()

        //Firmware update page
        .page.device().go_next('.js-wz-firmware-update')
        .page.fw_update().validate()
        .page.fw_update().manual()
        .page.device().go_next('.js-wz-login')
        .page.login().valid_credential(user, pwd)
        .page.device().go_next(['.js-wz-change-password', '.logout'])
        .page.device().go_next('.js-wz-select-connection')
        .page.select_connection().select("Ethernet")
        .page.device().go_next('.js-wz-firmware-update')
        .page.fw_update().validate()

        //Remote manager page
        .page.fw_update().skipToRM()
        .page.rm_connect().validate()
        .page.rm_connect().links()
        .page.rm_connect().enterCredentials(dcusername, dcpassword)
        .page.rm_connect().next()
        .page.rm_connect().verifyDeviceProvisioning(cloudserver, id, dcusername, dcpassword)

        //About dashboard page
        .page.about_dashboard().validate()
        .page.about_dashboard().dashboard_next()
        .waitForElementVisible(".js-dashboardgit a", 5000, "Dashboard page opened")
        .end();
};

