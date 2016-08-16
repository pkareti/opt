//
// Helper class for defining test elements and results in testrail
//
// See the following for more info on our use of Testrail:
// https://confluence.digi.com/display/DCS/TestRail%3A+Milestones%2C+TCM%2C+Execution%2C+and+Results
// https://confluence.digi.com/display/EDC/Dynamically+Create+TestRail+Test+Cases+Using+DynamicSAReportable+Annotation
//

'use strict';

var _ = require('lodash'); //jshint ignore:line
var Q = require('q');
var qHTTP = require('q-io/http');
var debug = require('debug')('tr');
var jmespath = require('jmespath');
var util = require('util');

// Default Testrail ws api options
var _getDefaultOptions = function (options) {
    var o = {};
    o.scheme = options.scheme || 'https';
    o.ssl = o.scheme == 'https';
    o.hostname = options.hostname;
    o.port = options.port || o.scheme === 'https' ? 443 : 80;
    o.headers = options.headers || {}
    o.headers.Accept = o.headers.Accept || 'application/json';
    return o;
};

var sep = '/';


/**
 * Construct the testrail helper.
 * @param hostname - DNS name of the Testrail server
 * @param username - testrail userid to work under
 * @param password - password for testrail userid
 *
 * @return the testrail helper object to use for subsequent TR operations
 */
var TR = function (hostname, username, password) {
    this.httpOptions = _getDefaultOptions({
        scheme: 'http',
        hostname: hostname,
        headers: {
            Authorization: 'Basic ' + (new Buffer(username + ':' + password).toString(
                'base64'))
        }
    });
    this.cache = {
        projects: {},
        suites: {},
        sections: {},
        cases: {},
        milestones: {},
        plans: {},
        runs: {},
        results: {}
    };
}

TR.prototype = _.create(Object.prototype, {
    constructor: TR,

    TC_STATUS: {
        PASSED: 1,
        BLOCKED: 2,
        UNTESTED: 3,
        RETEST: 4,
        FAILED: 5,
        PASSEDRETEST: 6,
        SKIPPED: 7
    },

    /**
     * Issue a request against the testrail server using the configured credentials
     * @param method - the type of http method to invoke (GET or POST)
     * @param path - api unique path of the web service request (ie get_projects)
     * @param body - body associated with the request (optional)
     *
     * @return the response body from the testrail server
     */
    doRequest: function (method, path, body) {
        // build the request to the specified path with the given params
        var httpOptions = this.httpOptions;
        var fullPath = util.format('/testrail/index.php?/api/v2/%s', path);
        var request = {
            method: method,
            scheme: httpOptions.scheme,
            ssl: httpOptions.ssl,
            host: httpOptions.hostname,
            port: httpOptions.port,
            path: fullPath,
            headers: {
                "Authorization": httpOptions.headers.Authorization,
                "Accept": 'application/json',
                "Content-Type": 'application/json'
            },
            body: !!body ? [JSON.stringify(body)] : undefined
        };

        // return promise to results
        // debug('sending request:  ', request);
        debug('sending ' + request.method + ' ' + request.path + ' request:  ');
        return qHTTP.request(request).then(function (res) {
            // console.log('res: ', res);
            return res.body.read().then(function (text) {
                if (res.status == 401) {
                    throw new Error('Not Authorized');
                }
                var response = text.toString();
                // debug('** ' + method + ': ' + path + ' returned ' + response);
                return response.length > 0 ? JSON.parse(response) : null;
            });
        }).fail(function (error) {
            debug('error sending request: ' + error);
            throw error;
        });
    },

    /**
     * Performa a GET operation against the testrail server
     * @param path - api unique path of the web service request (ie get_projects)
     *
     * @return the response body from the testrail server
     */
    getRequest: function (path) {
        var self = this;
        // delay all down strean processing by 10 seconds... just to identify concurrency issues
        var deferred = Q.defer();
        setTimeout(function () {
            deferred.resolve(self.doRequest('GET', path));
        }, 10);
        return deferred.promise;
        // return this.doRequest('GET', path);
    },

    /**
     * Performa a POST operation against the testrail server
     * @param path - path of the URL request (ie get_projects)
     * @param body - body associated with the request (optional)
     *
     * @return the response body from the testrail server
     */
    postRequest: function (path, body) {
        var self = this;
        var deferred = Q.defer();
        setTimeout(function () {
            deferred.resolve(self.doRequest('POST', path, body));
        }, 1000);
        return deferred.promise;
        // return this.doRequest('POST', path, body);
    },


    /**
     * Internal helper to get the requested testrail resource. It first tries to
     * fetch the item from cache if and upon cache miss then it fetches the
     * resource from the testrail server and updates the cache.
     *
     * This function is used by the specific resource helpers below. It is not to be
     * called externally.
     */
    getResource: function (resourceName, criteria, cacheName, getURL, resourceKey) {
        var self = this;
        debug(util.format('find %s where: %s ', resourceName, criteria));
        var results = jmespath.search(_.values(self.cache[cacheName]), criteria);
        if (results.length > 0) debug('found item in cache!')
        var resultsP = results.length > 0 ? Q(results) :
            // fall back to test rail
            self.getRequest(getURL).then(function (resources) {
                // debug(util.format('*got %s: ', cacheName), resources);
                _.extend(self.cache[cacheName], _.keyBy(resources, resourceKey));
                // debug('cache updated to: ', self.cache.cases);
                var results = jmespath.search(_.values(self.cache[cacheName]), criteria);
                debug(util.format('got %s from testrail: ', resourceName), results);
                return results;
            });
        // return results as a promise to null or an object
        return resultsP.then(function (results) {
            return results[0];
        });
    },
    /**
     * Internal helper to add the requested resource if it doesn't already exist
     * This function is used by the specific resource helpers below. It is not to be
     * called externally.
     */
    getOrCreateResource: function (resourceName, criteria, cacheName, getURL, resourceKey, postURL, resource) {
        var self = this;
        debug(util.format('getOrCreate %s ', resourceName));
        return self.getResource(resourceName, criteria, cacheName, getURL, resourceKey).then(function (trResouce) {
            return !!trResouce ? trResouce :
                self.postRequest(postURL, resource).then(function (trResouce) {
                    // console.log('created '+resourceName+' in testrail: ', JSON.stringify(trResouce, null, 2));
                    debug(util.format('*add %s: ', resourceName), trResouce);
                    _.extend(self.cache.cases, _.keyBy([trResouce], resourceKey));
                    return trResouce;
                });
        });
    },


    /**
     * Adds the requested TR project if it doesn't already exist
     * @param project - The TR project to add. Key fields include:
     *    name:
     *    announcement:
     *    show_announcement: (boolean)
     *    suite_mode: (3==multi-suite mode)
     *
     * @return the resulting TR testcase
     */
    getOrCreateProject: function (project) {
        var self = this;
        var resourceName = 'project';
        var criteria = util.format('[?name==`%s`]', project.name);
        var cacheName = 'projects';
        var getURL = util.format('get_projects');
        var resourceKey = 'id';
        var postURL = util.format('add_project');
        var resource = project;
        return self.getOrCreateResource(resourceName, criteria, cacheName, getURL, resourceKey, postURL, resource);
    },

    /**
     * Adds the requested TR suite if it doesn't already exist
     * @param project - The related project
     * @param suite - The TR suite to add. Key fields include:
     *    name:
     *    description:
     *
     * @return the resulting TR suite
     */
    getOrCreateSuite: function (project, suite) {
        var self = this;
        var resourceName = 'suite';
        var criteria = util.format('[?project_id==`%d` && name==`%s`]', project.id, suite.name);
        var cacheName = 'suites';
        var getURL = util.format('get_suites/%d', project.id);
        var resourceKey = 'id';
        var postURL = util.format('add_suite/%d', project.id);
        var resource = suite;
        return self.getOrCreateResource(resourceName, criteria, cacheName, getURL, resourceKey, postURL, resource);
    },

    /**
     * Adds the requested TR testcase if it doesn't already exist
     * @param project - The related project
     * @param suite - The related suite
     * @param section - The related section
     * @param testcase - The TR testcase to add. Key fields include:
     *    title:
     *    description:
     *    type_id: (2==functional)
     *    priority_id: (7==important)
     *    estimate: (0==automation)
     *    refs: (jira issue # ie 'URMA-1234')
     *
     * @return the resulting TR testcase
     */
    getOrCreateCase: function (project, suite, section, testcase) {
        var self = this;
        var resourceName = 'case';
        var criteria = util.format('[?section_id==`%d` && title==`%s`]', section.id, testcase.title);
        var cacheName = 'cases';
        var getURL = util.format('get_cases/%d&suite_id=%d&section_id=%d', project.id, suite.id,
            section.id);
        var resourceKey = 'id';
        var postURL = util.format('add_case/%d', section.id);
        var resource = testcase;
        return self.getOrCreateResource(resourceName, criteria, cacheName, getURL, resourceKey, postURL, resource);
    },

    /**
     * Adds the requested TR milestone if it doesn't already exist
     * @param project - The related project
     * @param milestone - The TR milestone to add. Key fields include:
     *    name:
     *    description:
     *    due_on: (unix long timestamp)
     *
     * @return the resulting TR testcase
     */
    getOrCreateMilestone: function (project, milestone) {
        var self = this;
        var resourceName = 'milestone';
        var criteria = util.format('[?project_id==`%d` && name==`%s`]', project.id, milestone.name);
        var cacheName = 'milestones';
        var getURL = util.format('get_milestones/%d', project.id);
        var resourceKey = 'id';
        var postURL = util.format('add_milestone/%d', project.id);
        var resource = milestone;
        return self.getOrCreateResource(resourceName, criteria, cacheName, getURL, resourceKey, postURL, resource);
    },

    /**
     * Adds the requested TR run if it doesn't already exist
     * @param project - The related project
     * @param suite - The related suite
     * @param run - The TR run to add. Key fields include:
     *    name:
     *    description:
     *
     * @return the resulting TR run
     */
    getOrCreateRun: function (project, suite, run) {
        var self = this;
        var resourceName = 'run';
        var criteria = util.format('[?suite_id==`%d` && name==`%s`]', suite.id, run.name);
        var cacheName = 'runs';
        var getURL = util.format('get_runs/%d', project.id);
        var resourceKey = 'id';
        var postURL = util.format('add_run/%d', project.id);
        var resource = run;
        return self.getOrCreateResource(resourceName, criteria, cacheName, getURL, resourceKey, postURL, resource);
    },

    /**
     * Adds the supplied array of results to the TR run.
     * @param run - The related TR run
     * @param results - an array of TR result objects. Key fields include:
     *    case_id:
     *    status_id: (1==passed, 2==Blocked, 4==retest, 5==failed, 6==pass w/retest, 7==skipped)
     *    comment:
     *    elapsed: (timespan string ie '30s')
     *    assignedto_id: (int id of a user to assign the test to)
     *
     * @return the resulting TR run
     */
    addResults: function (run, results) {
        var self = this;
        debug('addResults: ', results);
        return self.postRequest('add_results_for_cases/' + run.id, {
            results: results
        }).then(function (addResult) {
            debug('*addresults: ', addResult);
            return addResult;
        });
    },


    /**
     * Compares current run results to previous run results. Identical results will be discarded to
     * avoid duplicates in testrail. Some transitions are handled specially as defined below:
     *    FAIL->PASS  changed to PASSEDRETEST
     * @param run - the test rail run to compare the against
     * @param results - an array of the current run results
     *
     * @returns array of transform run results
     */
    transformResults: function (run, results) {
        var self = this;
        var finalResults = Q([]);
        _.forEach(results, function (currResult) {
            finalResults = finalResults.then(function (partialResults) {
                return self.getRequest(util.format('get_results_for_case/%d/%d/1', run.id, currResult.case_id)).then(function (prevResults) {
                    var prevResult = prevResults[0];
                    debug('previos: ', prevResult);
                    debug('current: ', currResult);
                    if (!prevResult) {
                        // Add new results
                        debug('new result for ', currResult.case_id);
                        partialResults.push(currResult);
                    } else if ((prevResult.status_id == currResult.status_id) ||
                        (currResult.status_id == self.TC_STATUS.PASSED && prevResult.status_id == self.TC_STATUS.PASSEDRETEST)) {
                        debug('same result for ', currResult.case_id);
                        // same result - don't record it
                    } else {
                        // record changed results
                        debug('changed result for ', currResult.case_id);
                        if (currResult.status_id == self.TC_STATUS.PASSED && prevResult.status_id == self.TC_STATUS.FAILED) {
                            // special case pass with retest
                            currResult.status_id = self.TC_STATUS.PASSEDRETEST;
                        }
                        partialResults.push(currResult);
                    }
                    return partialResults;
                })
            })
        });
        return finalResults;
    },


    /**
     * Custom helpers for section - handled differently than other resources due to the nested path name
     */
    getSection: function (project, suite, sectionPath) {
        var self = this;
        var criteria = util.format('[?suite_id==`%d` && description==`%s`]', suite.id, sectionPath);
        debug('find section where: ' + criteria);
        var results = jmespath.search(_.values(self.cache.sections), criteria);
        if (results.length > 0) debug('found section in cache!')
        var resultsP = results.length > 0 ? Q(results) :
            // fall back to test rail
            self.getRequest('get_sections/' + project.id + '&suite_id=' + suite.id).then(function (sections) {
                // debug('*gotSections: ', sections);
                _.extend(self.cache.sections, _.keyBy(sections, 'id'));
                // debug('cache updated to: ', self.cache.sections);
                var results = jmespath.search(_.values(self.cache.sections), criteria);
                debug('got sections from testrail: ', results);
                return results;
            });
        // return results as a promise to null or an object
        return resultsP.then(function (results) {
            return results[0];
        });
    },

    getOrCreateSection: function (project, suite, sectionPath) {
        debug('getOrCreateSection: ', sectionPath);
        var self = this;
        if (!sectionPath || sectionPath.length == 0) {
            return Q(null);
        }
        return self.getSection(project, suite, sectionPath).then(function (trSection) {
            // debug('got section: ', trSection);
            if (trSection) {
                return trSection;
            } else {
                var parentSectionPath = _.join(sectionPath.split(sep).slice(0, -1), sep);
                return self.getOrCreateSection(project, suite, parentSectionPath).then(function (trParentSection) {
                    var newSection = {
                        name: sectionPath.split(sep).slice(-1)[0],
                        description: sectionPath,
                        suite_id: suite.id
                    };
                    if (!!trParentSection) {
                        newSection['parent_id'] = trParentSection.id;
                    }
                    return self.postRequest('add_section/' + project.id, newSection).then(function (trSection) {
                        debug('*addSection: ', trSection);
                        _.extend(self.cache.sections, _.keyBy([trSection], 'id'));
                        return trSection;
                    });
                })
            }
        });
    },

});

module.exports = TR;
