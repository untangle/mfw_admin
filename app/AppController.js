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
            'settings': { action: 'onSettings' }
        },
    },

    // onRoute: function (params) {
    //     console.log(params);
    //     // var loadingCard = Mfw.app.getMainView().down('#loadingCard');
    //     // if (loadingCard) {
    //     //     Mfw.app.getMainView().remove(loadingCard, true);
    //     // }

    // },

    /**
     * Transforms query string into parametrizied object applied in ViewModel
     * */
    processQuery: function (query) {
        var gvm = Ext.Viewport.getViewModel(),
            conditions = {
                fields: []
            },
            decodedPart, parts;

        console.log(query);
        if (!query) {
            return;
        }

        // A field conditions is represented in query string like "&filedName:operator:value:autoFormatValue&"

        Ext.Array.each(query.replace('?', '').split('&'), function (part) {
            decodedPart = decodeURIComponent(part);

            // if it's a field condition
            if (decodedPart.indexOf(':') > 0) {
                parts = decodedPart.split(':');
                conditions.fields.push({
                    column: parts[0],
                    operator: parts[1],
                    value: parts[2],
                    autoFormatValue: parseInt(parts[3], 10) === 1 ? true : false,
                });
            } else {
            // if it's normal parameter like since, until
                parts = decodedPart.split('=');
                conditions[parts[0]] = parts[1];
            }
        });

        if (gvm.get('currentView') === 'mfw-dashboard') {
            gvm.set('dashboardConditions', conditions);
        }

        if (gvm.get('currentView') === 'mfw-reports') {
            gvm.set('reportsConditions', conditions);
        }

        // Ext.getStore('dashboardfields').loadData(conditions.fields);
    },


    onHome: function () {
        Mfw.app.redirect('dashboard');
    },

    onDashboard: function (query) {
        Ext.Viewport.getViewModel().set({
            currentView: 'mfw-dashboard',
            currentViewTitle: 'Dashboard'.t()
        });
        this.processQuery(query);
    },

    onReports: function (query) {
        Ext.Viewport.getViewModel().set({
            currentView: 'mfw-reports',
            currentViewTitle: 'Reports'.t()
        });
        this.processQuery(query);
        // this.redirect(query);
    },

    onSettings: function () {
        Ext.Viewport.getViewModel().set({
            currentView: 'mfw-settings',
            currentViewTitle: 'Settings'.t()
        });
    }
});
