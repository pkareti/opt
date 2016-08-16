module.exports = {
    tags: ['setupwizardrm'],

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
    title: 'Remote Manager page - Failed to connect',
    description: 'Validates the contents of the Remote manager page and its functionalities to add the device to DC (Failed to connect)',
    reference: 'URMA-27, URMA-538, URMA-539, URMA-540, URMA-524',
    sectionName: sar.dftSectionName(__filename)
};
module.exports[sar.encode(tcInfo)] = function (client) {

    var url = client.globals.get_Device.url;
    var user = client.globals.get_Device.username;
    var pwd = client.globals.get_Device.password;
    var cloudserver = client.globals.get_Device.dchost;
    var id = client.globals.get_Device.id;
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
        .page.rm_connect().validate()
        .page.rm_connect().links()
        .page.rm_connect().enterCredentials("", "")
        .page.rm_connect().next('invalid')
        .page.rm_connect().enterCredentials("dcuser", "dcpassword")
        .page.rm_connect().next('invalid')
        .end();
};

// Add the suites with the appropriate testrail annotations
var sar = require('../../sareportable');
var tcInfo = {
    title: 'Remote Manager page - Adding a device',
    description: 'Validates the contents of the Remote manager page and its functionalities to add the device to DC (valid credentials (Also Verifying Device provisioned in device cloud))',
    reference: 'URMA-27, URMA-538, URMA-539, URMA-540, URMA-524',
    sectionName: sar.dftSectionName(__filename)
};
module.exports[sar.encode(tcInfo)] = function (client) {

    var url = client.globals.get_Device.url;
    var user = client.globals.get_Device.username;
    var pwd = client.globals.get_Device.password;
    var dcusername = client.globals.get_Device.dcusername;
    var dcpassword = client.globals.get_Device.dcpassword;
    var cloudserver = client.globals.get_Device.dchost;
    var id = client.globals.get_Device.id;
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
        .page.rm_connect().validate()
        .page.rm_connect().links()
        .perform(function (client, done) {
            client.page.rm_connect().removeDevice(cloudserver, id, dcusername, dcpassword);
            done();
        })
        .page.rm_connect().enterCredentials(dcusername, dcpassword)
        .page.rm_connect().next()
        .page.rm_connect().verifyDeviceProvisioning(cloudserver, id, dcusername, dcpassword)
        .page.about_dashboard().validate()
        .page.about_dashboard().dashboard_next()
        .end();
};
