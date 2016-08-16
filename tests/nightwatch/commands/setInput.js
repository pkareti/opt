// Performs necessary clearValue prior to setValue

exports.command = function (element, value) {
    this
        .waitForElementVisible(element, 5000)
        .clearValue(element)
        .setValue(element, value)

    return this;
};
