module.exports = function (client) {
    this.openAccordion = function (wrapperClass) {
        client
            .waitForElementVisible(wrapperClass + ' .expander-trigger', 5000)
            .click(wrapperClass + ' .expander-trigger')
            .waitForElementVisible(wrapperClass + ' .accordion-content', 5000)
        return client;
    };

    this.closeAccordion = function (wrapperClass) {
        client
            .waitForElementVisible(wrapperClass + ' .accordion-content', 5000)
            .waitForElementVisible(wrapperClass + ' .expander-trigger', 5000)
            .click(wrapperClass + ' .expander-trigger')
            .assert.elementNotPresent(wrapperClass + ' .accordion-content')
        return client;
    };

    this.validate_wifi = function () {
        /*** This is just to validate, No actions done here ***/
        client
            .waitForElementVisible(".js-interface-wifi .accordion-content", 5000)
            .assert.elementPresent(".js-interface-wifi-interface")

        return client;
    };

    this.validate_cellular = function (index) {
        /*** This is just to validate, No actions done here ***/
        client
            .waitForElementVisible(".js-interface-cellular .accordion-content", 5000)
            .assert.elementPresent(".js-interface-cellular-settings")
            .assert.elementPresent(".js-interface-cellular-settings .js-wan")
            //.perform(function (client, done) {
                client.page.query().settings("cellular").then(function(data){
                    for (var i=0; i < data.cellular.length; i++) {
                        client.assert.containsText(".js-apn .js-value", data.cellular[i].apn);
                        client.assert.containsText(".js-apn-username .js-value", data.cellular[i].apn_username);
                        //client.assert.containsText(".js-apn-password .js-value", data.cellular[i].xxx);
                        //client.assert.containsText(".js-sim-pin .js-value", data.cellular[i].xxx);
                        client.assert.containsText(".js-preferred-mode .js-value", data.cellular[i].preferred_mode);
                        client.assert.containsText(".js-connection-attempts .js-value", data.cellular[i].connection_attempts);
                        client.assert.containsText(".js-state .js-value", data.cellular[i].state);
                    }
                    done();

                })
            //})
        client
            .assert.elementPresent(".js-interface-cellular .js-input-description")
            .assert.elementPresent(".js-interface-cellular .js-input-state")
            .assert.elementPresent(".js-interface-cellular .js-input-apn")
            .assert.elementPresent(".js-interface-cellular .js-input-apnPassword")
            .assert.elementPresent(".js-interface-cellular .js-input-simPin")
            .assert.elementPresent(".js-interface-cellular .js-input-preferredMode")
            .assert.elementPresent(".js-interface-cellular .js-input-connectionAttempts")

        return client;
    };

    this.validateFields_wifi = function() {
        client
            .waitForElementVisible(".js-interface-wifi .accordion-content",5000)

        return client;
    };

    this.validateFields_cellular = function(index) {
        client
            .waitForElementVisible(".js-interface-cellular .accordion-content", 5000)

            //Testing of  cellular fields - invalid values
            .setInput(".js-interface-cellular .js-input-description textarea", "1234567890123456789012345678901234567890123456789012345678901234")
            .setInput(".js-interface-cellular .js-input-apn input", "1234567890123456789012345678901234567890123456789012345678901234")
            .setInput(".js-interface-cellular .js-input-apnPassword input", "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789001234567890")
            .setInput(".js-interface-cellular .js-input-simPin input", "12345")
            .setInput(".js-interface-cellular .js-input-connectionAttempts input", "9")
      
            .click(".js-interface-cellular .js-apply")
            .waitForElementVisible(".js-interface-cellular .error.form-submitted-error", 5000)
            .assert.containsText(".js-interface-cellular .error.form-submitted-error", "Please correct highlighted errors.")
            .assert.containsText(".js-interface-cellular .js-input-description .error", 'The cellular interface description cannot be more than 63 characters')
            .assert.containsText(".js-interface-cellular .js-input-apn .error", 'The Access Point Name (APN) for the cellular interface cannot be more than 63 characters')
            .assert.containsText(".js-interface-cellular .js-input-apnPassword .error", 'The APN password cannot be more than 128 characters')
            .assert.containsText(".js-interface-cellular .js-input-simPin .error", 'Sim Pin cannot be more than 4 characters')
            .assert.containsText(".js-interface-cellular .js-input-connectionAttempts .error", 'The number of attempts to establish a cellular connection must be between 10 and 500')

            //Clear all changes by selecting cancel button
            .click(".js-interface-cellular .js-cancel")

            //Testing of  cellular fields - invalid values
            .setInput(".js-interface-cellular .js-input-description textarea", "1234567890123456789012345678901234567890123456789012345678901234")
            .setInput(".js-interface-cellular .js-input-apn input", "1234567890123456789012345678901234567890123456789012345678901234")
            .setInput(".js-interface-cellular .js-input-apnPassword input", "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789001234567890")
            .setInput(".js-interface-cellular .js-input-simPin input", "12345")
            .setInput(".js-interface-cellular .js-input-connectionAttempts input", "503")

            .click(".js-interface-cellular .js-apply")
            .waitForElementVisible(".js-interface-cellular .error.form-submitted-error", 5000)
            .assert.containsText(".js-interface-cellular .error.form-submitted-error", "Please correct highlighted errors.")
            .assert.containsText(".js-interface-cellular .js-input-description .error", 'The cellular interface description cannot be more than 63 characters')
            .assert.containsText(".js-interface-cellular .js-input-apn .error", 'The Access Point Name (APN) for the cellular interface cannot be more than 63 characters')
            .assert.containsText(".js-interface-cellular .js-input-apnPassword .error", 'The APN password cannot be more than 128 characters')
            .assert.containsText(".js-interface-cellular .js-input-simPin .error", 'Sim Pin cannot be more than 4 characters')
            .assert.containsText(".js-interface-cellular .js-input-connectionAttempts .error", 'The number of attempts to establish a cellular connection must be between 10 and 500')

            //Clear all changes by selecting cancel button
            .click(".js-interface-cellular .js-cancel")

        return client;
    };
}
