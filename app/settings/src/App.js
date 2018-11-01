Ext.define('Mfw.App', {
    extend: 'Ext.app.Application',
    name: 'Mfw',

    config: {
        account: null,
        routeAfterAuth: null
    },

    packages: ['auth', 'settings'],
    resPath: '../res',

    routes: {
        '*': { before: 'onBeforeAnyRoute' }
    },

    viewport: {
        viewModel: {}
    },

    onBeforeAnyRoute: function (action) {
        var me = this,
            hash = window.location.hash;

        if (!Mfw.app.getAccount()) {
            Ext.Ajax.request({
                url: '/account/status',
                success: function (response) {
                    Mfw.app.setAccount(Ext.decode(response.responseText));
                    me.setViews();
                    action.resume();
                },

                failure: function() {
                    Mfw.app.viewport.removeAll(true, true);
                    Mfw.app.viewport.add({
                        xtype: 'mfw-pkg-auth'
                    });
                    Mfw.app.redirectTo('login');
                    Mfw.app.setRouteAfterAuth(hash);
                }
            });
        } else {
            action.resume();
        }
    },

    setViews: function () {
        Mfw.app.viewport.removeAll(true, true);
        Mfw.app.viewport.add([
            { xtype: 'mfw-pkg-settings' }
        ]);
    },

    launch: function () {
        console.log('Settings App Launch ...')
        var me = this, scripts = [];
        Ext.Array.each(me.packages, function(pkg) {
            scripts.push('../mfw/pkg/mfw-pkg-' + pkg + '.js')
        });

        Ext.Loader.loadScriptsSync(scripts);

        // need this trick to trigger beforeAnyRoute in case of empty hash
        if (!window.location.hash) {
            Ext.defer(function () {
                Mfw.app.redirectTo('#settings');
            }, 500);
        }
    }
});
