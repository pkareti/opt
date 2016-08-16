'use strict';
var assert = require('assert');
var Q = require('q');
var TR = require('./tr');
var tr = new TR('testrail.digi.com', 'jeffry', 'Digimon6')

var projectName = 'Test Project';
var project = {
    name: 'Test Project',
    announcement: 'Test all the things!',
    show_announcement: true,
    suite_mode: 3
};
var suite = {
    name: 'Mathematics',
    description: 'An experimental test suite'
};
var sectionPath = 'Patterns/Fractals';
var section = {
    name: 'Patterns/Fractals',
    description: 'section devoted to fractals'
};
var cases = [{
    title: 'mandelbrot tests',
    description: 'tests the mandelbrot set of fractals',
    type_id: 2,
    priority_id: 7
}, {
    title: 'Sierpinski tests',
    description: 'tests the Sierpin fractals',
    type_id: 2,
    priority_id: 7
}];
var run = {
    name: 'develop',
    description: 'latest run on develop branch',
    type_id: 2,
    priority_id: 7
};
var runResult = {
    status_id: 1
}


//
// Complete Test
//


// // delete the existing suite to reset the test
// tr.deleteSuite(projectName, suite.name)
//   .then(function() {
//     // ignore the delete result...
//   })
//
//
//
// // Get the project
// .then(function() {
//     return tr.getProject(projectName)
//   })
//   .then(function(result) {
//     assert(result, 'got test rail result');
//     var trProject = result.project;
//     assert(trProject, 'got test rail project');
//     assert.equal(trProject.name, projectName, 'Project names match');
//     return Q(true);
//   })
//
//
// // Check for suite, add one, validate it was created
// .then(function() {
//     return tr.getSuite(projectName, suite.name)
//   })
//   .then(function(result) {
//     console.log('getSuite returned: ', result);
//     assert(result, 'got test rail result');
//     var trSuite = result.suite;
//     assert(!trSuite, 'suite should not exist yet');
//     return true;
//   })
//   .then(function() {
//     return tr.addSuite(projectName, suite)
//   })
//   .then(function(trSuite) {
//     assert(trSuite, 'got test rail suite');
//     assert.equal(trSuite.name, suite.name, 'Suite names match');
//     assert.equal(trSuite.description, suite.description, 'Suite names match');
//     return true;
//   })
//   .then(function() {
//     return tr.getSuite(projectName, suite.name)
//   })
//   .then(function(result) {
//     console.log('getSuite returned: ', result);
//     assert(result, 'got test rail result');
//     var trSuite = result.suite;
//     assert(trSuite, 'suite should now exist');
//     return true;
//   })
//
//
//
// // Check for section, add one, validate it was created
// .then(function() {
//     return tr.getSection(projectName, suite.name, section.name)
//   })
//   .then(function(result) {
//     console.log('getSection returned: ', result);
//     assert(result, 'got test rail result');
//     var trSection = result.section;
//     assert(!trSection, 'section should not exist yet');
//     return true;
//   })
//   .then(function() {
//     return tr.addSection(projectName, suite.name, section)
//   })
//   .then(function(trSection) {
//     assert(trSection, 'got test rail section');
//     assert.equal(trSection.name, section.name, 'Section names match');
//     assert.equal(trSection.description, section.description, 'Section names match');
//     return true;
//   })
//   .then(function() {
//     return tr.getSection(projectName, suite.name, section.name)
//   })
//   .then(function(result) {
//     console.log('getSection returned: ', result);
//     assert(result, 'got test rail result');
//     var trSection = result.section;
//     assert(trSection, 'section should now exist');
//     return true;
//   })
//
//
// .done();


//
// Quick update Test
//


tr.getOrCreateProject(project).then(function (trProject) {
    console.log('got project: ', JSON.stringify(trProject, null, 2));
    tr.getOrCreateSuite(trProject, suite).then(function (trSuite) {
        console.log('got suite: ', JSON.stringify(trSuite, null, 2));
        tr.getOrCreateSection(trProject, trSuite, sectionPath).then(function (trSection) {
            console.log('got section: ', JSON.stringify(trSection, null, 2));
            tr.getOrCreateCase(trProject, trSuite, trSection, cases[0]).then(function (trCase) {
                console.log('got case: ', JSON.stringify(trCase, null, 2));
                cases[0] = trCase;
            })
            tr.getOrCreateCase(trProject, trSuite, trSection, cases[1]).then(function (trCase) {
                console.log('got case: ', JSON.stringify(trCase, null, 2));
                cases[1] = trCase;
            })
        })
    })
}).then(function () {
        console.log('done');
    })
    // tr.addSuite(projectName, suite)
    // .then(function(testSuite) {
    //   return tr.addSection(projectName, suite.name, section)
    // })
    // .then(function(testSection) {
    //   return tr.addCase(projectName, suite.name, section.name, cases[0])
    // })
    // .then(function(testCase) {
    //   cases[0] = testCase;
    //   return tr.addCase(projectName, suite.name, section.name, cases[1])
    // })
    // .then(function(testCase) {
    //   cases[1] = testCase;
    //   return tr.addRun(projectName, suite.name, run)
    // })
    // .then(function(testRun) {
    //   var runResults = [{
    //     case_id: cases[0].id,
    //     status_id: 1
    //   }, {
    //     case_id: cases[1].id,
    //     status_id: 2
    //   }];
    //   return tr.addResults(testRun, runResults)
    // })
    .done();
