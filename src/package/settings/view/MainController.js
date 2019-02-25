Ext.define('Mfw.settings.view.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.settings',

    routes: {
        'settings:query': {
            action: 'onAction',
            conditions: { ':query' : '(.*)' }
        }
    },

    onAction: function (route) {
        var me = this, view = me.getView(), xtype,
            cmp = view.down('#currentSettings'),
            tree = view.down('treelist'),
            node = tree.getStore().findNode('href', 'settings' + route);

        Mfw.app.viewport.setActiveItem('settings');

        if (cmp) { cmp.destroy(); }

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
    },

    onDeactivate: function (view) {
        var list = view.down('treelist'),
            store = list.getStore();

        store.each(function (node) {
            if (!node.isLeaf()) {
                list.getItem(node).collapse();
            }
        });
        list.setSelection(null);
    },

    onSelectionChange: function (el, record) {
        var me = this, view = me.getView();

        if (!record || !record.get('href')) { return; }

        // if (view.getType() === 'api') {
        Mfw.app.redirectTo(record.get('href'));
        // }

    },

    filterSettings: function (field, value) {
        var me = this,
            tree = me.getView().down('treelist'),
            store = tree.getStore(),
            root = store.getRoot();
            // expandedNode = null;

        store.clearFilter();

        if (value) {
            // find expanded node if exists
            // root.eachChild(function (child) {
            //     if (child.isExpanded()) {
            //         expandedNode = child;
            //     }
            // });

            tree.setSingleExpand(false);
            root.expandChildren(true);
            store.filterBy(function (node) {
                var v = new RegExp(value, 'i');
                return node.isLeaf() ? v.test(node.get('text')) : false;
            });
        } else {
            tree.setSingleExpand(true);
            root.collapseChildren(true);
        }
    },

});
