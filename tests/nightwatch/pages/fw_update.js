module.exports = function (client) {
    var current_fw;
    var avail_fw;

    this.validate = function () {
        client
            .waitForElementVisible(".js-wz-firmware-update", 5000)
            .perform(function (client, done) {
                client.page.query().state("system", 1).then(function (data) {
                    client.assert.containsText(".header-wrapper>header>h2>div", data.system.model);
                    var str = data.system.firmware_version;
                    var res = str.split(" ");
                    client.assert.containsText(".box.firmware-update-current-version", res[0]);
                    done();
                });
            })
            .assert.elementPresent(".js-wz-firmware-update")
            .assert.containsText(".box.firmware-update-current-version", "Current Version")

            .click(".firmware-update-option-manual")
            .assert.containsText(".firmware-update-manual.margin-top", "firmware file from your computer")
            .assert.elementPresent("#fwFileUploadForm>input")
            .assert.attributeContains(".next", "disabled", "")

            .click(".firmware-update-option-auto")
            .expect.element(".next").to.not.have.attribute("disabled")

        return client;
    };

    this.manual = function () {

        client

            .waitForElementVisible(".js-wz-firmware-update", 5000)
            .click(".firmware-update-option-manual")
            .waitForElementVisible("#fwFileUploadForm>input", 5000)
            .setValue('#fwFileUploadForm>input', require('path').resolve(__dirname + '/', client.globals.get_Device.path))
            .click(".next")
            .waitForElementVisible(".progress-bar-wrapper", 5000)
            //.WaitForText(".dialog--jss-0-0>div>div>div:nth-child(1)", function(text) {return text === "Applying new firmware, please wait.";})
            .waitForElementVisible(".dialog--jss-0-0", 10000)
            .waitForElementVisible(".reboot-msg>div>h5", 50000)
            .assert.elementPresent(".countdown-timer")
            .waitForElementVisible(".js-wz-welcome", 150000)

        return client;
    };

    this.auto = function () {

        client

            .waitForElementVisible(".js-wz-firmware-update", 5000)
            .assert.containsText(".box.firmware-update-current-version", "Current Version")
            .getText(".box.firmware-update-current-version>span", function (result) {
                current_fw = result.value;
                this
                    .getText(".firmware-update-option-auto", function (result) {
                        avail_fw = result.value;
                        console.log('Current Firmware version is ', current_fw, ' and ', 'Latest firmware version is ', avail_fw);
                        this
                        if (current_fw === avail_fw) {
                            client.assert.attributeEquals(".next", "disabled", "")
                            console.log('Firmware is alerady the latest');
                        }
                        else {
                            client.click(".firmware-update-option-auto")
                            console.log('We have a new firmware version available');
                        }
                        client
                            .click(".next")
                            .waitForElementVisible(".progress-bar-wrapper", 5000)
                            .WaitForText(".dialog--jss-0-0>div>div>div:nth-child(1)", function (text) {
                                return text === "Applying new firmware, please wait.";
                            })
                            .waitForElementVisible(".dialog--jss-0-0", 10000)
                            .waitForElementVisible(".reboot-msg>div>h5", 50000)
                            .assert.elementPresent(".countdown-timer")
                            .waitForElementVisible(".js-wz-welcome", 150000)

                        return this;

                    })

            })

        return client;
    };

    this.skipToRM = function () {

        client.click("#skipToRM")

        return client;
    };

    this.validate_version = function () {

        client
            .waitForElementVisible(".box.firmware-update-current-version>span", 5000)
            .perform(function (client, done) {
                client.page.query().state("system", 1).then(function (data) {
                    var str = data.system.firmware_version;
                    var res = str.split(" ");
                    client.assert.containsText(".box.firmware-update-current-version>span", res[0]);
                    done();
                });
            })

        return client;
    };

};

