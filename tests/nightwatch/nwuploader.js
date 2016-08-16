/**
 * Reads nightwatch results and uploads them to testrail
 *
 * Scans nightwatch report directory and looks for nightwatch test result files. The report directory can be partitioned
 * into subdirectories, each containing one or more result file. The subdirectory structure will be represented in testrail
 * as a section/subsection hierarchy. Each result file can contain one or more testcases.
 *
 * As files are scanned, the tool will interrogate testrail to determine if the proper constructs exist and will create them
 * as needed.
 *
 * Arguments can be passed to control what testrail system and credentials to use, what testrail
 * project and suite the results should be attributed to, and what Milestone the run results should be recorded under.
 * Passing the -h argument will show help on all the program arguments.
 *
 * Environment variables can also be passed to supply program arguments. Generally just use the same environment variables
 * name as the full argument name.
 *
 * Related:
 * Testcases that have been encoded with the sareportable.encode() macro will have extended annotation in the testrail testcase. See the
 * sareportable.js module for details.
 *
 */

'use strict';

var _ = require('lodash'); //jshint ignore:line
var Q = require('q');
var debug = require('debug')('tr');
var fs = require('fs');
var path = require('path');
var util = require('util');
var minimist = require('minimist');

var TR = require('./tr');
var sar = require('./sareportable');

var options = require("yargs")
    .usage("Usage: $0 -p \"project\" -m \"milestone\" -s \"suite\" [-d \"suite desc\"] -u \"username\" --pw \"password\"")
    .option("p", {
        alias: "projectName",
        demand: !process.env.projectName,
        describe: "Testrail project to record under",
        type: "string"
    })
    .option("m", {
        alias: "milestoneName",
        demand: !process.env.milestone,
        describe: "Testrail milestone to record under",
        type: "string"
    })
    .option("s", {
        alias: "suiteName",
        demand: !process.env.suiteName,
        describe: "Testrail suite to record under",
        type: "string"
    })
    .option("d", {alias: "suiteDescription", demand: false, describe: "Description of Testrail suite", type: "string"})
    .option("f", {
        alias: "firmwareVersion",
        demand: false,
        describe: "Version of firmware tests were ran against",
        type: "string"
    })
    .option("u", {
        alias: "username",
        demand: !process.env.testRailUsername,
        describe: "Testrail username to record under",
        type: "string"
    })
    .option("pw", {
        alias: "password",
        demand: !process.env.testRailPassword,
        describe: "password for testrail user",
        type: "string"
    })
    .help("?")
    .alias("?", "help")
    .argv;
debug('command line args:', options);

// Grab the command line args. Default to env variables if not specifically provided through args.
var projectName = options.p || process.env.projectName;
var milestoneName = options.m || process.env.milestoneName;
var suiteName = options.s || process.env.suiteName;
var suiteDescription = options.d || process.env.suiteDescription;
var firmwareVersion = options.f || process.env.firmwareVersion;
var username = options.u || process.env.testRailUsername;
var password = options.pw || process.env.testRailPassword;


/**
 * Scan the provided nightwatch suite report and upload pertenent data to test rail.
 * Specifically:
 *   - ensure the appropriate testrail cases exist to represent each testcase in the nightwatch suite
 *   - determines the proper run result for each testcase in the nightwatch report
 *   - aggregate and return the testcase results to the caller as a promise
 */
var recordNightwatchSuites = function (tr, trProject, trSuite, trSection, trMilestone, moduleReport) {
    var suiteReports = moduleReport.completed;
    // We'll handle completed and skipped cases together by injecting the skipped cases into the completed cases
    // and setting their skipped count to 1
    _.forEach(moduleReport.skipped, function (testCaseName) {
        var skippedReport = {
            passed: 0,
            failed: 0,
            errors: 0,
            skipped: 1,
            assertions: []
        };
        suiteReports[testCaseName] = skippedReport;
    });
    // Now walk all the completed reports to create test cases and capture the results
    var result = Q([]);
    _.forOwn(suiteReports, function (testcaseReport, testcaseName) {
        result = result.then(function (suiteResults) {
            debug('examining testcase: ', testcaseName, testcaseReport);
            var testcaseInfo = sar.decode(testcaseName);
            // var testcaseName = testcaseInfo.title;
            console.log(util.format('    testcase "%s" - %s', testcaseInfo.title,
                (testcaseReport.failed + testcaseReport.errors > 0 ? 'FAILED' : (testcaseReport.skipped > 0 ? 'SKIPPED' : 'PASSED'))));
            debug(util.format('    passed(%d), failed(%d), errors(%d), skipped(%d)',
                testcaseReport.passed, testcaseReport.failed, testcaseReport.errors, testcaseReport.skipped));

            // add the testcase to testrail if it doesn't already exist
            var newCase = {
                title: testcaseInfo.title.trim(),
                custom_description: testcaseInfo.description || '',
                reference: testcaseInfo.reference || '',
                type_id: 2,      // Automated
                priority_id: testcaseInfo.priority || 7,  // Important
            }
            return tr.getOrCreateCase(trProject, trSuite, trSection, newCase).then(function (trCase) {
                // create a record to hold this testcase run result
                var newResult = {
                    case_id: trCase.id,
                    elapsed: !!testcaseReport.time ? Math.ceil(testcaseReport.time).toString() + 's' : '',
                    comment: util.format('Steps passed(%d), failed(%d), errors(%d), skipped(%d)',
                        testcaseReport.passed, testcaseReport.failed, testcaseReport.errors, testcaseReport.skipped),
                    custom_step_results: []
                };
                if (!!firmwareVersion) newResult['version'] = firmwareVersion;

                if (testcaseReport.failed > 0 || testcaseReport.errors > 0) {
                    newResult['status_id'] = tr.TC_STATUS.FAILED;
                } else if (testcaseReport.skipped > 0) {
                    newResult['status_id'] = tr.TC_STATUS.SKIPPED;
                } else {
                    newResult['status_id'] = tr.TC_STATUS.PASSED;
                }
                // save the details of each assert
                _.forEach(testcaseReport.assertions, function (assertionReport) {
                    var stepResult = {
                        content: assertionReport.message,
                        status_id: assertionReport.failure == false ? tr.TC_STATUS.PASSED : tr.TC_STATUS.FAILED,
                    }
                    if (assertionReport.failure != false) {
                        stepResult['expected'] = assertionReport.failure;
                        stepResult['actual'] = assertionReport.stacktrace;
                    }
                    newResult.custom_step_results.push(stepResult);
                });
                // add the result record to the list of other results for this suite
                newResult['custom_remarks'] = JSON.stringify(newResult.custom_step_results, null, 2);
                delete newResult.custom_step_results;
                return _.concat(suiteResults, newResult);
            });
        });
    });
    return result;
};

/**
 * Scan the provided nightwatch module reports and upload pertenent data to test rail.
 * Specifically:
 *   - ensure the appropriate section/subsections exist to represent the nightwatch module path
 *   - calls the recordNightwatchSuites function to record additional information about the testcases in the module
 *   - aggregate and return the testcase results to the caller as a promise
 */
var recordNightwatchModules = function (tr, trProject, trSuite, trMilestone, moduleReports) {
    var result = Q([]);
    _.forOwn(moduleReports, function (moduleReport, moduleName) {
        result = result.then(function (prevResults) {
            console.log(util.format('  processing testcases in suite "%s"', moduleName));
            var sectionName = moduleName;
            return tr.getOrCreateSection(trProject, trSuite, sectionName).then(function (trSection) {
                return recordNightwatchSuites(tr, trProject, trSuite, trSection, trMilestone, moduleReport);
            }).then(function (additionalResults) {
                return _.concat(prevResults, additionalResults);
            });
        });
    });
    return result;
};

/**
 * Scan the provided nightwatch run report and upload pertenent data to test rail.
 * Specifically:
 *   - ensure the provided project, milestone, and suite constructs exist in testrail
 *   - call recordNightwatchModules function to create additional test rail constructs for sections & testcases
 *   - transform and record run results as needed
 */
var recordNightwatchReport = function (tr, projectName, milestoneName, suiteName, globalReport) {
    // Create the project as needed
    console.log('testrail project: ' + projectName);
    var project = {
        name: projectName.trim()
    };
    return tr.getOrCreateProject(project).then(function (trProject) {
        //Create the milestone if specified
        var milestonePromise = Q(null);
        if (!!milestoneName && milestoneName.length > 0) {
            var milestone = {
                name: milestoneName.trim()
            };
            milestonePromise = tr.getOrCreateMilestone(trProject, milestone);
        }
        return milestonePromise.then(function (trMilestone) {
            console.log('testrail milestone: ', !!trMilestone ? trMilestone.name : 'N/A');
            // Create the suite as needed
            var suite = {
                name: suiteName.trim(),
                description: suiteDescription
            };
            return tr.getOrCreateSuite(trProject, suite).then(function (trSuite) {
                // Create the sections and testcase constructs while gathering up the run results
                console.log('testrail suite: ' + trSuite.name);
                debug(util.format('Global summary: %d of %d passed, %d skipped',
                    globalReport.passed, globalReport.tests, globalReport.skipped))
                return recordNightwatchModules(tr, trProject, trSuite, trMilestone, globalReport.modules).then(function (nightwatchTestResults) {
                    // Create a run and add the results to it
                    // console.log('####Record TestResults: ', JSON.stringify(nightwatchTestResults, null, 2));
                    var run = {
                        name: util.format('%s - %s', !!trMilestone ? trMilestone.name : '', trSuite.name),
                        description: 'latest run on branch',
                        suite_id: trSuite.id
                    };
                    if (!!trMilestone) {
                        run['milestone_id'] = trMilestone.id;
                    }
                    return tr.getOrCreateRun(trProject, trSuite, run).then(function (trRun) {
                        return tr.transformResults(trRun, nightwatchTestResults).then(function (transformedResults) {
                            debug(' save xformed results in new run', trRun, transformedResults);
                            console.log(util.format('saving results: %d of %d results changed from previous run',
                                transformedResults.length, nightwatchTestResults.length));
                            if (transformedResults.length > 0) {
                                return tr.addResults(trRun, transformedResults)
                            } else {
                                return transformedResults;
                            }
                        });
                    });
                });
            });
        });
    });
};

/**
 * Main for the uploader program
 */
var tr = new TR('testrail.digi.com', username, password);
var reportPath = 'reports';
var reportName = path.join(process.cwd(), 'tests', 'nightwatch', 'reports', 'results.json');
console.log('reading test results from ', reportName);
var reportData = JSON.parse(fs.readFileSync(reportName));
recordNightwatchReport(tr, projectName, milestoneName, suiteName, reportData).then(function (results) {
        console.log('upload complete');
    })
    .done();
