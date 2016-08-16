module.exports = function (client) {

    this.validate = function () {
        client
            .waitForElementVisible(".js-wz-about-the-dashboard", 5000)
            .assert.elementPresent(".about-the-dashboard-image")
            .assert.elementPresent(".next")
            .assert.containsText(".next", "DASHBOARD")
            .waitForElementVisible(".js-wz-about-the-dashboard", 5000)
            .assert.elementPresent(".wizard-links.margin-top")
            .assert.elementPresent(".about-the-dashboard-image")
            .click(".wizard-links.margin-top>a>img")
            .windowHandles(function (result) {
                client.assert.equal(result.value.length, 2, 'DIGI REMOTE MANAGER');
                var guideWindowHandle = result.value[1];
                client.switchWindow(guideWindowHandle)
                    .assert.urlContains('digidocs')
                    .assert.elementPresent(".logo>img")
                    .closeWindow(guideWindowHandle)
            })
            .windowHandles(function (result) {
                client.assert.equal(result.value.length, 1)
                client.switchWindow(result.value[0])
            })
        return client;
    };

    this.dashboard_next = function () {
        client
            .waitForElementVisible(".next", 5000)
            .click(".next")
            .waitForElementVisible(".js-dashboard", 5000)
        return client;
    };
};
