Ext.define('Mfw.App', {
    extend: 'Ext.app.Application',
    name: 'Mfw',

    // paths: {
    //     'pathhh': '../mfw/pkg/mfw-pkg-auth.js'
    // },

    config: {
        account: null,
        routeAfterAuth: null
    },

    packages: ['auth', 'settings'],
    resPath: '../res',

    routes: {
        '*': { before: 'onBeforeAnyRoute' },
        '': { before: 'onBeforeAnyRoute' }
    },

    onBeforeAnyRoute: function (action) {
        var me = this,
            hash = window.location.hash;
        console.log('before');
        // if (hash === '#login') {
        //     action.resume();
        //     return;
        // }

        if (!Mfw.app.getAccount()) {
            Ext.Ajax.request({
                url: '/account/status',
                success: function (response) {
                    Mfw.app.setAccount(Ext.decode(response.responseText));
                    Mfw.app.viewport.removeAll();
                    Mfw.app.viewport.add({
                        xtype: 'mfw-pkg-settings'
                    });
                    action.resume();
                },

                failure: function() {
                    Mfw.app.viewport.removeAll();
                    Mfw.app.viewport.add({
                        xtype: 'mfw-pkg-auth'
                    });
                    Mfw.app.redirectTo('login');
                    Mfw.app.setRouteAfterAuth(hash);
                }
            });
        } else {
            Mfw.app.viewport.removeAll();
            Mfw.app.viewport.add({
                xtype: 'mfw-pkg-settings'
            });
            action.resume();
        }
    },

    launch: function () {
        var me = this, scripts = [];
        Ext.Array.each(me.packages, function(pkg) {
            scripts.push('../mfw/pkg/mfw-pkg-' + pkg + '.js')
        });

        Ext.Loader.loadScriptsSync(scripts);

        // Ext.Viewport.add([
        //     { xtype: 'mfw-pkg-auth' },
        //     { xtype: 'mfw-pkg-settings', type: 'api' }
        // ]);
    }


});
