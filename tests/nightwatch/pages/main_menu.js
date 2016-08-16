module.exports = function (client) {
    this.validate = function () {
        client
            .waitForElementVisible('.nav-menu', 5000)
            .elements('css selector', '.nav-menu-list li', function (result) {
                client.assert.equal(result.value.length, 6)
            });

        return client;
    };

    this.validateUrlChange = function () {
        client
            .waitForElementVisible('.nav-menu-list', 5000)
            .click('.nav-menu-list li:nth-of-type(2)>a')
            .waitForElementVisible('.nav-menu-list', 5000)
            .assert.cssClassPresent(".nav-menu-list li:nth-of-type(2)>a", "focused")
            .assert.urlContains('wan')
            .click('.nav-menu-list li:nth-of-type(3)>a')
            .waitForElementVisible('.nav-menu-list', 5000)
            .assert.cssClassPresent(".nav-menu-list li:nth-of-type(3)>a", "focused")
            .assert.urlContains('interfaces')
            .click('.nav-menu-list li:nth-of-type(4)>a')
            .waitForElementVisible('.nav-menu-list', 5000)
            .assert.cssClassPresent(".nav-menu-list li:nth-of-type(4)>a", "focused")
            .assert.urlContains('local-networks')
            .click('.nav-menu-list li:nth-of-type(5)>a')
            .waitForElementVisible('.nav-menu-list', 5000)
            .assert.cssClassPresent(".nav-menu-list li:nth-of-type(5)>a", "focused")
            .assert.urlContains('vpn')
            .click('.nav-menu-list li:nth-of-type(6)>a')
            .waitForElementVisible('.nav-menu-list', 5000)
            .assert.cssClassPresent(".nav-menu-list li:nth-of-type(6)>a", "focused")
            .assert.urlContains('system')
            .click('.nav-menu-list li:first-of-type>a')
            .waitForElementVisible('.nav-menu-list', 5000)
            .assert.cssClassPresent(".nav-menu-list li:first-of-type>a", "focused")
            .assert.urlContains('dashboard');

        return client;
    };

};
