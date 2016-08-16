exports.command = function (newusername, newpassword) {
    this.waitForElementVisible(".change-password-form", 5000)
        .clearValue(".form-control[name=username]")
        .clearValue(".form-control[name=password]")
        .clearValue(".form-control[name=confirmpassword]")

    if (newusername != null) {
        this.setValue(".form-control[name=username]", newusername)
    }
    if (newpassword != null) {
        this.setValue(".form-control[name=password]", newpassword)
        this.setValue(".form-control[name=confirmpassword]", newpassword)
    }

    return this;
};
