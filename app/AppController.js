Ext.define('Mfw.controller.MfwController', {
    extend: 'Ext.app.Controller',
    namespace: 'Mfw',
    // stores: [
    //     'Interfaces'
    // ],
    config: {
        refs: {
            // mainView: 'mfw-main',
            // dashboardView: '#dashboard',
            // appsView: '#apps',
            // reportsView: '#reports',
            // configView: '#config',
        },

        routes: {
            // '*': 'onRoute',
            '': { action: 'onHome', conditions: { ':query' : '(.*)' } },
            'dashboard:query': { action: 'onDashboard', conditions: { ':query' : '(.*)' } },
            'reports:query': { action: 'onReports', conditions: { ':query' : '(.*)' } },
            'settings:p1': { action: 'onSettings', conditions: { ':p1' : '(.*)' } },
            '404': { action: 'onUnmatchedRoute' }
        },
    },

    // onRoute: function (params) {
    //     console.log(params);
    //     // var loadingCard = Mfw.app.getMainView().down('#loadingCard');
    //     // if (loadingCard) {
    //     //     Mfw.app.getMainView().remove(loadingCard, true);
    //     // }

    // },

    onHome: function () {
        Mfw.app.redirectTo('dashboard');
    },

    onDashboard: function (query) {
        Ext.Viewport.getViewModel().set({
            currentView: 'mfw-dashboard',
            currentViewTitle: 'Dashboard'.t()
        });
        Mfw.app.updateQuery(query);
    },

    onReports: function (query) {
        Ext.Viewport.getViewModel().set({
            currentView: 'mfw-reports',
            currentViewTitle: 'Reports'.t()
        });
        Mfw.app.updateQuery(query);
    },

    onSettings: function (route) {
        var mainSettingsView = Ext.Viewport.down('mfw-settings'), xtype;
        Ext.Viewport.getViewModel().set({
            currentView: 'mfw-settings',
            currentViewTitle: 'Settings'.t()
        });
        if (mainSettingsView.down('#currentSettings')) {
            mainSettingsView.remove('currentSettings');
        }

        if (route) {
            xtype = 'mfw-settings' + route.replace(/\//g, '-');

            if (Ext.ClassManager.getByAlias('widget.' + xtype)) {
                Ext.Viewport.down('mfw-settings').add({
                    xtype: xtype,
                    itemId: 'currentSettings'
                });
            } else {
                // console.log('not exists');
            }
        }

        // console.log(route);
        var tree = mainSettingsView.down('treelist');
        var node = tree.getStore().findNode('href', 'settings' + route);
        tree.setSelection(node);
        // console.log(tree.getStore());
        // console.log(node);

    },

    onUnmatchedRoute: function () {
        Ext.Viewport.getViewModel().set({
            currentView: 'mfw-404',
            currentViewTitle: ''
        });
    }
});
