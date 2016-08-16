'use strict';
/**
 * SAReportable helper functions
 *
 * These functions are used to annotate nightwatch testcase descriptions with information about the test.
 * These annotations will then be used to augment the information stored in testrail when the run results
 * processed.
 */
var path = require('path');

/**
 * This tag is used by the helpers to determine if the testcase name has been annotated with the helper or not.
 */
var TAG = '@SAReportable:';
var FUNCTIONAL_TEST_PATH = process.env.functionaltestpath || '/tests/nightwatch/functional_tests/';

/**
 * Encodes the provided SAReportable options object into a single string value. The options object can have the following fields
 *   title - title of the test case (required)
 *   description - a description of the test case
 *   reference - the corresponding JIRA issue
 *
 * The following parameters are not typically supplied but can be used to
 * override the names that are normally automatically computed by the reporter
 * based on folder hierarchy
 *   suiteName - name of the suite that holds the section(s) and test case. Defaults to top folder in the
 *               path to this file (beneath test folder)
 *   sectionName - name of the section that holds the test case. Sections can be nested. If a section is nested,
 *                 the parent section(s) are prepended to the section name and delimited by the '/' character.
 *                   Example: "Parent Section/Child Section".
 *                 Defaults tp the remaining folder path to this test file.
 *
 */
var encode = function (options) {
    var value = TAG + JSON.stringify(options);
    return value;
}

/**
 * Computes the default section name for a given nightwatch test file.
 * @param filename - the full filespec of the nightwatch test file
 * @returns array of section names that make up the section/subsection path to the testsuite
 */
var dftSectionName = function (filename) {
    var relativePath = process.cwd() + FUNCTIONAL_TEST_PATH;
    var sectionName = filename.slice((relativePath).length, -(path.extname(filename).length)).split('/');
    return sectionName;
}

/**
 * Decodes an encoded description string into the SAReportable options
 */
var decode = function (value) {
    var options = {};
    value = value.toString();
    if (!!value && value.indexOf(TAG) === 0) {
        options = JSON.parse(value.slice(TAG.length));
    } else {
        options['title'] = value;
    }
    return options;
}

/**
 * Encodes the provided SAReportable fields into a single string value
 * @param title - title of the test case
 * @param description - a description of the test case.
 * @param reference - the corresponding JIRA issue.
 *
 * The following parameters are not typically supplied but can be used to
 * override the names that are normally automatically computed by the reporter
 * based on folder hierarchy
 * @param suiteName: name of the suite that holds the section(s)
 * and test case. Defaults to top folder in the path to this file (beneath test folder)
 * @param sectionName - name of the section that holds the test
 * case. Sections can be nested. If a section is nested,
 * the parent section(s) are prepended to the section name
 * and delimited by the '/' character. Example:
 * "Parent Section/Child Section". Defaults tp the remaining folder path to
 * this test file.
 */
var sar = function (title, description, reference, suiteName, sectionName) {
    var options = {};
    if (!!title) options['title'] = title;
    if (!!description) options['description'] = description;
    if (!!reference) options['reference'] = reference;
    if (!!suiteName) options['suiteName'] = suiteName;
    if (!!sectionName) options['sectionName'] = sectionName;
    return encode(options);
}

module.exports = {
    encode: encode,
    decode: decode,
    sar: sar,
    dftSectionName: dftSectionName
};
