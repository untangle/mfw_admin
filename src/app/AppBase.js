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
            if (Mfw.app.context === 'admin') {
                Mfw.app.redirectTo('dashboard');
            }
            else {
                Mfw.app.redirectTo('network');
            }
            action.stop();
        }

        if (!Mfw.app.getAccount()) {
            if (hash !== '#auth') {
                // set redirectTo after login
                Mfw.app.viewport.down('auth').setRedirectTo(window.location.href);
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
                var resp = Ext.decode(response1.responseText);

                if (resp.error) {
                    Mfw.app.viewport.add({
                        xtype: 'auth',
                        redirectTo: window.location.href // initial redirectTo
                    });
                    Ext.route.Router.resume();
                    Mfw.app.redirectTo('auth');
                } else {
                    if (Mfw.app.context === 'admin' || Mfw.app.context === 'settings') {
                        // load interfaces to create names map
                        Ext.Ajax.request({
                            url: '/api/settings/network/interfaces',
                            success: function(response) {
                                var interfaces = Ext.decode(response.responseText), interfacesMap = {};
                                Ext.Array.each(interfaces, function (interface) {
                                    interfacesMap[interface.interfaceId] = interface.name;
                                });
                                Globals.interfaces = interfaces;
                                Globals.interfacesMap = interfacesMap;
                            }
                        });

                        Ext.Ajax.request({
                            url: '/api/settings/system',
                            success: function(response2) {
                                var decoded = Ext.decode(response2.responseText);

                                if (!decoded.setupWizard.completed) {
                                    window.location.href = '/setup';
                                    return;
                                } else {
                                    Mfw.app.setAccount(Ext.decode(response1.responseText));
                                    Mfw.app.setViews();
                                    Ext.route.Router.resume();
                                }

                                if (decoded.timeZone) {
                                    Mfw.app.tz = decoded.timeZone;
                                } else {
                                    Mfw.app.tz = { displayName: 'UTC', value: 'UTC' };
                                }

                                if (Mfw.app.context === 'admin') {
                                    // highcharts are used only in admin for now
                                    Highcharts.setOptions({
                                        time: {
                                            timezone: Mfw.app.tz.displayName
                                        }
                                    });
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
                }
            },

            failure: function() {
                Mfw.app.viewport.add({
                    xtype: 'auth',
                    redirectTo: window.location.href // initial redirectTo
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
