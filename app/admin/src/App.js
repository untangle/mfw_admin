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
        '*': { before: 'onBeforeAnyRoute' },
        'dashboard:query': { before: 'onDashboardBefore', action: 'onDashboard', conditions: { ':query' : '(.*)' } },
        'settings:p1': { action: 'onSettings', conditions: { ':p1' : '(.*)' } }
    },

    viewport: {
        viewModel: {},
        layout: 'card'
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
            { xtype: 'mfw-header' },
            { xtype: 'mfw-dashboard' },
            { xtype: 'mfw-pkg-settings' }
        ]);
    },


    /**
     * Updates route based on existance or not of predefined conditions in ViewModel
     * arguments of the method are ([query], action) with query missing if not set
     */
    onDashboardBefore: function (action) {
        // var me = this, conds, action,
        //     vm = me.getDashboardView().getViewModel();

        // if (arguments.length === 1) {
        //     action = arguments[0];
        // } else {
        //     conds = arguments[0].replace('?', '');
        //     action = arguments[1];
        // }


        // if (!conds) {
        //     // if no condition parameters, load those condition params from view model and redirect
        //     Mfw.app.redirectTo('dashboard?' + Util.modelToParams('dashboard', vm.get('conditions')));
        //     action.stop();
        // } else {
        //     // otherwise update View Model with the new condition params
        //     vm.set('conditions', Util.paramsToModel('dashboard', conds));
        //     action.resume();
        // }
        action.resume();
    },

    onDashboard: function () {
        Mfw.app.viewport.setActiveItem('mfw-dashboard');
    },

    onSettings: function (route) {
        console.log('on settings ...');
        var view = Mfw.app.viewport.down('mfw-pkg-settings'),
            cmp = view.down('#currentSettings'), xtype;
        if (cmp) { cmp.destroy(); }

        Mfw.app.viewport.setActiveItem('mfw-pkg-settings');

        if (route) {
            xtype = 'mfw-settings' + route.replace(/\//g, '-');

            console.log(xtype);

            if (Ext.ClassManager.getByAlias('widget.' + xtype)) {
                view.add({
                    xtype: xtype,
                    itemId: 'currentSettings'
                });
            } else {
                console.log('view does not exists');
            }
        }



        // console.log(route);
        // var tree = mainSettingsView.down('treelist');
        // var node = tree.getStore().findNode('href', 'settings' + route);
        // tree.setSelection(node);
        // console.log(tree.getStore());
        // console.log(node);
    },

    launch: function () {
        console.log('Admin App Launch ...')
        var me = this, scripts = [];
        Ext.Array.each(me.packages, function(pkg) {
            scripts.push('mfw/pkg/mfw-pkg-' + pkg + '.js')
        });

        Ext.Loader.loadScriptsSync(scripts);

        // need this trick to trigger beforeAnyRoute in case of empty hash
        if (!window.location.hash) {
            Ext.defer(function () {
                Mfw.app.redirectTo('#dashboard');
            }, 500);
        }
    }
});
