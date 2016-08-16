module.exports = function (client) {

    this.validate = function (apn) {
        client
            .perform(function (client, done) {
                client.page.query().state("system", 1).then(function (data) {
                    client.assert.containsText(".header-wrapper>header>h2>div", data.system.model);
                    done();
                });
            })
            .assert.elementPresent(".js-wz-cellular-results")
            .assert.elementPresent(".wizard-images>img")
            .assert.elementPresent(".wizard-content-text")
            .perform(function (client, done) {
                client.page.query().state("cellular", 1).then(function (data) {
                    var strength = data.cellular.signal_strength;
                    var quality = data.cellular.signal_quality;
                    var str = strength.split(" ")
                    var qual = quality.split(" ")
                    client
                        .assert.containsText(".simStatus>p:nth-child(1)", data.cellular.sim_status)
                        .assert.containsText(".simStatus>p:nth-child(2)", "ICCID")
                        .assert.containsText(".simStatus>p:nth-child(3)", str[0])
                        .assert.containsText(".simStatus>p:nth-child(4)", qual[0])
                        .assert.containsText(".cellularResults>p:nth-child(1)", data.cellular.description)
                        .assert.containsText(".cellularResults>p:nth-child(2)", data.cellular.module)
                        .assert.containsText(".cellularResults>p:nth-child(3)", data.cellular.firmware_version)
                        .assert.containsText(".cellularResults>p:nth-child(4)", data.cellular.hardware_version)
                        .assert.containsText(".cellularResults>p:nth-child(5)", data.cellular.imei)
                        .assert.containsText(".cellularResults>p:nth-child(6)", data.cellular.registration_status)
                        .assert.containsText(".cellularResults>p:nth-child(7)", data.cellular.network_provider)
                        .assert.visible(".cellularResults>p:nth-child(8)")
                        .assert.containsText(".cellularResults>p:nth-child(9)", data.cellular.connection_type)
                        .assert.containsText(".cellularResults>p:nth-child(10)", data.cellular.radio_band)
                        .assert.containsText(".cellularResults>p:nth-child(11)", data.cellular.channel)
                        .assert.containsText(".cellularResults>p:nth-child(12)", data.cellular.pdp_context)
                        .assert.containsText(".cellularResults>p:nth-child(13)", data.cellular.ip_address)
                        .assert.containsText(".cellularResults>p:nth-child(14)", data.cellular.mask)
                        //.assert.containsText(".cellularResults>p:nth-child(15)",data.cellular.gateway)
                        .assert.containsText(".cellularResults>p:nth-child(16)", data.cellular.dns_servers)
                        .assert.visible(".cellularResults>p:nth-child(17)")
                        .assert.visible(".cellularResults>p:nth-child(18)")
                        .assert.visible(".cellularResults>p:nth-child(19)")
                        .assert.visible(".cellularResults>p:nth-child(20)")
                    done();
                });
            })

        return client;
    };

};

