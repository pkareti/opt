module.exports = function (client) {
    this.validate = function () {

        client
            .waitForElementVisible(".js-wz-ethernet-results", 5000)
            .perform(function (client, done) {
                client.page.query().state("system", 1).then(function (data) {
                    client.assert.containsText(".header-wrapper>header>h2>div", data.system.model);
                    done();
                });
            })
            .assert.elementPresent(".js-wz-ethernet-results")
            .assert.elementPresent(".wizard-images>img")
            .assert.containsText(".wizard-content-area-right>div>h6", "Ethernet Connection Results")
            .assert.containsText(".cellularResults.js-ethernet-results>p:nth-child(1)>label", "MAC")
            .assert.containsText(".cellularResults.js-ethernet-results>p:nth-child(2)>label", "IPv4")
            .assert.containsText(".cellularResults.js-ethernet-results>p:nth-child(3)>label", "Subnet")
            .assert.containsText(".cellularResults.js-ethernet-results>p:nth-child(4)>label", "DNS")
            .perform(function (client, done) {
                client.page.query().state("eth", 1).then(function (data) {
                    client.assert.containsText(".cellularResults.js-ethernet-results>p:nth-child(1)>span", data.eth.mac_address);
                    done();
                });
            })
            .perform(function (client, done) {
				client.page.query().settings("wan", 1).then(function(data){
					client.assert.containsText(".ethernet-results.js-ethernet-results>p:nth-child(2)>span",data.wan.ip_address);
					client.assert.containsText(".ethernet-results.js-ethernet-results>p:nth-child(3)>span",data.wan.mask);
					client.assert.containsText(".ethernet-results.js-ethernet-results>p:nth-child(4)>span",data.wan.dns1);
					done();
				});
            })

        return client;
    };
};

