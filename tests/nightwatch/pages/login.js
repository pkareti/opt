module.exports = function (client) {

    this.validate = function () {
        client
            .assert.elementPresent(".js-wz-login")
            .assert.elementPresent(".wizard-images")
            .assert.elementPresent(".wizard-content-text")

        return client;
    };

    this.valid_credential = function (username, password) {
        client
            .setuplogin(username, password)
        return client;
    };

    this.invalid_nocredential = function (errormsg) {
        client
            .waitForElementVisible(".main-container", 5000)
            .clearValue(".form-control[type=text]")
            .clearValue(".form-control[type=password]")
            .click(".next")
            .setuperror(errormsg)
        return client;
    };

    this.invalid_invalidcredential = function (username, password, errormsg) {
        client
            .setuplogin(username, password)
            .click(".next")
            .setuperror(errormsg)
        return client;
    };

    this.session = function (username, password, url) {
        var host = url;
        var host1 = url;
        client
            .waitForElementVisible(".main-container", 5000)
            //open a new tab and open the device setup wizard
            .execute(function (newWindow) {
                window.open(host1, null, "height=800,width=600");
            }, [host])

            //login to next page in first tab
            .assert.urlContains('getting-started')
            .waitForElementVisible(".header-wrapper>header>h2>img", 5000)
            .setuplogin(username, password)
            .waitForElementVisible(".main-container", 5000)
            //switch to second tab and check whether its automatically logged in and if logged in logout in second tab
            .window_handles(function (result) {
                var temp = result.value[1];
                console.log(temp)
                this.switchWindow(temp);
            })
            .resizeWindow(1024, 768)
            .assert.urlContains('getting-started')
            .waitForElementVisible(".logout", 10000)
            .click(".logout")
            .waitForElementVisible(".js-wz-welcome", 5000)
            .closeWindow()
            //switch to first tab after logged out in second tab and check whether its logged out in first tab
            .window_handles(function (result) {
                var temp = result.value[0];
                console.log(temp)
                this.switchWindow(temp);
            })
            .waitForElementVisible(".js-wz-welcome", 10000)
            .click(".next")
            .waitForElementVisible(".main-container", 5000)
            .assert.elementPresent(".form-control[type=text]")
            .assert.elementPresent(".form-control[type=password]")
        return client;
    };

};

