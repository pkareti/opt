module.exports = function (client) {

    /** page level objects for css selectors in cellular page**/
    var countrySelector = "select[id=cellularCountry]";
    var providerSelector = "select[id=cellularProvider]";
    var apnSelector = "select[id=cellularAPN]";
    var customApnSelector = "#cellularCustomAPN";
    var cancelBtn = "#cancelBtn";
    var retryBtn = "#retryBtn";
    var timer = ".countdown-timer";

    this.validate = function () {

        client
            .waitForElementVisible(".js-wz-cellular", 5000)
            .perform(function (client, done) {
                client.page.query().state("system", 1).then(function (data) {
                    client.assert.containsText(".header-wrapper>header>h2>div", data.system.model);
                    done();
                });
            })
            .assert.elementPresent(".wizard-images>img")
            .assert.elementPresent(".wizard-content-text")
            .assert.containsText(".simStatus>p:nth-child(1)", "Status")
            .assert.containsText(".simStatus>p:nth-child(2)", "ICCID")
            .assert.containsText(".simStatus>p:nth-child(3)", "Strength")
            .assert.containsText(".simStatus>p:nth-child(4)", "Quality")
            .assert.elementPresent("#cellularCountry")
            .assert.elementPresent("#cellularProvider")
            .assert.elementPresent("#cellularAPN")
            .assert.elementPresent("#AdvancedLink")
            .click("#AdvancedLink")
            .waitForElementVisible("#cellularUsername", 5000)
            .assert.elementPresent("#cellularCountry")
            .assert.elementPresent("#cellularProvider")
            .assert.elementPresent("#cellularAPN")
            .assert.elementPresent("#cellularUsername")
            .assert.elementPresent("#cellularPassword")
            .assert.elementPresent("#cellularSIMPin")

        return client;
    };

    this.next = function (testType) {

        client
            .waitForElementVisible(".wizard-images>img", 5000)
            .click(".next")
            .waitForElementPresent(".cellular-msg>div>h5", 5000)
            .assert.containsText(".cellular-msg>div>h5", "PLEASE WAIT WHILE YOUR DEVICE CONNECTS.")
            .assert.elementPresent(timer)
            .assert.elementPresent(cancelBtn)
            .assert.elementNotPresent(retryBtn)

        if (testType != "negative") {
            client
                .waitForElementPresent(".cellularResults", 130000)
                .assert.containsText(".wizard-content-area-right>div>h6", "Cellular Connection Results")
        }
        else if (testType === "negative") {
            client
                .waitForElementPresent(".cellular-msg>h5", 130000)
                .assert.containsText(".cellular-msg>p[class=error]", "Timed out")
                .assert.elementPresent(cancelBtn)
                .assert.elementPresent(retryBtn)
                .click(retryBtn)
                .waitForElementPresent(".cellular-msg>h5", 130000)
                .assert.elementPresent(cancelBtn)
                .assert.elementPresent(retryBtn)

        }
        return client;
    };

    this.retry = function () {

        client
            .waitForElementPresent(retryBtn, 5000)
            .assert.containsText(".error", "Timed out")
            .click(retryBtn)
            .assert.elementPresent(timer)
            .assert.elementPresent(cancelBtn)
            .assert.elementNotPresent(retryBtn)

        return client;
    };

    this.cancel = function () {

        client
            .waitForElementVisible(cancelBtn, 5000)
            .click(cancelBtn)
            .waitForElementVisible(".wizard-images>img", 5000)
            .assert.containsText(".wizard-content-area-right>div>h6", "Specify Cellular Parameters")

        return client;
    };

    this.verifyTimer = function () {

        client
            .waitForElementPresent(".cellular-msg>div>h5", 5000)
            .assert.elementPresent(timer)
            .assert.elementPresent(cancelBtn)
            .assert.elementNotPresent(retryBtn)
            .waitForElementVisible(timer, 120000)
            .waitForElementPresent(retryBtn, 120000)
            .assert.elementPresent(cancelBtn)

        return client;
    };

    this.selectCountry = function (country) {

        client.click(countrySelector + ' option[value="' + country + '"]')
        return client;
    };

    this.verifyCountry = function (country, provider, apn, customAPN) {

        client
            .waitForElementPresent(apnSelector + " option[value='" + apn + "']", 5000)
            .assert.attributeEquals(providerSelector, "value", provider)
            .assert.attributeEquals(apnSelector, "value", apn)
        if (customAPN) {
            client
                .waitForElementPresent(customApnSelector, 5000)
                .assert.elementPresent(customApnSelector)
        } else {
            client.assert.elementNotPresent(customApnSelector)
        }

        return client;
    };

    this.selectProvider = function (provider) {

        client
            .waitForElementPresent(providerSelector + " option[value='" + provider + "']", 5000)
            .click(providerSelector + " option[value='" + provider + "']")
        return client;
    };

    this.verifyProvider = function (provider, apn, customAPN) {

        client
            .waitForElementPresent(apnSelector + " option[value='" + apn + "']", 5000)
            .assert.attributeEquals(apnSelector, "value", apn)
        if (customAPN) {
            client
                .waitForElementPresent(customApnSelector, 5000)
                .assert.elementPresent(customApnSelector)
        } else {
            client.assert.elementNotPresent(customApnSelector)
        }

        return client;
    };

    this.selectAPN = function (apn) {

        client
            .waitForElementPresent(apnSelector + ">option[value='" + apn + "']", 5000)
            .click(apnSelector + ">option[value='" + apn + "']")

        return client;
    };

    this.selectCustomAPN = function (apn) {

        client
            .waitForElementPresent(customApnSelector, 5000)
            .setValue(customApnSelector, apn)

        return client;
    };

    this.verifyAPN = function (apn, customAPN) {

        client.setValue(apnSelector, apn)

        if (customAPN) {
            client
                .waitForElementPresent(customApnSelector, 5000)
                .assert.elementPresent(customApnSelector)
        } else {
            client.assert.elementNotPresent(customApnSelector)
        }

        return client;
    };

    /*** Validate country drop down has other ,
     *   provider drop down has other and
     *   apn has custom (always expect when provider is verizon).
     *   verify that for all the countries in the drop down verify that correct provider and apn populate .
     *   verify that for all providers in a country proper apn values are populated
     *   ***/

    this.verifyCellularSelects = function (cellularCountries) {

        var providerApn, customApn, apnArr, apn;
        var selectCountry = this.selectCountry.bind(this)
        var selectProvider = this.selectProvider.bind(this)
        var validateCountry = this.verifyCountry.bind(this)
        var validateProvider = this.verifyProvider.bind(this)
        client.waitForElementVisible(".wizard-images>img", 5000)
        /***loop through each country in the country drop down and
         * verify the default provider and apn matches country selected***/
        Object.keys(cellularCountries).map(function (cellularCountry) {
            apnArr = cellularCountries[cellularCountry][0]['APN'];

            if (apnArr.length < 1) {
                apn = cellularCountries[cellularCountry][0]['APN'];
            } else {
                apn = cellularCountries[cellularCountry][0]['APN'][0];
            }
            selectCountry(cellularCountry)

            validateCountry(cellularCountry, cellularCountries[cellularCountry][0]['provider'], apn, false)
            /***loop through each provider in the provider drop down and
             * verify the default apn matches provider selected***/
            for (var i = 0; i < cellularCountries[cellularCountry].length; i++) {
                if (cellularCountries[cellularCountry][i]['provider'] == "Verizon") {
                    providerApn = "";
                    customApn = false;
                } else if (cellularCountries[cellularCountry][i]['APN'].length < 1) {
                    providerApn = "custom";
                    customApn = true;
                } else {
                    providerApn = cellularCountries[cellularCountry][i]['APN'][0];
                    customApn = false;
                }
                selectProvider(cellularCountries[cellularCountry][i]['provider'])
                validateProvider(cellularCountries[cellularCountry][i]['provider'], providerApn, customApn)
                /*** Verify that Provider drop down has other ***/
                client.expect.element(providerSelector + ' option[value=other]').to.be.present;
                /*** Verify that apn drop down has custom ***/
                client.expect.element(apnSelector + ' option[value=custom]').to.be.present;
            }
        })

        /*** Verify that country drop down has other ***/
        client.expect.element('select[id=cellularCountry] option[value=other]').to.be.present;

        return client;
    };

};

