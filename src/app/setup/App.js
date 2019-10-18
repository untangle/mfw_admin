Ext.define('Mfw.Setup', {
    extend: 'Ext.app.Application',
    namespace: 'Mfw',

    // mainView: 'Mfw.setup.Wizard',

    checkStatus: function () {
        Ext.Ajax.request({
            url: '/account/status',
            success: function (response) {
                if (response.responseText === 'null') {
                    console.error('Unable to get account status!');
                    return;
                }

                var resp = Ext.decode(response.responseText);

                if (resp.error) {
                    Mfw.app.viewport.add({
                        xtype: 'auth',
                        redirectTo: window.location.href // initial redirectTo
                    });
                    Ext.route.Router.resume();
                    Mfw.app.redirectTo('auth');
                } else {
                    Mfw.app.viewport.add([
                        { xtype: 'setup-wizard' }
                    ]);
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

    launch: function() {
        Ext.route.Router.suspend();
        Mfw.app.checkStatus();
        Sync.init();
    }
});
