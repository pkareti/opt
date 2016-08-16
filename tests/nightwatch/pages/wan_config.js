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
    
    this.validateDelete = function (wrapperClass, wanIndex, wanInterface) {
        client
            .waitForElementVisible(wrapperClass + '.js-btn-delete', 5000)
            .click(wrapperClass + '.js-btn-delete')
            .waitForElementVisible('.js-confirm-dialog', 5000)
            .assert.elementPresent('.js-confirm-dialog .js-ok-btn')
            .assert.elementPresent('.js-confirm-dialog .js-cancel-btn')
            .click('.js-confirm-dialog .js-cancel-btn')
            .waitForElementNotPresent('.js-confirm-dialog', 5000)
            .click('.js-btn-delete')
            .waitForElementVisible('.js-confirm-dialog', 5000)
            .click('.js-confirm-dialog .js-ok-btn')
            .waitForElementNotPresent(wrapperClass, 5000)
        undoDelete(wanIndex, wanInterface);
        client.waitForElementVisible(wrapperClass, 5000)

        return client;
    }

    this.undoDelete = function (wanIndex, wanInterface) {
        /*** TODO set the wanIndex Interface to wanInterface value ***/
        client.page.query().set_settings({
            wan: {
                $: {index: wanIndex},
                interface: wanInterface
            }
        }).then(function (data) {
            done();
        });
        return client;
    }

    this.validate_eth1 = function () {
        /*** This is just to validate, No actions done here ***/
        client
            .waitForElementVisible(".js-wan-eth1 .accordion-content", 5000)
            .assert.elementPresent(".js-wan-eth-interface")
            .assert.elementPresent(".js-wan-eth-interface .js-interface-link")
            .perform(function (client, done) {
                client.page.query().state("eth", 1).then(function(data){
                    client.assert.containsText(".js-wan-eth-interface>ul>li:nth-of-type(1)", data.eth.oper_status);
                    client.assert.containsText(".js-wan-eth-interface>ul>li:nth-of-type(2)", data.eth.description);
                    client.assert.containsText(".js-wan-eth-interface>ul>li:nth-of-type(3)", data.eth.link_speed);
                    client.assert.containsText(".js-wan-eth-interface>ul>li:nth-of-type(4)", data.eth.link_duplex);
                    done();
                });
            })
            .perform(function (client, done) {
                client.page.query().settings("wan", 1).then(function(data){
                    if(data.wan.dhcp==="off"){
                        client.assert.containsText(".js-input-dhcp .select-box .js-wan-eth-input>option","Manually");
                        client.assert.visible('.js-input-dhcp .select-box .js-wan-eth-input>option[value="off"]');
                        client.assert.elementPresent(".js-input-ip_address .js-wan-eth-input")
                        client.assert.elementPresent(".js-input-mask .js-wan-eth-input");
                        client.assert.elementPresent(".js-input-gateway .js-wan-eth-input");
                        client.assert.elementPresent(".js-input-dns1 .js-wan-eth-input");
                        client.assert.elementPresent(".js-input-dns2 .js-wan-eth-input");
                    }else if(data.wan.dhcp==="on"){
                        client.assert.containsText(".js-input-dhcp .select-box .js-wan-eth-input>option","DHCP");
                        client.assert.visible('.js-input-dhcp .select-box .js-wan-eth-input>option[value="on"]');
                        client.assert.elementNotPresent(".js-input-ip_address .js-wan-eth-input");
                        client.assert.elementNotPresent(".js-input-mask .js-wan-eth-input");
                        client.assert.elementNotPresent(".js-input-gateway .js-wan-eth-input");
                        client.assert.elementNotPresent(".js-input-dns1 .js-wan-eth-input");
                        client.assert.elementNotPresent(".js-input-dns2 .js-wan-eth-input");
                    }
                    done();
                });
            })
            .assert.containsText(".js-state-header","ETHERNET STATUS")
            .perform(function (client, done) {
                client.page.query().state("wan", 1).then(function(data){
                    var dns = data.wan.dns1 + ", " + data.wan.dns2
                    client.assert.containsText(".js-value.js-ipaddr", data.wan.ip_address);
                    client.assert.containsText(".js-value.js-netmask", data.wan.mask);
                    client.assert.containsText(".js-value.js-gateway", data.wan.gateway);
                    client.assert.containsText(".js-value.js-dns", dns);
                    done();
                });
            })
        return client;
    };

    this.validate_cellular = function (index) {
        /*** This is just to validate, No actions done here ***/
        client
            .waitForElementVisible(".js-wan-cellular1 .accordion-content", 5000)
            .assert.elementPresent(".js-wan-cellular-settings")
            .assert.elementPresent(".js-wan-cellular-settings .interface-link")
            .perform(function (client, done) {
                client.page.query().settings("cellular", index).then(function(data){
                    client.assert.containsText(".js-apn .js-value", data.cellular.apn);
                    client.assert.containsText(".js-username .js-value", data.cellular.apn_username);
                    //client.assert.containsText(".js-password .js-value", data.cellular.xxx);
                    //client.assert.containsText(".js-sim-pin .js-value", data.cellular.xxx);
                    client.assert.containsText(".js-preferred-mode .js-value", data.cellular.preferred_mode);
                    client.assert.containsText(".js-connection-attempts .js-value", data.cellular.connection_attempts);
                    client.assert.containsText(".js-state .js-value", data.cellular.state);
                    done();
                });
            })
            .assert.elementPresent(".js-wan-cellular1 .js-probe-host")
            .assert.elementPresent(".js-wan-cellular1 .js-probe-interval")
            .assert.elementPresent(".js-wan-cellular1 .js-probe-size")
            .assert.elementPresent(".js-wan-cellular1 .js-probe-timeout")
            .assert.elementPresent(".js-wan-cellular1 .js-activate-after")
            .assert.elementPresent(".js-wan-cellular1 .js-retry-after")
            .assert.elementPresent(".js-wan-cellular1 .js-timeout")
            .perform(function (client, done) {
                client.page.query().state("cellular", index).then(function(data){
                    client.assert.containsText(".js-wan-cellular1 .js-module .js-value",data.cellular.module)
                    client.assert.containsText(".js-wan-cellular1 .js-firmware-version .js-value",data.cellular.firmware_version)
                    client.assert.containsText(".js-wan-cellular1 .js-hardware-version .js-value",data.cellular.hardware_version)
                    client.assert.containsText(".js-wan-cellular1 .js-imei .js-value",data.cellular.imei)
                    client.assert.containsText(".js-wan-cellular1 .js-sim-status .js-value",data.cellular.sim_status)
                    client.assert.visible(".js-wan-cellular1 .js-signal-strength .js-value")
                    client.assert.visible(".js-wan-cellular1 .js-signal-quality .js-value")
                    client.assert.containsText(".js-wan-cellular1 .js-registration-status .js-value",data.cellular.registration_status)
                    client.assert.containsText(".js-wan-cellular1 .js-network-provider .js-value",data.cellular.network_provider)
                    client.assert.visible(".js-wan-cellular1 .js-temperature .js-value")
                    client.assert.containsText(".js-wan-cellular1 .js-connection-type .js-value",data.cellular.connection_type)
                    client.assert.containsText(".js-wan-cellular1 .js-radio-band .js-value",data.cellular.radio_band)
                    client.assert.containsText(".js-wan-cellular1 .js-channel .js-value",data.cellular.channel)
                    client.assert.containsText(".js-wan-cellular1 .js-apn-in-use .js-value",data.cellular.pdp_context)
                    client.assert.containsText(".js-wan-cellular1 .js-ip-address .js-value",data.cellular.ip_address)
                    client.assert.containsText(".js-wan-cellular1 .js-mask .js-value",data.cellular.mask)
                    //client.assert.containsText(".js-wan-cellular1 .js-gateway .js-value",data.cellular.gateway)
                    client.assert.containsText(".js-wan-cellular1 .js-dns-servers .js-value",data.cellular.dns_servers)
                done();
                });
            })

        return client;
    };

    this.validateFields_eth1 = function() {
        client
            .waitForElementVisible(".js-wan-eth1 .accordion-content",5000)

            //DHCP
            .click('.js-input-dhcp .select-box .js-wan-eth-input>option[value="on"]')
            .assert.elementNotPresent(".js-input-ip_address .js-wan-eth-input")
            .assert.elementNotPresent(".js-input-mask .js-wan-eth-input")
            .assert.elementNotPresent(".js-input-gateway .js-wan-eth-input")
            .assert.elementNotPresent(".js-input-dns1 .js-wan-eth-input")
            .assert.elementNotPresent(".js-input-dns2 .js-wan-eth-input")

            //Manual
            .click('.js-input-dhcp .select-box .js-wan-eth-input>option[value="off"]')
            .assert.elementPresent(".js-input-ip_address .js-wan-eth-input")
            .assert.elementPresent(".js-input-mask .js-wan-eth-input")
            .assert.elementPresent(".js-input-gateway .js-wan-eth-input")
            .assert.elementPresent(".js-input-dns1 .js-wan-eth-input")
            .assert.elementPresent(".js-input-dns2 .js-wan-eth-input")

            //Testing with invalid inputs (letters)
            .setInput(".js-input-ip_address .js-wan-eth-input","@asdasdasd")
            .setInput(".js-input-mask .js-wan-eth-input","@asdasdasd")
            .setInput(".js-input-gateway .js-wan-eth-input","@asdasdasd")
            .setInput(".js-input-dns1 .js-wan-eth-input","@asdasdasd")
            .setInput(".js-input-dns2 .js-wan-eth-input","@asdasdasd")
            .click(".js-wan-eth1 .js-apply")
            .waitForElementVisible(".js-wan-eth1 .error.form-submitted-error", 5000)
            .assert.containsText(".js-wan-eth1 .error.form-submitted-error", "Please correct highlighted errors.")
            .assert.containsText(".js-input-ip_address .error", 'Must use integers separated by "."')
            .assert.containsText(".js-input-mask .error", 'Must use integers separated by "."')
            .assert.containsText(".js-input-gateway .error", 'Must use integers separated by "."')
            .assert.containsText(".js-input-dns1 .error", 'Must use integers separated by "."')
            .assert.containsText(".js-input-dns2 .error", 'Must use integers separated by "."')

            //Testing with invalid inputs (invalid)
            .setInput(".js-input-ip_address .js-wan-eth-input","256.400.708.999")
            .setInput(".js-input-mask .js-wan-eth-input","256.400.708.999")
            .setInput(".js-input-gateway .js-wan-eth-input","256.400.708.999")
            .setInput(".js-input-dns1 .js-wan-eth-input","256.400.708.999")
            .setInput(".js-input-dns2 .js-wan-eth-input","256.400.708.999")
            .click(".js-wan-eth1 .js-apply")
            .waitForElementVisible(".js-wan-eth1 .error.form-submitted-error", 5000)
            .assert.containsText(".js-wan-eth1 .error.form-submitted-error", "Please correct highlighted errors.")
            .assert.containsText(".js-input-ip_address .error", 'Invalid IP address')
            .assert.containsText(".js-input-mask .error", 'Invalid IP address')
            .assert.containsText(".js-input-gateway .error", 'Invalid IP address')
            .assert.containsText(".js-input-dns1 .error", 'Invalid IP address')
            .assert.containsText(".js-input-dns2 .error", 'Invalid IP address')

            //Clear all changes by selecting cancel button
            .click(".js-wan-eth1 .js-cancel")

            //Testing of Probe fields - invalid values
            .setInput(".js-wan-eth1 .js-probe-host input", "abc")
            .setInput(".js-wan-eth1 .js-activate-after input", "")
            .setInput(".js-wan-eth1 .js-retry-after input", "")
            .setInput(".js-wan-eth1 .js-probe-interval input", "0")
            .setInput(".js-wan-eth1 .js-probe-size input", "0")
            .setInput(".js-wan-eth1 .js-probe-timeout input", "0")
            .setInput(".js-wan-eth1 .js-timeout input", "0")
            .click(".js-wan-eth1 .js-apply")
            .waitForElementVisible(".js-wan-eth1 .error.form-submitted-error", 5000)
            .assert.containsText(".js-wan-eth1 .error.form-submitted-error", "Please correct highlighted errors.")
            .assert.containsText(".js-wan-eth1 .js-probe-interval .error", 'Probe Interval must have a minimum value of 1 seconds and maximum of 3600 seconds')
            .assert.containsText(".js-wan-eth1 .js-probe-size .error", 'Probe Size must have minimum of 64 and maximum of 1500')
            .assert.containsText(".js-wan-eth1 .js-probe-timeout .error", 'Probe Timeout must have a minimum value of 1 second and maximum of 60 seconds')
            .assert.containsText(".js-wan-eth1 .js-timeout .error", 'Timeout must have a minimum value of 10 seconds and maximum of 3600 seconds')

            //Clear all changes by selecting cancel button
            .click(".js-wan-eth1 .js-cancel")

            //Testing of Probe fields - invalid values
            .setInput(".js-wan-eth1 .js-probe-host input", "")
            .setInput(".js-wan-eth1 .js-activate-after input", "")
            .setInput(".js-wan-eth1 .js-retry-after input", "")
            .setInput(".js-wan-eth1 .js-probe-interval input", "3601")
            .setInput(".js-wan-eth1 .js-probe-size input", "1501")
            .setInput(".js-wan-eth1 .js-probe-timeout input", "61")
            .setInput(".js-wan-eth1 .js-timeout input", "3601")
            .click(".js-wan-eth1 .js-apply")
            .waitForElementVisible(".js-wan-eth1 .error.form-submitted-error", 5000)
            .assert.containsText(".js-wan-eth1 .error.form-submitted-error", "Please correct highlighted errors.")
            .assert.containsText(".js-wan-eth1 .js-probe-interval .error", 'Probe Interval must have a minimum value of 1 seconds and maximum of 3600 seconds')
            .assert.containsText(".js-wan-eth1 .js-probe-size .error", 'Probe Size must have minimum of 64 and maximum of 1500')
            .assert.containsText(".js-wan-eth1 .js-probe-timeout .error", 'Probe Timeout must have a minimum value of 1 second and maximum of 60 seconds')
            .assert.containsText(".js-wan-eth1 .js-timeout .error", 'Timeout must have a minimum value of 10 seconds and maximum of 3600 seconds')

        return client;
    };

    this.validateFields_cellular = function(index) {
        client
            .waitForElementVisible(".js-wan-cellular"+index+" .accordion-content", 5000)

            //Testing of Probe fields - invalid values
            .setInput(".js-wan-cellular"+index+" .js-probe-host input", "")
            .setInput(".js-wan-cellular"+index+" .js-activate-after input", "")
            .setInput(".js-wan-cellular"+index+" .js-retry-after input", "")
            .setInput(".js-wan-cellular"+index+" .js-probe-interval input", "0")
            .setInput(".js-wan-cellular"+index+" .js-probe-size input", "0")
            .setInput(".js-wan-cellular"+index+" .js-probe-timeout input", "0")
            .setInput(".js-wan-cellular"+index+" .js-timeout input", "0")
            .click(".js-wan-cellular"+index+" .js-btn-apply")
            .waitForElementVisible(".js-wan-cellular"+index+" .error.form-submitted-error", 5000)
            .assert.containsText(".js-wan-cellular"+index+" .error.form-submitted-error", "Please correct highlighted errors.")
            .assert.containsText(".js-wan-cellular"+index+" .js-probe-interval .error", 'Probe Interval must have a minimum value of 1 seconds and maximum of 3600 seconds')
            .assert.containsText(".js-wan-cellular"+index+" .js-probe-size .error", 'Probe Size must have minimum of 64 and maximum of 1500')
            .assert.containsText(".js-wan-cellular"+index+" .js-probe-timeout .error", 'Probe Timeout must have a minimum value of 1 second and maximum of 60 seconds')
            .assert.containsText(".js-wan-cellular"+index+" .js-timeout .error", 'Timeout must have a minimum value of 10 seconds and maximum of 3600 seconds')

            //Clear all changes by selecting cancel button
            .click(".js-wan-cellular"+index+" .js-btn-cancel")

            //Testing of Probe fields - invalid values
            .setInput(".js-wan-cellular"+index+" .js-probe-host input", "")
            .setInput(".js-wan-cellular"+index+" .js-activate-after input", "")
            .setInput(".js-wan-cellular"+index+" .js-retry-after input", "")
            .setInput(".js-wan-cellular"+index+" .js-probe-interval input", "3601")
            .setInput(".js-wan-cellular"+index+" .js-probe-size input", "1501")
            .setInput(".js-wan-cellular"+index+" .js-probe-timeout input", "61")
            .setInput(".js-wan-cellular"+index+" .js-timeout input", "3601")
            .click(".js-wan-cellular"+index+" .js-btn-apply")
            .waitForElementVisible(".js-wan-cellular"+index+" .error.form-submitted-error", 5000)
            .assert.containsText(".js-wan-cellular"+index+" .error.form-submitted-error", "Please correct highlighted errors.")
            .assert.containsText(".js-wan-cellular"+index+" .js-probe-interval .error", 'Probe Interval must have a minimum value of 1 seconds and maximum of 3600 seconds')
            .assert.containsText(".js-wan-cellular"+index+" .js-probe-size .error", 'Probe Size must have minimum of 64 and maximum of 1500')
            .assert.containsText(".js-wan-cellular"+index+" .js-probe-timeout .error", 'Probe Timeout must have a minimum value of 1 second and maximum of 60 seconds')
            .assert.containsText(".js-wan-cellular"+index+" .js-timeout .error", 'Timeout must have a minimum value of 10 seconds and maximum of 3600 seconds')

            //Clear all changes by selecting cancel button
            .click(".js-wan-cellular"+index+" .js-btn-cancel")

        return client;
    };
}
