Package.describe({
    name: 'digi:urma-core',
    version: '1.0.0',
    // Brief, one-line summary of the package.
    summary: 'Digi Unified Remote Manager Application core framework',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.use('mongo', ['client', 'server']);
    api.use('es5-shim');
    api.use('ecmascript');
    api.use('fourseven:scss@3.8.0_1');
    api.use('accounts-password');
    api.use('wolves:bourbon@3.1.0');
    api.use('wolves:bitters@3.1.0');
    api.use('wolves:neat@3.1.0');
    api.use('digi:urma-styles@1.0.0');
    api.use('meteorhacks:subs-manager@1.6.3');
    api.use('chrismbeckett:toastr@2.1.2_1');
    api.use('react-meteor-data');
    api.use('matb33:collection-hooks');
    api.mainModule('urma-core.js', 'client');
    api.mainModule('urma-core-server.js', 'server');
    api.addFiles([
            'navigation/styles/_main-menu-layout.scss',
            'navigation/styles/_main-menu.scss',
            'security/styles/_security.scss',
            'file-system/styles/_file-system.scss',
            'styles.scss'
        ],
        'client');
});


Package.onTest(function (api) {
    api.use('jag:pince');
    api.use('ecmascript');
    api.use('practicalmeteor:mocha');
    api.use('accounts-password@1.2.12');
    api.use('chrismbeckett:toastr');
    api.use('digi:urma-core');
    api.mainModule('urma-core-tests.js', 'client');
});
