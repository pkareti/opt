module.exports = function (client) {

    this.change_uname_pwd = function (newusername, newpassword) {
        client

            .setupChangePassword(newusername, newpassword)

        return client;
    };


    this.validate = function () {
        client
            .waitForElementVisible(".js-wz-change-password", 5000)
            .perform(function (client, done) {
                client.page.query().state("system", 1).then(function (data) {
                    client.assert.containsText(".header-wrapper>header>h2>div", data.system.model);
                    done();
                });
            })
            .assert.elementPresent(".js-wz-change-password")
            .assert.elementPresent(".change-password-form")
        return client;
    };

};

