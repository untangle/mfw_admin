Ext.define('Mfw.view.settings.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.settings',

    filterSettings: function (field, value) {
        var me = this, tree = me.getView().up('panel').down('treelist');
        if (!value) {
            tree.getStore().clearFilter();

            tree.getStore().each(function (node) {
                if (!node.isLeaf()) {
                    node.collapse();
                }
            }, this, { filtered: true, collapsed: true });

            var node = tree.getStore().findNode('href', window.location.hash);
            Ext.defer(function () {
                tree.setSelection(node);
            }, 2000);

            tree.setSingleExpand(true);
            // tree.collapseAll();
            // field.getTrigger('clear').hide();
            return;
        }

        tree.setSingleExpand(false);

        tree.getStore().each(function (node) {
            if (!node.isLeaf()) {
                node.expand();
            }
        }, this, { filtered: true, collapsed: true });

        tree.getStore().getFilters().replaceAll({
            property: 'text',
            value: new RegExp(Ext.String.escape(value), 'i')
        });
        // tree.expandAll();
        // field.getTrigger('clear').show();
    },

    // onSelect: function (el, sel) {
    //     // console.log(selected);
    //     sel.selected = true;
    // },


    // onLoadConfig: function (configName, configTab) {
    //     var view = this.getView();
    //     if (!configName) {
    //         view.setActiveItem(1);
    //         return;
    //     }

    //     if (view.down('#configCard')) {
    //         view.down('#configCard').destroy();
    //     }

    //     var cfgName = configName.charAt(0).toUpperCase() + configName.slice(1).toLowerCase();

    //     console.log(cfgName);

    //     view.down('#subNav').getStore().each(function (item) {
    //         if (item.get('url') === configName) {
    //             item.set('selected', 'x-item-selected');
    //         } else {
    //             item.set('selected', '');
    //         }
    //     });


    //     view.setLoading('Loading ' + cfgName.t() + '...');
    //     console.log(cfgName);
    //     Ext.require('Ung.view.config.' + cfgName.toLowerCase() + '.' + cfgName, function () {
    //         view.down('#configWrapper').add({
    //             xtype: 'ung.config.' + cfgName.toLowerCase(),
    //             region: 'center',
    //             itemId: 'configCard'
    //         });
    //         view.setLoading(false);
    //         view.setActiveItem(2);
    //         console.log(configTab);
    //         if (configTab) {
    //             view.down('#configCard').setActiveItem(configTab);
    //         }
    //         // view.getViewModel().set('currentView', cfgName.toLowerCase());
    //         // console.log(view.down('#subNav'));
    //     });
    // },

    onDeactivate: function (view) {
        var list = view.down('treelist'),
            store = list.getStore();

        store.each(function (node) {
            if (!node.isLeaf()) {
                list.getItem(node).collapse();
            }
        });
        list.setSelection(null);
    }


});
