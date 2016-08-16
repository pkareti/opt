module.exports = function (client) {

    this.validateCellularSettings = function (cellularIndex) {
        var wrapperClass = '.js-wan-cellular' + cellularIndex;
        client
            .waitForElementVisible(wrapperClass + ' .js-wan-cellular-settings', 5000)
            .assert.containsText(wrapperClass + ' .js-wan-cellular-settings .js-interface .js-label', 'Interface')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-settings .js-apn .js-label', 'APN:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-settings .js-username .js-label', 'Username:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-settings .js-password .js-label', 'Password:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-settings .js-sim-pin .js-label', 'SIM PIN:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-settings .js-preferred-mode .js-label', 'Preferred Mode:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-settings .js-connection-attempts .js-label', 'Connection Attempts:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-settings .js-state .js-label', 'State:')
            .perform(function (client, done) {
                 client.page.query().settings("cellular",cellularIndex).then(function (data) {
                     console.log(data);
                    client.assert.containsText(wrapperClass + ' .js-wan-cellular-settings .js-interface .js-value', 'cellular' + (data.cellular._groupIndex + 1))
                         .assert.containsText(wrapperClass + ' .js-wan-cellular-settings .js-apn .js-value', data.cellular.apn)
                         .assert.containsText(wrapperClass + ' .js-wan-cellular-settings .js-username .js-value', data.cellular.apn_username)
                         .assert.containsText(wrapperClass + ' .js-wan-cellular-settings .js-password .js-value', data.cellular.apn_password)
                         .assert.containsText(wrapperClass + ' .js-wan-cellular-settings .js-sim-pin .js-value', data.cellular.sim_pin)
                         .assert.containsText(wrapperClass + ' .js-wan-cellular-settings .js-preferred-mode .js-value', data.cellular.preferred_mode)
                         .assert.containsText(wrapperClass + ' .js-wan-cellular-settings .js-connection-attempts .js-value', data.cellular.connection_attempts)
                         .assert.containsText(wrapperClass + ' .js-wan-cellular-settings .js-state .js-value', data.cellular.state)
                    done();
                 });
            })
        return client;

    };

    this.validateCellularState = function (cellularIndex) {
        var wrapperClass = '.js-wan-cellular' + cellularIndex;
        client
            .waitForElementVisible(wrapperClass + ' .js-wan-cellular-state', 5000)
            .assert.containsText(wrapperClass + ' .js-wan-cellular-state>h5', 'Cellular Status and Statistics')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-module .js-label', 'Module:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-firmware-version .js-label', 'Firmware Version:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-hardware-version .js-label', 'Hardware Version:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-imei .js-label', 'IMEI:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-sim-status .js-label', 'SIM Status:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-signal-strength .js-label', 'Signal Strength:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-signal-quality .js-label', 'Signal Quality:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-registration-status .js-label', 'Registration Status:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-network-provider .js-label', 'Network Provider:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-temperature .js-label', 'Temperature:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-connection-type .js-label', 'Connection Type:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-radio-band .js-label', 'Radio Band:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-channel .js-label', 'Channel:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-apn-in-use .js-label', 'APN in use:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-ip-address .js-label', 'IP Address:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-mask .js-label', 'Mask:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-gateway .js-label', 'Gateway:')
            .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-dns-servers .js-label', 'DNS Servers:')

        //.perform(function (client, done) {
        client.page.query().state("cellular").then(function (data) {
            console.log(data);
            client.assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-module .js-value', 'Module:')
                .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-firmware-version .js-value', data.cellular.firmware_version)
                .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-hardware-version .js-value', data.cellular.hardware_version)
                .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-imei .js-value', data.cellular.imei)
                .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-sim-status .js-value', data.cellular.sim_status)
                .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-signal-strength .js-value', data.cellular.signal_strength)
                .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-signal-quality .js-value', data.cellular.signal_quality)
                .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-registration-status .js-value', data.cellular.registration_status)
                .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-network-provider .js-value', data.cellular.network_provider)
                .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-temperature .js-value', data.cellular.temperature)
                .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-connection-type .js-value', data.cellular.connection_type)
                .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-radio-band .js-value', data.cellular.radio_band)
                .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-channel .js-value', data.cellular.channel)
                .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-apn-in-use .js-value', data.cellular.pdp_context)
                .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-ip-address .js-value', data.cellular.ip_address)
                .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-mask .js-value', data.cellular.mask)
                .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-gateway .js-value', data.cellular.gateway)
                .assert.containsText(wrapperClass + ' .js-wan-cellular-state .js-dns-servers .js-value', data.cellular.dns_servers)
            done();
        });
        //})

        return client;
    };

    this.validateProbe = function (index) {
        if (index===1){
            var wan_index=3;
        }else if(index===2){
            var wan_index=4;
        }
        client
            .waitForElementVisible('.js-wan-cellular'+index+' .js-wan-probing', 5000)
            .assert.containsText('.js-wan-cellular'+index+' .js-wan-probing>h5', 'Probing')
            .assert.containsText('.js-wan-cellular'+index+' .js-probe-host .js-label', 'Probe Host:')
            .assert.containsText('.js-wan-cellular'+index+' .js-probe-interval .js-label', 'Probe Interval:')
            .assert.containsText('.js-wan-cellular'+index+' .js-probe-size .js-label', 'Probe Size:')
            .assert.containsText('.js-wan-cellular'+index+' .js-probe-timeout .js-label', 'Probe Timeout:')
            .assert.containsText('.js-wan-cellular'+index+' .js-activate-after .js-label', 'Activate After:')
            .assert.containsText('.js-wan-cellular'+index+' ..js-retry-after .js-label', 'Retry After:')
            .assert.containsText('.js-wan-cellular'+index+' .js-timeout .js-label', 'Time Out:')

            .perform(function (client, done) {
                client.page.query().settings("wan",wan_index).then(function (data) {
                    client.assert.containsText('.js-wan-cellular'+index+' .js-probe-host .js-value', data.system.model);
                    client.assert.containsText('.js-wan-cellular'+index+' .js-probe-interval .js-value', data.system.model);
                    client.assert.containsText('.js-wan-cellular'+index+' .js-probe-size .js-value', data.system.model);
                    client.assert.containsText('.js-wan-cellular'+index+' .js-probe-timeout .js-value', data.system.model);
                    client.assert.containsText('.js-wan-cellular'+index+' .js-activate-after .js-value', data.system.model);
                    client.assert.containsText('.js-wan-cellular'+index+' .js-retry-after .js-value', data.system.model);
                    client.assert.containsText('.js-wan-cellular'+index+' .js-timeout .js-value', data.system.model);
                    done();
                });
            })

        return client;
    }

    this.validateCancel = function (cellularIndex) {
        var wrapperClass = '.js-wan-cellular' + cellularIndex;
        client
            .waitForElementVisible(wrapperClass + ' .js-btn-cancel', 5000)
            .waitForElementVisible(wrapperClass + ' .js-wan-probing', 5000)
            .getValue(wrapperClass + " .js-input-probeHost input", function (result) {
                client.setValue(wrapperClass + ' .js-input-probeHost input', 'google.com')
                    .click(wrapperClass + ' .js-btn-cancel')
                    .assert.attributeEquals(wrapperClass + ' .js-input-probeHost input', 'value', result.value)
            });

        return client;
    };

    this.validateApply = function (cellularIndex, wanIndex) {
        var wrapperClass = '.js-wan-cellular' + cellularIndex;

        client
            .waitForElementVisible('.js-btn-apply', 5000)
            .waitForElementVisible(wrapperClass + ' .js-wan-probing', 5000)
            .clearValue(wrapperClass + ' .js-input-probeSize input')
            .setValue(wrapperClass + ' .js-input-probeSize input', 10)
            .clearValue(wrapperClass + ' .js-input-probeInterval input')
            .setValue(wrapperClass + ' .js-input-probeInterval input', 'ad')
            .clearValue(wrapperClass + ' .js-input-probeHost input')
            .click(wrapperClass + ' .js-input-activateAfter select option[value="3600"]')
            .waitForElementVisible(wrapperClass + ' .js-input-probeSize .error', 5000)
            .assert.containsText(wrapperClass + ' .js-input-probeSize .error', 'Probe Size must have minimum of 64 and maximum of 1500')
            .waitForElementVisible(wrapperClass + ' .js-input-probeInterval .error', 5000)
            .assert.containsText(wrapperClass + ' .js-input-probeInterval .error', 'Probe Interval must have a minimum value of 1 seconds and maximum of 3600 seconds')
            .click(wrapperClass + ' .js-btn-apply')
            .waitForElementVisible(wrapperClass + ' .js-submit-message', 5000)
            .assert.containsText(wrapperClass + ' .js-submit-message', 'Please correct highlighted errors.')

            .clearValue(wrapperClass + ' .js-input-probeHost input[type=text]')
            .setValue(wrapperClass + ' .js-input-probeHost input', 'digi.com')
            .clearValue(wrapperClass + ' .js-input-probeSize input[type=text]')
            .setValue(wrapperClass + ' .js-input-probeSize input', 65)
            .clearValue(wrapperClass + ' .js-input-probeInterval input[type=text]')
            .setValue(wrapperClass + ' .js-input-probeInterval input', 10)

            .click(wrapperClass + ' .js-input-activateAfter select option[value="60"]')
            .click(wrapperClass + ' .js-btn-apply')

            .assert.containsText(wrapperClass + ' .js-input-probeSize .error', '')
            .assert.containsText(wrapperClass + ' .js-input-activateAfter .error', '')
            .assert.containsText(wrapperClass + ' .js-input-probeInterval .error', '')
            .assert.containsText(wrapperClass + ' .js-input-retryAfter .error', '')
            .assert.containsText(wrapperClass + ' .js-submit-message', 'Changes applied.')

        return client;
    };

}
