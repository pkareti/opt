exports.command = function () {

    this
        .waitForElementVisible(".login-buttons", 5000)
        .click(".button-logout")
        .waitForElementVisible(".login", 5000)
        .assert.elementNotPresent(".button-logout")
    return this;

};
