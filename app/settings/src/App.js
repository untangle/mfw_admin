Ext.define('Mfw.App', {
    extend: 'Mfw.AppBase',

    config: {
        packages: ['auth', 'settings'],
        resourcesPath: '../res',
        account: null,
        routeAfterAuth: null
    },

    routes: {
        '*': { before: 'checkAuth' },
        'settings:route': { action: 'onSettings', conditions: { ':route' : '(.*)' } }
    },

    setViews: function () {
        Mfw.app.viewport.add([
            { xtype: 'mfw-nav' },
            { xtype: 'mfw-pkg-settings' }
        ]);
    }


    // routes: {
    //     // if auth package included, check auth on every route
    //     '': { action: function () { console.log('on empty route') }},
    //     '*': { before: 'checkAuth' },
    //     'settings:p1': { action: 'onSettings', conditions: { ':p1' : '(.*)' } }
    // },

    // viewport: {
    //     viewModel: {},
    //     items: [{
    //         xtype: ''
    //     }]
    // },

    // checkAuth: function (action) {
    //     var me = this,
    //         hash = window.location.hash;

    //     console.log(action.route);

    //     console.log('account', Mfw.app.getAccount());

    //     if (!Mfw.app.getAccount()) {
    //         Ext.Ajax.request({
    //             url: '/account/status',
    //             success: function (response) {
    //                 Mfw.app.setAccount(Ext.decode(response.responseText));
    //                 // document.location.reload();
    //                 console.log('success');
    //                 me.setViews();
    //                 Mfw.app.redirectTo('#settings');
    //                 action.stop();
    //             },

    //             failure: function() {
    //                 console.log('removeall1');
    //                 Mfw.app.viewport.removeAll(false, true);
    //                 Mfw.app.viewport.add({
    //                     xtype: 'mfw-pkg-auth'
    //                 });
    //                 Mfw.app.redirectTo('login');
    //                 Mfw.app.setRouteAfterAuth(hash);
    //             }
    //         });
    //     } else {
    //         action.resume();
    //     }
    // },

    // setViews: function () {
    //     console.log('set views');
    //     Mfw.app.viewport.removeAll(false, true);
    //     Mfw.app.viewport.add([
    //         { xtype: 'mfw-nav' },
    //         { xtype: 'mfw-pkg-settings' }
    //     ]);
    // },

    // launch: function () {
    //     console.log('Settings App Launch ...')
    //     var me = this, scripts = [];
    //     Ext.Array.each(me.packages, function(pkg) {
    //         scripts.push('../mfw/pkg/mfw-pkg-' + pkg + '.js')
    //     });

    //     Ext.Loader.loadScriptsSync(scripts);

    //     // need this trick to trigger beforeAnyRoute in case of empty hash
    //     if (!window.location.hash) {
    //         Mfw.app.redirectTo('#settings');
    //     }
    // }
});
