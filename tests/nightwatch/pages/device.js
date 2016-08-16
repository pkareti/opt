module.exports = function (client) {

    this.logout = function () {

        client

            .waitForElementVisible(".logout", 5000)
            .assert.containsText(".logout", "LOGOUT")
            .click(".logout")
            .waitForElementVisible(".gsw-container>h1", 5000)
            .assert.elementNotPresent(".logout")

        return client;
    };

    this.go_next = function (elements) {

        client
            .waitForElementVisible(".next", 5000)
            .click(".next")
        if (elements) {
            // check if single or multiple elements passed
            if (typeof elements === 'string') {
                client.waitForElementVisible(elements, 5000)
            } else {
                elements.forEach(function (element) {
                    client.waitForElementVisible(element, 5000)
                });
            }
            // if not element passed, check page header
        } else {
            client.waitForElementVisible(".header-wrapper>header", 5000)
        }

        return client;
    };

    this.go_back = function (elements) {

        client
            .waitForElementVisible(".back", 5000)
            .assert.containsText(".back", "BACK")
            .click(".back")
        if (elements) {
            // check if single or multiple elements passed
            if (typeof elements === 'string') {
                client.waitForElementVisible(elements, 5000)
            } else {
                elements.forEach(function (element) {
                    client.waitForElementVisible(element, 5000)
                });
            }
            // if not element passed, check page header
        } else {
            client.waitForElementVisible(".header-wrapper>header", 5000)
        }

        return client;
    };

    this.validate_login = function (username) {

        client

            .waitForElementVisible(".logout", 5000)
            .assert.containsText(".logout", "LOGOUT", "Checking whether Logged in or not")
            .perform(function (client, done) {
                client.page.query().settings("user", 1).then(function (data) {
                    var n = data.user.name;
                    if (n === username) {
                        console.log("Username verified");
                    } else {
                        console.log("Username not verified");
                    }
                    done();
                });
            })

        return client;
    };

    this.skip_to_dashboard = function () {

        client

            .waitForElementVisible(".js-skip-to-dashboard", 5000)
            .click(".js-skip-to-dashboard")
            .waitForElementVisible(".js-dashboard", 5000)

        return client;
    };
};
