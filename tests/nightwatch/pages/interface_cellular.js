
module.exports = function (client, wrapperClass) {
    
    this.openAccordion = function () {
        client
            .click(wrapperClass+' .expander-trigger')
            .waitForElementVisible('.accordion-content', 5000)

        return client;
    };
    this.validateWan = function (interfaceName) {
        const url = client.globals.get_Device.url;

        // Validate modal appears when changes made and clicking on wan link.
        // Check route works, reopen wan cellular config
        client
            .waitForElementVisible(wrapperClass+' .js-interface-cellular-settings', 5000)
            .setInput(wrapperClass+' .js-input-description textarea', 'test description')
            .click(wrapperClass+' .js-cellular-'+interfaceName+' .js-wan-link')
            .waitForElementVisible('.js-confirm-dialog', 5000)
            .click('.js-confirm-dialog .js-ok-btn')
            .waitForElementVisible('.js-wan', 5000)
            .url(url+'/interfaces').waitForElementVisible(wrapperClass, 5000);

        this.openAccordion();

        return client;
    };

    this.validateSettings = function () {
        client
            .waitForElementVisible(wrapperClass+' ..js-interface-cellular-settings .js-cellular-1', 5000)
            .expect.element(wrapperClass+' .js-interface-cellular-settings .js-cellular-1 .js-value').to.have.value.not.equals('')

            .waitForElementVisible(wrapperClass+' ..js-interface-cellular-settings .js-cellular-1', 5000)
            .expect.element(wrapperClass+' .js-interface-cellular-settings .js-cellular-1 .js-value').to.have.value.not.equals('')

        return client;
    };

    this.validateSettings = function (cellularIndex) {
        
        var settingsClass = wrapperClass + ' .js-interface-cellular-settings .js-cellular-' + cellularIndex;

        client
            .waitForElementVisible(wrapperClass + ' .js-interface-cellular-settings', 5000)
            .assert.elementPresent(settingsClass + ' .js-radio-' +cellularIndex)
            .assert.containsText(settingsClass + ' .js-apn .js-label', 'APN:')
            .assert.containsText(settingsClass + ' .js-apn-username .js-label', 'Username')
            .assert.containsText(settingsClass + ' .js-apn-password .js-label', 'Password')
            .assert.containsText(settingsClass + ' .js-sim-pin .js-label', 'SIM PIN')
            .assert.containsText(settingsClass + ' .js-preferred-mode .js-label', 'Preferred Mode')
            .assert.containsText(settingsClass + ' .js-connection-attempts .js-label', 'Connection Attempts')
            .assert.containsText(settingsClass + ' .js-state .js-label', 'State')

            //.perform(function (client, done) {
                client.page.query().settings('cellular',cellularIndex).then(function (data) {
                    console.log(data);
                    client.assert.containsText(wrapperClass + ' .js-interface-cellular-settings .js-interface .js-value', 'cellular' + (data.cellular._groupIndex + 1))
                        .assert.containsText(settingsClass + ' .js-apn .js-value', data.cellular.apn)
                        .assert.containsText(settingsClass + ' .js-apn-username .js-value', data.cellular.apn_username)
                        .assert.containsText(settingsClass + ' .js-apn-password .js-value', data.cellular.apn_password)
                        .assert.containsText(settingsClass + ' .js-sim-pin .js-value', data.cellular.sim_pin)
                        .assert.containsText(settingsClass + ' .js-preferred-mode .js-value', data.cellular.preferred_mode)
                        .assert.containsText(settingsClass + ' .js-connection-attempts .js-value', data.cellular.connection_attempts)
                        .assert.containsText(settingsClass + ' .js-state .js-value', data.cellular.state)
                    done();
                });
            //})

        return client;

    };

    this.validateCancel = function () {
        client
            .waitForElementVisible(wrapperClass + ' .js-cancel', 5000)
            .waitForElementVisible(wrapperClass + ' .js-cellular-edit', 5000)
            .getValue(wrapperClass + ' .js-cellular-edit .js-input-apn input', function (result) {
                client.setValue(wrapperClass + ' .js-cellular-edit .js-input-apn input', 'test_apn')
                    .click(wrapperClass + ' .js-cancel')
                    .assert.attributeEquals(wrapperClass + ' .js-cellular-edit .js-input-apn input', 'value', result.value)
            });

        return client;
    };

    this.validateConfig = function (cellularIndex) {

        var apn = '1265_mcs';
        var apn_password = 'mypassword';
        var sim_pin = '1234';
        var preferred_mode = '3g';
        var connection_attempts = '12';
        var state = 'on-demand';
        var description = 'my cellular description';

        client
            .waitForElementVisible('.js-apply', 5000)
            .waitForElementVisible(wrapperClass + ' .js-cellular-edit', 5000)
            .click(wrapperClass + ' .js-cancel')
            .pause(1000)
            .click(wrapperClass + ' .js-cellular-' + cellularIndex + ' .js-radio-' +cellularIndex)
            .setInput(wrapperClass + ' .js-input-description textarea', description)
            .setInput(wrapperClass + ' .js-input-apn input', apn)
            .setInput(wrapperClass + ' .js-input-apnPassword input', apn_password)
            .setInput(wrapperClass + ' .js-input-simPin input', '1234')
            .setInput(wrapperClass + ' .js-input-connectionAttempts input', connection_attempts)
            .setInput(wrapperClass + ' .js-input-preferredMode select', preferred_mode)
            .click(wrapperClass + ' .js-input-state input[value=' + state + ']')
            .pause(1000)
            .click(wrapperClass + ' .js-apply')
            .waitForElementPresent(wrapperClass + ' .accordion-wrapper .accordion-content .js-submit-message', 5000, 'Changes applied.')


            //.perform(function (client, done) {
                client.page.query().settings('cellular',cellularIndex).then(function (data) {
                    client.assert.containsText(wrapperClass + ' .js-interface-cellular-settings .js-interface .js-value', 'cellular' + (data.cellular._groupIndex + 1))
                    client.assert.equal(data.cellular.description, description, 'Description changed');
                    client.assert.equal(data.cellular.apn, apn, 'APN changed');
                    client.assert.equal(data.cellular.apn_password, apn_password, 'APN Password changed');
                    client.assert.equal(data.cellular.sim_pin, sim_pin, 'Sim Pin changed');
                    client.assert.equal(data.cellular.preferred_mode, preferred_mode, 'Preferred Mode changed');
                    client.assert.equal(data.cellular.connection_attempts, connection_attempts, 'Connection Attempts changed');
                    client.assert.equal(data.cellular.state, state, 'State changed');
                    done();
                });
            //})

        return client;
    };
}