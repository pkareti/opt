module.exports = function (client) {

    /** page level objects for css selectors in cellular page**/
    var usernameSelector = "input[id=username]";
    var passwordSelector = "input[id=password]";


    this.validate = function () {

        client
            .waitForElementVisible(".js-wz-DRM-connect", 5000)
            .waitForElementVisible("#provisionForm", 5000)
            .perform(function (client, done) {
                client.page.query().state("system", 1).then(function (data) {
                    client.assert.containsText(".header-wrapper>header>h2>div", data.system.model);
                    done();
                });
            })
            .assert.elementPresent(".js-wz-DRM-connect")
            .assert.elementPresent(".wizard-images>img")
            .assert.elementPresent(".wizard-content-text")
            .assert.containsText("#provisionForm>div", "Username")
            .assert.containsText("#provisionForm", "Username")
            .assert.containsText("#provisionForm", "Password")
            .assert.containsText(".js-skip-to-dashboard", "DASHBOARD")
            .assert.containsText(".wizard-content-text>a", "http://www.digi.com/products/cloud/digi-remote-manager")
        return client;
    };


    this.links = function () {
        //testing the remote manager link on page
        client
            .assert.containsText(".wizard-content-text>a", "http://www.digi.com/products/cloud/digi-remote-manager")
            .click(".wizard-content-text>a")

            .windowHandles(function (result) {
                client.assert.equal(result.value.length, 2, 'DIGI REMOTE MANAGER');
                var guideWindowHandle = result.value[1];
                client.switchWindow(guideWindowHandle)
                    .assert.urlContains('digi-remote-manager')
                    .assert.elementPresent(".logo>a>img")
                    .closeWindow(guideWindowHandle)
            })
            .windowHandles(function (result) {
                client.assert.equal(result.value.length, 1)
                client.switchWindow(result.value[0])
            })

        return client;
    };

    this.skipToDashboard = function () {
        client
            .waitForElementVisible("#skipToDashboard", 5000)
            .assert.containsText("#skipToDashboard", "Skip to Dashboard")
            .click("#skipToDashboard")

        return client;
    };

    this.enterCredentials = function (username, password) {

        client
            .waitForElementVisible(usernameSelector, 5000)
            .clearValue(usernameSelector)
            .clearValue(passwordSelector)
            .setValue(usernameSelector, username)
            .setValue(passwordSelector, password)

        return client;

    };

    this.next = function (type) {

        client
            .waitForElementVisible(".next", 5000)
            .click(".next")

        if (type == "invalid") {
            client
                .waitForElementVisible(".toast.toast-error", 5000)
                .waitForElementVisible(".toast-message", 5000)
                .assert.containsText(".toast-message", "unable to read the device list")
                .click(".toast-close-button")

        } else {
            client
                .waitForElementVisible(".toast.toast-success", 5000)
                .waitForElementVisible(".toast-message", 5000)
                .assert.containsText(".toast-message", "This device has been added to your Remote Manager account.")
                .click(".toast-close-button")
                .waitForElementVisible(".js-wz-about-the-dashboard", 5000)
        }

        return client;
    };

    this.verifyDeviceProvisioning = function (cloudserver, deviceId, username, password) {

        var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
        var cloudUrl = "https://" + cloudserver + "/ws/v1/devices/inventory";
        var options = {
            data: {},
            headers: {
                "Authorization": auth,
                "content-type": "application/json",
                "Accept": "application/json"
            }
        };

        client.get(cloudUrl + "/" + deviceId, options, function (response) {
            client.assert.equal(response.statusCode, 200, "200 OK")
        });

        return client;
    };

    this.removeDevice = function (cloudserver, deviceId, username, password) {

        var http = require('http');
        var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
        var options = {
            host: cloudserver,
            path: '/ws/v1/devices/inventory/' + deviceId,
            method: 'DELETE',
            headers: {
                "Authorization": auth,
                "content-type": "application/json",
                "Accept": "application/json"
            }
        };
        var req = http.request(options, function (response) {
            client.assert.equal(response.statusCode, 204, "204")
            console.log("Device removed from Device Cloud");
        });
        req.end();
        return client;
    };

};
