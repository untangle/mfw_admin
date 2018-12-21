Ext.define('Mfw.AppBase', {
    extend: 'Ext.app.Application',
    name: 'Mfw',

    config: {
        account: null,
        routeAfterAuth: null
    },


    viewport: {
        viewModel: {}
    },

    listen : {
        global : {
            unmatchedroute : 'onUnmatchedRoute'
        }
    },

    checkAuth: function (action) {
        var hash = window.location.hash;
        if (hash === '') {
            Mfw.app.redirectTo('dashboard');
            action.stop();
        }
        // console.log(action, hash);
        if (!Mfw.app.getAccount()) {
            if (hash !== '#auth') {
                Mfw.app.setRouteAfterAuth(hash);
            }
            Mfw.app.redirectTo('auth');
        } else {
            action.resume();
        }
    },

    init: function (app) {
        var scripts = [];
        Ext.route.Router.suspend();

        Ext.Ajax.request({
            url: '/account/status',
            success: function (response) {
                Mfw.app.setAccount(Ext.decode(response.responseText));
                app.setViews();
                Ext.route.Router.resume();
            },

            failure: function() {
                Mfw.app.viewport.add({
                    xtype: 'auth'
                });
                Ext.route.Router.resume();
                Mfw.app.redirectTo('auth');
            }
        });

    },

    onUnmatchedRoute: function (hash) {
        Mfw.app.redirectTo('#');
    }
});
