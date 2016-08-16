exports.command = function (page) {

    this

        .waitForElementVisible(".main-container", 5000)
        .assert.containsText("", page)

    return this;

};
