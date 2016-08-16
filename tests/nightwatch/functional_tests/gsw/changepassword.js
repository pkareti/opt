module.exports = {
    tags: ['setupwizardchangepassword'],
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

/*
 * These tests validate the behavior of the change password page of
 * the getting started Wizard. These tests assume that the device under test
 * are initially configured with the following credentials:
 *      username: client.globals.localhost.username
 *      password: client.globals.localhost.password
 *
 * Furthermore the these credentials must already adhere to the password rules of the GSW
 *
 * Each test will reset the state of the device credentials back to its original state
 */
/*
 // Add the suites with the appropriate testrail annotations
 var sar = require('../../sareportable');
 var tcInfo = {
 title: 'Change password page - No change',
 description: 'Validates the contents of the change username/password page and tests its functionalities without changing anything',
 reference: 'URMA-410, URMA-560, URMA-555, URMA-556, URMA-557, URMA-558',
 sectionName: sar.dftSectionName(__filename)
 };
 module.exports[sar.encode(tcInfo)] = function(client){

 // change nothing -> Next (works)
 var url = client.globals.get_Device.url;
 var user = client.globals.get_Device.username;
 var pwd = client.globals.get_Device.password;

 client
 .url(url)
 .waitForElementVisible(".js-wz-welcome", 5000, "Welcome page opened")
 .page.device().go_next('.js-wz-login')
 .page.login().valid_credential(user, pwd)
 .page.device().go_next(['.js-wz-change-password', '.logout'])
 .page.change_password().validate()
 .page.device().go_next('.js-wz-select-connection')
 .page.device().validate_login(user)
 .page.device().logout()

 //CLEANUP: none
 .end();
 };

 // Add the suites with the appropriate testrail annotations
 var sar = require('../../sareportable');
 var tcInfo = {
 title: 'Change password page - Change username only',
 description: 'Validates the contents of the change username/password page and tests its functionalities with changing only username',
 reference: 'URMA-410, URMA-560, URMA-555, URMA-556, URMA-557, URMA-558',
 sectionName: sar.dftSectionName(__filename)
 };

 module.exports[sar.encode(tcInfo)] = function(client){

 // change just username -> Next (works)
 var url = client.globals.get_Device.url;
 var user = client.globals.get_Device.username;
 var pwd = client.globals.get_Device.password;
 var newuser = 'newuser';

 client
 .url(url)
 .waitForElementVisible(".js-wz-welcome", 5000, "Welcome page opened")

 .page.device().go_next('.js-wz-login')
 .page.login().valid_credential(user, pwd)
 .page.device().go_next(['.js-wz-change-password', '.logout'])
 .page.device().validate_login(user)
 .page.change_password().change_uname_pwd(newuser, null)
 .page.device().go_next('.js-wz-select-connection')
 .page.device().logout()
 .waitForElementVisible(".js-wz-welcome", 5000, "Welcome page opened")
 .page.device().go_next('.js-wz-login')
 .page.login().valid_credential(newuser, pwd)
 .page.device().go_next('.js-wz-change-password')
 .page.device().validate_login(newuser)

 //CLEANUP: change credentials back to default after tests. Also need to change default to valid password
 .page.change_password().change_uname_pwd(user, pwd)
 .page.device().go_next('.js-wz-select-connection')
 .page.device().logout()
 .end();
 };
 */
// Add the suites with the appropriate testrail annotations
var sar = require('../../sareportable');
var tcInfo = {
    title: 'Change password page - Change username and password',
    description: 'Validates the contents of the change username/password page and tests its functionalities with changing username and password',
    reference: 'URMA-410, URMA-560, URMA-555, URMA-556, URMA-557, URMA-558',
    sectionName: sar.dftSectionName(__filename)
};

module.exports[sar.encode(tcInfo)] = function (client) {

    // Change username and password -> Next (works)
    var url = client.globals.get_Device.url;
    var user = client.globals.get_Device.username;
    var pwd = client.globals.get_Device.password;
    var newuser = 'newuser';
    var newpwd = 'newpwd!!';
    client
        .url(url)
        .waitForElementVisible(".js-wz-welcome", 5000, "Welcome page opened")

        .page.device().go_next('.js-wz-login')
        .page.login().valid_credential(user, pwd)
        .perform(function (client, done) {
            client.click(".next");
            client.waitForElementVisible(".js-wz-change-password", 5000);
            done();
        })
        .page.change_password().change_uname_pwd(newuser, newpwd)
        .perform(function (client, done) {
            client.click(".next");
            client.waitForElementVisible(".js-wz-select-connection", 5000);
            done();
        })
        .page.device().logout()

        .page.device().go_next('.js-wz-login')
        .page.login().valid_credential(newuser, newpwd)
        .perform(function (client, done) {
            client.click(".next");
            client.waitForElementVisible(".js-wz-change-password", 5000);
            done();
        })
        //CLEANUP: change credentials back to default after tests.
        .page.change_password().change_uname_pwd(user, pwd)
        .perform(function (client, done) {
            client.click(".next");
            client.waitForElementVisible(".js-wz-select-connection", 5000);
            done();
        })
        .page.device().logout()
        .end();
};
/*
 // Add the suites with the appropriate testrail annotations
 var sar = require('../../sareportable');
 var tcInfo = {
 title: 'Change password page - Negative tests',
 description: 'Validates the contents of the change username/password page and tests the requirements of new password',
 reference: 'URMA-410, URMA-560, URMA-555, URMA-556, URMA-557, URMA-558',
 sectionName: sar.dftSectionName(__filename)
 };

 module.exports[sar.encode(tcInfo)] = function(client){

 //invalid passwords of various kinds -> Next (error) -> clear pw field -> Next (works)

 var url = client.globals.get_Device.url;
 var user = client.globals.get_Device.username;
 var pwd = client.globals.get_Device.password;
 var newuser = 'newuser';
 var shortpwd = 'short';
 var plainpwd = 'plainpwd';
 var newpwd = 'newpwd!!';
 var newpwd2 = 'newpwd!!2';
 var passwordToShortError = 'Password must be at least 8 characters in length.';
 var passwordToPlainError = 'Password must contain at least one letter and one special character !@#$%^&*()_+.';
 var passwordsMustMatchError = 'Does not match password.';
 var formError = 'Form could not be submitted. Please correct highlighted errors.';

 client
 .url(url)
 .waitForElementVisible(".js-wz-welcome", 5000, "Welcome page opened")

 // short password
 .page.device().go_next('.js-wz-login')
 .page.login().valid_credential(user, pwd)
 .click(".next")
 .page.change_password().change_uname_pwd(null, shortpwd)
 .waitForElementVisible("div.input-password p.error", 5000)
 .assert.containsText("div.input-password p.error", passwordToShortError)

 // don't allow advance while error
 .click(".next")
 .waitForElementVisible("p.error.form-submitted-error", 5000)
 .assert.containsText("p.error.form-submitted-error", formError)

 // plain password
 .page.change_password().change_uname_pwd(null, plainpwd)
 .click(".next")
 .waitForElementVisible("div.input-password p.error", 5000)
 .assert.containsText("div.input-password p.error", passwordToPlainError)

 // non matching passwords
 .setValue(".form-control[name=password]", newpwd)
 .setValue(".form-control[name=confirmpassword]", newpwd2)
 .waitForElementVisible("div.input-confirmpassword p.error", 5000)
 .assert.containsText("div.input-confirmpassword p.error", passwordsMustMatchError)

 // clear fields and skip to next page
 .clearValue(".form-control[name=username]")
 .clearValue(".form-control[name=password]")
 .clearValue(".form-control[name=confirmpassword]")
 //.page.device().go_next('.js-wz-select-connection')
 .click(".next")
 .page.device().logout()
 .page.device().go_next('.js-wz-login')
 .page.login().valid_credential(user, pwd)
 .page.device().go_next(['.js-wz-change-password', '.logout'])
 .page.device().logout()

 //CLEANUP: none
 .end();
 };
 */
