// Click on select input, finds option distance from current postion, arrow keys to location.

exports.command = function (element, value) {
    const optionElement = 'option[value="' + value + '"]';
    this
        .waitForElementVisible(element, 5000)
        .click(element)
        .waitForElementVisible(optionElement, 5000)
        .click(optionElement)
        .pause(500)
        .keys(['\uE006']) //hits the enter key.

    return this;
};
