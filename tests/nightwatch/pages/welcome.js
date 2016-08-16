module.exports = function (client) {

    this.links = function () {
        client
        //testing the Quick start guide link
            .assert.containsText(".js-quick-start-guide", "Quick Start Guide")
            .click(".js-quick-start-guide")
            .windowHandles(function (result) {
                client.assert.equal(result.value.length, 2, 'Quick start guide');
                var guideWindowHandle = result.value[1];
                client.switchWindow(guideWindowHandle)
                    .assert.urlContains('http://www.digi.com')
                //.assert.elementPresent(".logo>img")
                // .closeWindow(guideWindowHandle)
            })
            .windowHandles(function (result) {
                client.assert.equal(result.value.length, 2)
                client.switchWindow(result.value[0])
            })

            //testing the User manual link
            .assert.containsText(".js-user-manual", "User Manual")
            .click(".js-user-manual")
            .windowHandles(function (result) {
                client.assert.equal(result.value.length, 3, 'User manual');
                var umWindowHandle = result.value[1];
                client.switchWindow(umWindowHandle)
                    .assert.urlContains('digidocs')
                    .closeWindow(umWindowHandle)
            })
            .windowHandles(function (result) {
                client.assert.equal(result.value.length, 2)
                client.switchWindow(result.value[0])
            })

        return client;
    };

    this.validate = function () {
        client
            .waitForElementVisible(".js-wz-welcome", 5000)
            .assert.containsText(".gsw-container>h1", "Getting Started Wizard")
            .assert.elementPresent(".wizard-content-area-left")
            .assert.elementPresent(".wizard-content-area-right>img")
            .assert.containsText(".js-quick-start-guide", "Quick Start Guide")
            .assert.containsText(".js-user-manual", "User Manual")
        return client;
    };
};
