exports.command = function (username, password) {

    this
        .waitForElementVisible(".form-control[name=username]", 5000)
        .clearValue(".form-control[name=username]")
        .setValue(".form-control[name=username]", username)

        .waitForElementVisible(".form-control[type=password]", 5000)
        .clearValue(".form-control[type=password]")
        .setValue(".form-control[type=password]", password)

    return this;

};
