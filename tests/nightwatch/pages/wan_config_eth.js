module.exports = function (client, wrapperClass) {

    this.openAccordion = function () {
        client
            .click(wrapperClass + ' .expander-trigger')
            .waitForElementVisible('.accordion-content', 5000)

        return client;
    };

    this.validateInterfaces = function (ethIndex) {
        var url = client.globals.get_Device.url;
        console.log('url', url);
        client
            .waitForElementVisible(wrapperClass + ' .js-wan-eth-interface', 5000)
            .expect.element(wrapperClass + ' .js-wan-eth-interface .js-value').to.have.value.not.equals('');

        // Validate modal appears when changes made and clicking on inteface.
        // Check route works, reopen wan eth config
        client
            .waitForElementVisible(wrapperClass + ' .js-wan-eth-settings', 5000)
            .setSelect(wrapperClass + ' select[name=dhcp]', 'off') // in case on, but might be off
            .setInput(wrapperClass + ' input[name=ip_address]', '110.20.1.39')
            .click(wrapperClass + ' .js-interface-link')
            .waitForElementVisible('.js-confirm-dialog', 5000)
            .click('.js-confirm-dialog .js-ok-btn')
            .waitForElementVisible('.js-interfaces', 5000)
            .url(url + '/wan').waitForElementVisible(wrapperClass, 5000)

        this.openAccordion();

        return client;
    };

    this.validateIPSettings_manual = function () {
        /*** Please update globals.js with valid Ip, mask, dns1, and dns2 to run the manual IP settings test */
        // --- Validate DHCP 'off' (manual config) setting ---
        var user = client.globals.get_Device.username;
        var pwd = client.globals.get_Device.password;
        var current_ip = client.globals.get_Device.current_ip;
        var current_mask = client.globals.get_Device.current_mask;
        var current_gateway = client.globals.get_Device.current_gateway;
        var current_dns1 = client.globals.get_Device.current_dns1;
        var current_dns2 = client.globals.get_Device.current_dns2;
        var current_dns = current_dns1 + ", " + current_dns2;
        var new_ip = client.globals.get_Device.new_ip;
        var new_mask = client.globals.get_Device.new_mask;
        var new_gateway = client.globals.get_Device.new_gateway
        var new_dns1 = client.globals.get_Device.new_dns1;
        var new_dns2 = client.globals.get_Device.new_dns2;
        var new_dns = new_dns1 + ", " + new_dns2;
        var host = "http://"+new_ip;
        client
            .waitForElementVisible('.js-wan-eth1 .js-wan-eth-settings', 5000)
            .click('.js-input-dhcp .select-box .js-wan-eth-input>option[value="off"]')
            .setInput('.js-wan-eth1 .js-input-ip_address .js-wan-eth-input', new_ip)
            .setInput('.js-wan-eth1 .js-input-mask .js-wan-eth-input', new_mask)
            .setInput('.js-wan-eth1 .js-input-gateway .js-wan-eth-input', new_gateway)
            .setInput('.js-wan-eth1 .js-input-dns1 .js-wan-eth-input', new_dns1)
            .setInput('.js-wan-eth1 .js-input-dns2 .js-wan-eth-input', new_dns2)
            .click(".js-wan-eth1 .js-apply")
            .waitForElementVisible('.js-confirm-dialog', 5000)
            .click('.js-confirm-dialog .js-ok-btn')
            .pause(3000)
            .click("#cancelBtn")
            .execute(function (host, window1) {
                window.open(host, window1, "height=1024,width=768");
            }, [host])
            .window_handles(function(result) {
                var temp = result.value[1];
                console.log(temp)
                client.switchWindow(temp);
            })
            .waitForElementVisible(".js-dashboard", 15000)
            .page.device_ui().login(user, pwd)
            .page.device_ui().selectNavMenu("wan")
            .waitForElementVisible(".js-wan-eth1", 5000)
            .page.wan_config().openAccordion(".js-wan-eth1")
            .assert.containsText(".js-value.js-ipaddr", new_ip)
            .assert.containsText(".js-value.js-netmask", new_mask)
            .assert.containsText(".js-value.js-gateway", new_gateway)
            .assert.containsText(".js-value.js-dns", new_dns)
        //clean-upp (change back to default)
            .click('.js-input-dhcp .select-box .js-wan-eth-input>option[value="off"]')
            .setInput('.js-wan-eth1 .js-input-ip_address .js-wan-eth-input', current_ip)
            .setInput('.js-wan-eth1 .js-input-mask .js-wan-eth-input', current_mask)
            .setInput('.js-wan-eth1 .js-input-gateway .js-wan-eth-input', current_gateway)
            .setInput('.js-wan-eth1 .js-input-dns1 .js-wan-eth-input', current_dns1)
            .setInput('.js-wan-eth1 .js-input-dns2 .js-wan-eth-input', current_dns2)
            .click(".js-wan-eth1 .js-apply")
            .pause(3000)
            .click("#cancelBtn")
        return client;
    };

    this.validateIPSettings_dhcp = function () {

        var lan1_url = client.globals.get_Device.lan1_url;
        var current_ip = client.globals.get_Device.current_ip;
        var current_mask = client.globals.get_Device.current_mask;
        var current_gateway = client.globals.get_Device.current_gateway;
        var current_dns1 = client.globals.get_Device.current_dns1;
        var current_dns2 = client.globals.get_Device.current_dns2;

        client
            .waitForElementVisible(".js-wan-eth1 .accordion-content",5000)
            .click('.js-input-dhcp .select-box .js-wan-eth-input>option[value="on"]')
            .click(".js-wan-eth1 .js-apply")
            .waitForElementVisible(".dialog--jss-0-0", 5000)
            .assert.containsText(".js-confirm-dialog .confirmation-msg", "APPLY CONFIRMATION")
        //Selecting cancel to validate the reverting option
            .click("#cancelBtn")
            .waitForElementVisible(".js-wan-eth1 .accordion-content",5000)
            .click('.js-input-dhcp .select-box .js-wan-eth-input>option[value="on"]')
            .click(".js-wan-eth1 .js-apply")
            .waitForElementVisible(".dialog--jss-0-0", 5000)
            .assert.containsText(".js-confirm-dialog .confirmation-msg", "APPLY CONFIRMATION")
            .click("#okBtn")
            .pause(3000)
            .url(lan1_url+"/wan")
            .page.wan_config().openAccordion(".js-wan-eth1")
            .perform(function (client, done) {
                client.page.query().settings("wan", 1).then(function(data){
                    client.assert.equal(data.wan.dhcp_client, "on", "DHCP succefully changed")
                    done();
                });
            })
            .perform(function (client, done) {
                client.page.query().state("wan", 1).then(function(data){
                    client.containsText(".js-wan-eth1 .js-value.js-ipaddr",data.wan.ip_address);
                    done();
                });
            })
            //clean-upp (change back to default)
            .click('.js-input-dhcp .select-box .js-wan-eth-input>option[value="off"]')
            .setInput('.js-wan-eth1 .js-input-ip_address .js-wan-eth-input', current_ip)
            .setInput('.js-wan-eth1 .js-input-mask .js-wan-eth-input', current_mask)
            .setInput('.js-wan-eth1 .js-input-gateway .js-wan-eth-input', current_gateway)
            .setInput('.js-wan-eth1 .js-input-dns1 .js-wan-eth-input', current_dns1)
            .setInput('.js-wan-eth1 .js-input-dns2 .js-wan-eth-input', current_dns2)

            .click(".js-wan-eth1 .js-apply")
            .pause(3000)
        return client;
    };

    this.validateIPSettings_probe = function () {
        var probe_host = "www.digi.com";
        var probe_interval = "120";
        var probe_size = "128";
        var probe_timeout = "6";
        var probe_activate_after = "1";
        var probe_retry_after = "360";
        var timeout = "360";
        client
            .waitForElementVisible(".js-wan-eth1 .accordion-content",5000)
            .setInput(".js-wan-eth1 .js-probe-host input", probe_host)
            .setInput(".js-wan-eth1 .js-probe-interval input", probe_interval)
            .setInput(".js-wan-eth1 .js-probe-size input", probe_size)
            .setInput(".js-wan-eth1 .js-probe-timeout input", probe_timeout)
            .setInput(".js-wan-eth1 .js-activate-after input", probe_activate_after)
            .setInput(".js-wan-eth1 .js-retry-after input", probe_retry_after)
            .setInput(".js-wan-eth1 .js-timeout input", timeout)
            .click(".js-wan-eth1 .js-apply")
            .waitForElementVisible(".js-wan-eth1 .status-green", 5000)
            .perform(function (client, done) {
                client.page.query().settings("wan", 1).then(function (data) {
                    client.assert.equal(data.wan.probe_host, probe_host, "Probe host changed");
                    client.assert.equal(data.wan.probe_interval, probe_interval, "Probe interval changed");
                    client.assert.equal(data.wan.probe_size, probe_size, "Probe size changed");
                    client.assert.equal(data.wan.probe_timeout, probe_timeout, "Probe timeout changed");
                    client.assert.equal(data.wan.activate_after, probe_activate_after, "Probe activate after changed");
                    client.assert.equal(data.wan.retry_after, probe_retry_after, "Probe rety after changed");
                    client.assert.equal(data.wan.timeout, timeout, "Timeout changed");
                    done();
                });
            })
        return client;
    };
}
