exports.command = function (username, password) {

    this
        .waitForElementVisible(".login", 5000)
        .setValue(".form-control[name=username]", username)
        .setValue(".form-control[type=password]", password)
        .click(".button-login")

    return this;

};
