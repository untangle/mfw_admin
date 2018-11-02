Ext.define('Mfw.AppBase', {
    extend: 'Ext.app.Application',
    name: 'Mfw',

    config: {
        packages: [],
        account: null,
        routeAfterAuth: null,
        resourcesPath: '../res',
    },


    viewport: {
        viewModel: {}
    },

    checkAuth: function (action) {
        var hash = window.location.hash;

        if (!Mfw.app.getAccount()) {
            if (hash !== '#auth') {
                Mfw.app.setRouteAfterAuth(hash);
            }
        } else {
            action.resume();
        }
    },

    onSettings: function (route) {
        var view = Mfw.app.viewport.down('mfw-pkg-settings'),
            cmp = view.down('#currentSettings'), xtype,
            tree = view.down('treelist'),
            node = tree.getStore().findNode('href', 'settings' + route);

        if (cmp) { cmp.destroy(); }

        Mfw.app.viewport.setActiveItem('mfw-pkg-settings');

        if (route) {
            xtype = 'mfw-settings' + route.replace(/\//g, '-');

            if (Ext.ClassManager.getByAlias('widget.' + xtype)) {
                view.add({
                    xtype: xtype,
                    itemId: 'currentSettings'
                });
            } else {
                console.log('view does not exists');
            }
        }
        tree.setSelection(node);
        if (!node) {
            tree.getStore().each(function (node) {
                if (!node.isLeaf()) { node.collapse(); }
            });
        } else {
            if (!node.isLeaf()) { node.expand(); }
        }
    },

    // launch: function () {
    //     var scripts = [];

    //     if (window.location.hash === '') {
    //         Ext.defer(function () {
    //             Mfw.app.redirectTo('#settings');
    //         }, 100);
    //     }
    // },

    init: function (app) {
        var scripts = [];
        Ext.route.Router.suspend();

        Ext.Array.each(Mfw.app.getPackages(), function(pkg) {
            scripts.push('/admin/mfw/pkg/mfw-pkg-' + pkg + '.js')
        });
        Ext.Loader.loadScriptsSync(scripts);

        Ext.Ajax.request({
            url: '/account/status',
            success: function (response) {
                Mfw.app.setAccount(Ext.decode(response.responseText));
                app.setViews();
                Ext.route.Router.resume();
            },

            failure: function() {
                Mfw.app.viewport.add({
                    xtype: 'mfw-pkg-auth'
                });
                Ext.route.Router.resume();
            }
        });

    }
});
