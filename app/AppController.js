Ext.define('Mfw.controller.MfwController', {
    extend: 'Ext.app.Controller',
    namespace: 'Mfw',

    refs: [
        { ref: 'dashboardView', selector: 'mfw-dashboard' },
        { ref: 'reportsView', selector: 'mfw-reports' },
        { ref: 'loginView', selector: 'mfw-login' }
    ],

    config: {
        routes: {
            '*': { before: 'onRouteBefore' },
            '': { action: 'onHome', conditions: { ':query' : '(.*)' } },
            'login': { action: 'onLogin' },
            'dashboard:query': { before: 'onDashboardBefore', action: 'onDashboard', conditions: { ':query' : '(.*)' } },
            'reports:query': { before: 'onReportsBefore', action: 'onReports', conditions: { ':query' : '(.*)' } },
            'settings:p1': { action: 'onSettings', conditions: { ':p1' : '(.*)' } },
            'monitor/:param': { action: 'onMonitor', conditions: { ':param' : '(.*)' } },
            '404': { action: 'onUnmatchedRoute' }
        },
    },

    /**
     * On before any route checks if account is set otherwise redirect to login
     */
    onRouteBefore: function (action) {
        var me = this,
            hash = window.location.hash;

        if (hash === '#login') {
            action.resume();
            return;
        }

        if (!Mfw.app.getAccount()) {
            Ext.Ajax.request({
                url: '/account/status',
                success: function (response) {
                    Mfw.app.setAccount(Ext.decode(response.responseText));
                    action.resume();
                },

                failure: function() {
                    me.getLoginView().setRedirectRoute(hash);
                    Mfw.app.redirectTo('login');
                    action.stop();
                }
            });
        } else {
            action.resume();
        }
    },

    onHome: function () {
        Mfw.app.redirectTo('dashboard');
    },

    onLogin: function () {
        Ext.Viewport.getViewModel().set({
            currentView: 'mfw-login'
        });
    },

    /**
     * Updates route based on existance or not of predefined conditions in ViewModel
     * arguments of the method are ([query], action) with query missing if not set
     */
    onDashboardBefore: function () {
        var me = this, conds, action,
            vm = me.getDashboardView().getViewModel();

        if (arguments.length === 1) {
            action = arguments[0];
        } else {
            conds = arguments[0].replace('?', '');
            action = arguments[1];
        }


        if (!conds) {
            // if no condition parameters, load those condition params from view model and redirect
            Mfw.app.redirectTo('dashboard?' + Util.modelToParams('dashboard', vm.get('conditions')));
            action.stop();
        } else {
            // otherwise update View Model with the new condition params
            vm.set('conditions', Util.paramsToModel('dashboard', conds));
            action.resume();
        }
    },

    onDashboard: function () {
        Ext.Viewport.getViewModel().set({
            currentView: 'mfw-dashboard',
            currentViewTitle: 'Dashboard'.t()
        });
    },

    /**
     * Updates route based on existance or not of predefined conditions in ViewModel
     * arguments of the method are ([query], action) with query missing if not set;
     * `route` can be seen as the path to a specific report category/name
     * A full query can look like
     * #reports/category_name/report_name?since=today&username:>%3D:test:1
     */
    onReportsBefore: function () {
        var me = this, route = '', conds, query = null, action,
            reportsVm = me.getReportsView().getViewModel();

        if (arguments.length === 1) {
            action = arguments[0];
        } else {
            query = arguments[0];
            action = arguments[1];
        }

        if (query) {
            route = query.split('?')[0];
            conds = query.split('?')[1];
        }

        if (!conds) {
            // if no condition parameters, load those condition params from view model and redirect
            Mfw.app.redirectTo('reports' + route + '?' + Util.modelToParams('reports', reportsVm.get('conditions')));
            action.stop();
        } else {
            // otherwise update View Model with the new condition params
            reportsVm.set('conditions', Util.paramsToModel('reports', conds));
            action.resume();
        }
    },

    onReports: function (query) {
        var route = query.split('?')[0],
            list = Ext.Viewport.down('mfw-reports').down('treelist'), node;

        if (!route) {
            list.getStore().getRoot().collapse(true);
            list.setSelection(null);
        } else {
            node = list.getStore().findNode('href', 'reports' + route);
            list.setSelection(node);
        }

        Ext.Viewport.getViewModel().set({
            currentView: 'mfw-reports',
            currentViewTitle: 'Reports'.t()
        });
    },

    onSettings: function (route) {
        var mainSettingsView = Ext.Viewport.down('mfw-settings'), xtype;
        Ext.Viewport.getViewModel().set({
            currentView: 'mfw-settings',
            currentViewTitle: 'Settings'.t()
        });

        var cmp = mainSettingsView.down('#currentSettings');
        if (cmp) { cmp.destroy(); }

        if (route) {
            xtype = 'mfw-settings' + route.replace(/\//g, '-');

            if (Ext.ClassManager.getByAlias('widget.' + xtype)) {
                mainSettingsView.add({
                    xtype: xtype,
                    itemId: 'currentSettings'
                });
            } else {
                console.log('view does not exists');
            }
        }

        // console.log(route);
        var tree = mainSettingsView.down('treelist');
        var node = tree.getStore().findNode('href', 'settings' + route);
        tree.setSelection(node);
        // console.log(tree.getStore());
        // console.log(node);

    },

    onMonitor: function (view) {
        console.log(view);
        if (!Ext.Array.contains(['sessions', 'hosts', 'devices', 'users'], view)) {
            Mfw.app.redirectTo('404');
            return;
        }
        if (!Ext.Viewport.down('mfw-monitor-' + view)) {
            Ext.Viewport.add([
                { xtype: 'mfw-monitor-' + view }
            ]);
        }
        Ext.Viewport.getViewModel().set({
            currentView: 'mfw-monitor-' + view,
            // currentViewTitle: 'Dashboard'.t()
        });
    },

    onUnmatchedRoute: function () {
        Ext.Viewport.getViewModel().set({
            currentView: 'mfw-404',
            currentViewTitle: ''
        });
    }
});
