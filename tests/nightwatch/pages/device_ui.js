module.exports = function (client) {
    
    this.login = function (user, pwd) {

        client

            .waitForElementVisible(".login", 5000)
            .setValue(".form-control[name='username']", user)
            .setValue(".form-control[type='password']", pwd)
            .click(".button-login")
            .waitForElementVisible(".button-logout", 5000)
            .assert.containsText('.button-logout', 'LOGOUT')

        return client;
    };

    this.validate_login = function (user) {

        client
            .perform(function (client, done) {
                client.page.query().settings("user").then(function (data) {
                    var i;
                    for (i = 0; i < 10; i++) {
                        if (data.user[i].name === user) {
                            console.log("Username verified : " + data.user[i].name);
                        }
                    }
                    done();
                });
            })
        return client;

    };

    this.logout = function () {

        client

            .waitForElementVisible(".button-logout", 5000)
            .assert.containsText('.button-logout', 'LOGOUT')
            .click(".button-logout")
            .waitForElementVisible(".form-control[name='username']", 5000)
            .assert.elementNotPresent(".button-logout")

        return client;
    };

    /**
     * selectNavMenu can be used to select a menu item from Navigation menu
     * @props
     * route: path of the menu item to be selected
     */
    this.selectNavMenu = function(route) {
        client
            
            .waitForElementVisible(".button-logout", 5000)
            .assert.elementPresent('.nav-menu')
            .waitForElementVisible('.nav-menu-list>li>a[href="/'+route+'"]', 5000)
            .click('.nav-menu-list>li>a[href="/'+route+'"]')
            .waitForElementVisible(".js-"+route, 5000)
        
        return client;
    };

};
