module.exports = function (client) {
    this.validateNetworkActivity = function () {
        client
            .waitForElementVisible('.js-network-activity-lan', 5000)
            //Lan
            .assert.containsText('.js-network-activity-lan', 'LAN')
            .assert.visible(".js-network-activity-lan .row:nth-of-type(1)")
            .assert.visible(".js-network-activity-lan .row:nth-of-type(2)")
            //Wan
            .assert.containsText('.js-network-activity-wan', 'WAN')
            .assert.visible(".js-network-activity-wan .row:nth-of-type(1)")
            .assert.visible(".js-network-activity-wan .row:nth-of-type(2)")
        return client;
    };

    this.validateCloud = function () {
        client
            .waitForElementVisible('.js-cloud', 5000)
            .assert.containsText('.js-cloud .js-status', 'Status')
            .perform(function (client, done) {
                client.page.query().state("cloud", 1).then(function (data) {
                    client
                        .getText('css selector', '.js-cloud .js-status .js-value', function (result) {
                            client.assert.equal((result.value).toLowerCase(), data.cloud.status);
                        })
                        .assert.visible('.js-cloud .js-uptime .js-value')
                        .assert.containsText('.js-cloud .js-device-id .js-value', data.cloud.deviceid)
                        .assert.visible('.js-cloud .js-packets')
                        .assert.visible('.js-cloud .js-bytes')
                    done();
                });
            })
        return client;
    };

    this.validateSystem = function () {
        client
            .waitForElementVisible('.js-dashboard-system', 5000)
            .perform(function (client, done) {
                client.page.query().state("system", 1).then(function (data) {
                    var fw = (data.system.firmware_version).split(" ");
                    client
                        .assert.visible('.js-dashboard-system .js-uptime .js-value')
                        .assert.visible('.js-dashboard-system .js-sys-time .js-value')
                        .assert.visible('.js-dashboard-system .js-cpu .js-value')
                        .assert.visible('.js-dashboard-system .js-temperature .js-value')
                        .assert.containsText('.js-dashboard-system .js-description .js-value', data.system.description)
                        .assert.containsText('.js-dashboard-system .js-contact .js-value', data.system.contact)
                        .assert.containsText('.js-dashboard-system .js-location .js-value', data.system.location)
                        .assert.containsText('.js-dashboard-system .js-model .js-value', data.system.model)
						.assert.containsText('.header-wrapper>header>h2', data.system.model)
                        .assert.containsText('.js-dashboard-system .js-part-num .js-value', data.system.part_number)
                        .assert.containsText('.js-dashboard-system .js-serial-num .js-value', data.system.serial_number)
                        .assert.containsText('.js-dashboard-system .js-hw-version .js-value', data.system.hardware_version)
                        .assert.containsText('.js-dashboard-system .js-fw-version .js-value', fw[0])
                        .assert.containsText('.js-dashboard-system .js-boot-version .js-value', data.system.bootloader_version)
                    done();
                });
            })
        return client;
    };

    this.validateInterfaces = function () {
        client
            .waitForElementVisible('.js-dashboard-eth', 5000)
            //Tests for eth interfaces
            .perform(function (client, done) {
                client.page.query().state("eth").then(function (data) {
                    if (data.eth[0].admin_status === "up") {
						client.assert.elementPresent(".js-eth.row.js-eth-1", "WAN/Eth1 is present");
						client.getText('css selector','.js-eth.row.js-eth-1 .js-value', function (result){
                            client.assert.equal((result.value).toLowerCase(), data.eth[0].oper_status, "WAN/Eth1 status verified");
                        });
                    } else if (data.eth[0].admin_status === "down") {
						client.assert.elementNotPresent(".js-eth.row.js-eth-1", "WAN/Eth1 is not present");
					};
                    if (data.eth[1].admin_status === "up") {
						client.assert.elementPresent(".js-eth.row.js-eth-2", "Eth2 is present");
						client.getText('css selector','.js-eth.row.js-eth-2 .js-value', function (result){
                            client.assert.equal((result.value).toLowerCase(), data.eth[1].oper_status, "Eth2 status verified");
                        });
                    } else if (data.eth[1].admin_status === "down") {
						client.assert.elementNotPresent(".js-eth.row.js-eth-2", "Eth2 is not present");
					};
                    if (data.eth[2].admin_status === "up") {
						client.assert.elementPresent(".js-eth.row.js-eth-3", "Eth3 is present");
						client.getText('css selector','.js-eth.row.js-eth-3 .js-value', function (result){
                            client.assert.equal((result.value).toLowerCase(), data.eth[2].oper_status, "Eth3 status verified");
                        });
                    } else if (data.eth[2].admin_status === "down") {
						client.assert.elementNotPresent(".js-eth.row.js-eth-3", "Eth3 is not present");
					};
                    if (data.eth[3].admin_status === "up") {
						client.assert.elementPresent(".js-eth.row.js-eth-4", "Eth4 is present");
						client.getText('css selector','.js-eth.row.js-eth-4 .js-value', function (result){
                            client.assert.equal((result.value).toLowerCase(), data.eth[3].oper_status, "Eth4 status verified");
                        });
                    } else if (data.eth[3].admin_status === "down") {
						client.assert.elementNotPresent(".js-eth.row.js-eth-4", "Eth4 is not present");
					};
                    done();
                });
            })
			//Tests for Cellular interfaces
            .perform(function (client, done) {
                client.page.query().state("cellular").then(function(data){
                    if(data.cellular.admin_status==="up"){
                        client.assert.elementPresent(".js-cellular", "Cellular1 is present");
                        client.getText('css selector','.js-cellular .js-value', function (result){
                            client.assert.equal((result.value).toLowerCase(), data.cellular.oper_status, "Cellular1 status verified");
                        });
                    } else if(data.cellular.admin_status==="down"){
                        client.assert.elementNotPresent(".js-cellular", "Cellular1 is not present");
                    };
                    done();
                });
            })
			//Tests for wifi interfaces
			.perform(function (client, done) {
				client.page.query().state("wifi").then(function(data){
                    if(data.wifi[0].admin_status==="up"){
                        client.assert.elementPresent(".js-wifi-1", "Wifi1 is present");
                        client.getText('css selector','.js-wifi-1 .js-value', function (result){
                            client.assert.equal((result.value).toLowerCase(), data.wifi[0].oper_status, "Wifi1 status verified");
                        });
                    } else if(data.wifi[0].admin_status==="down"){
                        client.assert.elementNotPresent(".js-wifi-1", "Wifi1 is not present");
                    };
                    if(data.wifi[1].admin_status==="up"){
                        client.assert.elementPresent(".js-wifi-2", "Wifi2 is present");
                        client.getText('css selector','.js-wifi-2 .js-value', function (result){
                            client.assert.equal((result.value).toLowerCase(), data.wifi[1].oper_status, "Wifi2 status verified");
                        });
                    } else if(data.wifi[1].admin_status==="down"){
                        client.assert.elementNotPresent(".js-wifi-2", "Wifi2 is not present");
                    };
                    if(data.wifi[2].admin_status==="up"){
                        client.assert.elementPresent(".js-wifi-3", "Wifi3 is present");
                        client.getText('css selector','.js-wifi-3 .js-value', function (result){
                            client.assert.equal((result.value).toLowerCase(), data.wifi[2].oper_status, "Wifi3 status verified");
                        });
                    } else if(data.wifi[2].admin_status==="down"){
                        client.assert.elementNotPresent(".js-wifi-3", "Wifi3 is not present");
                    };
                    if(data.wifi[3].admin_status==="up"){
                        client.assert.elementPresent(".js-wifi-4", "Wifi4 is present");
                        client.getText('css selector','.js-wifi-4 .js-value', function (result){
                            client.assert.equal((result.value).toLowerCase(), data.wifi[3].oper_status, "Wifi4 status verified");
                        });
                    } else if(data.wifi[3].admin_status==="down"){
                        client.assert.elementNotPresent(".js-wifi-4", "Wifi4 is not present");
                    };
                    done();
                });
            })
            //Tests for wifi5g interfaces
            .perform(function (client, done) {
                client.page.query().state("wifi5g").then(function(data){
                    if(data.wifi5g[0].admin_status==="up"){
                        client.assert.elementPresent(".js-wifi5g-1", "Wifi5g1 is present");
                        client.getText('css selector','.js-wifi5g-1 .js-value', function (result){
                            client.assert.equal((result.value).toLowerCase(), data.wifi5g[0].oper_status, "Wifi5g1 status verified");
                        });
                    } else if(data.wifi5g[0].admin_status==="down"){
                        client.assert.elementNotPresent(".js-wifi5g-1", "Wifi5g1 is not present");
                    };
                    if(data.wifi5g[1].admin_status==="up"){
                        client.assert.elementPresent(".js-wifi5g-2", "Wifi5g2 is present");
                        client.getText('css selector','.js-wifi5g-2 .js-value', function (result){
                            client.assert.equal((result.value).toLowerCase(), data.wifi5g[1].oper_status, "Wifi5g2 status verified");
                        });
                    } else if(data.wifi5g[1].admin_status==="down"){
                        client.assert.elementNotPresent(".js-wifi5g-2", "Wifi5g2 is not present");
                    };
                    if(data.wifi5g[2].admin_status==="up"){
                        client.assert.elementPresent(".js-wifi5g-3", "Wifi5g3 is present");
                        client.getText('css selector','.js-wifi5g-3 .js-value', function (result){
                            client.assert.equal((result.value).toLowerCase(), data.wifi5g[2].oper_status, "Wifi5g3 status verified");
                        });
                    } else if(data.wifi5g[2].admin_status==="down"){
                        client.assert.elementNotPresent(".js-wifi5g-3", "Wifi5g3 is not present");
                    };
                    if(data.wifi5g[3].admin_status==="up"){
                        client.assert.elementPresent(".js-wifi5g-4", "Wifi5g4 is present");
                        client.getText('css selector','.js-wifi5g-4 .js-value', function (result){
                            client.assert.equal((result.value).toLowerCase(), data.wifi5g[3].oper_status, "Wifi5g4 status verified");
                        });
                    } else if(data.wifi5g[3].admin_status==="down"){
                        client.assert.elementNotPresent(".js-wifi5g-4", "Wifi5g4 is not present");
                    };
                 done();
                });
			})
        return client;
    };

    this.validateLAN = function () {
        client
            .waitForElementVisible('.js-dashboard-lan', 5000)
            .elements('css selector', '.js-lan', function (result) {
                client.assert.equal(result.value.length, 1)
            })
            .assert.containsText('.js-lan:first-of-type h6', 'LAN 1')
            .expect.element('.js-lan:first-of-type .js-value').to.have.value.not.equals('');

        return client;
    };

    this.validate_info = function (type) {
        client
            .waitForElementVisible('.js-dashboard', 5000)
        if (type === "non-secure") {
            client
                .assert.elementNotPresent(".button-logout")
                .verify.elementNotPresent(".js-network-activity-lan")
                .verify.elementNotPresent(".js-network-activity-wan")
                .verify.elementNotPresent(".js-cloud")
                .verify.elementPresent(".js-dashboard-system")
                .verify.elementNotPresent(".js-dashboard-eth")
                .verify.elementNotPresent(".js-dashboard-lan")
        }
        else if (type === "secure") {
            client
                .assert.elementPresent(".button-logout")
                .verify.elementPresent(".js-network-activity-lan")
                .verify.elementPresent(".js-network-activity-wan")
                .verify.elementPresent(".js-cloud")
                .verify.elementPresent(".js-dashboard-system")
                .verify.elementPresent(".js-dashboard-eth")
                .verify.elementPresent(".js-dashboard-lan")
        }
        return client;
    };
};