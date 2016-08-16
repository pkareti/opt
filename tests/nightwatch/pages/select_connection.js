module.exports = function (client) {

    this.validate = function () {
        client
            .waitForElementVisible(".js-wz-select-connection", 5000)
            .perform(function (client, done) {
                client.page.query().state("system", 1).then(function (data) {
                    client.assert.containsText(".header-wrapper>header>h2>div", data.system.model);
                    done();
                });
            })
            .assert.elementPresent(".js-wz-select-connection")
            .assert.elementPresent(".wizard-images>img")
            .assert.containsText("form", "Select WAN connection type")
        return client;
    };

    this.select = function (type) {
        client
            .waitForElementVisible(".form-control[value=" + type + "]", 5000)
            .click(".form-control[value=" + type + "]")
            .click(".next")
            .waitForElementVisible(".wizard-content-area-right>div>h6", 5000)
            .assert.containsText(".wizard-content-area-right>div>h6", type)
        return client;
    };

};

