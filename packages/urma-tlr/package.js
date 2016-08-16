Package.describe({
    name: 'digi:urma-tlr',
    version: '1.0.0',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.use('mongo', ['client', 'server']);
    api.use('jag:pince');
    api.use('modules');
    api.use('http');
    api.use('es5-shim');
    api.use('ecmascript');
    api.use('react-meteor-data');
    api.use('digi:urma-core@1.0.0');
    api.use('digi:urma-styles@1.0.0');
    api.mainModule('urma-tlr.js', 'client');
    api.mainModule('urma-tlr-server.js', 'server');
    api.addFiles('styles.scss', 'client');
    api.use('3stack:country-codes-tz', 'client');
});

Package.onTest(function (api) {
    api.use('jag:pince');
    api.use('ecmascript');
    api.use('tracker');
    api.imply('tracker'); // workaround for react-komposer until meteor 1.4
    api.use('practicalmeteor:mocha');
    api.use('react-meteor-data');
    api.use('accounts-password@1.2.12');
    api.use('erasaur:meteor-lodash');
    api.use('digi:urma-tlr');
    api.mainModule('urma-tlr-tests.js', 'client');
    api.use('3stack:country-codes-tz', 'client');
});
