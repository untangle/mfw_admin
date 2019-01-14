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
        var hash = window.location.hash,
            vm = Mfw.app.viewport.getViewModel();
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
            vm.set('account', Mfw.app.getAccount());
            action.resume();
        }
    },

    checkStatus: function () {
        Ext.Ajax.request({
            url: '/account/status',
            success: function (response1) {
                if (Mfw.app._app !== 'setup') {
                    Ext.Ajax.request({
                        url: '/api/settings/system/setupWizard',
                        success: function(response2) {
                            var obj = Ext.decode(response2.responseText);
                            if (!obj.completed) {
                                window.location.href = '/setup';
                                return;
                            } else {
                                Mfw.app.setAccount(Ext.decode(response1.responseText));
                                Mfw.app.setViews();
                                Ext.route.Router.resume();
                            }
                        },
                        failure: function(response) {
                            console.log('server-side failure with status code ' + response.status);
                            Ext.route.Router.resume();
                            Mfw.app.redirectTo('auth');
                        }
                    });
                } else {
                    Mfw.app.setViews();
                    Ext.route.Router.resume();
                }
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

    init: function (app) {
        Ext.route.Router.suspend();
        app.checkStatus();
    },

    onUnmatchedRoute: function (hash) {
        Mfw.app.redirectTo('#');
    }
});
