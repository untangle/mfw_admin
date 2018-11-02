Ext.define('Mfw.settings.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.settings',

    onInitialize: function (view) {
        console.log('Settings init ...');
        // Ext.create('Mfw.settings.Nav',{
        //     autoLoad: true
        // });

        // Ext.defer(function () {
        //     view.down('treelist').getStore().reload();
        // }, 2000);


        // console.log(view.down('treelist').getStore());

        // add routing method
        console.log(Ext.isFunction(Mfw.app.onSettings));
        if (!Ext.isFunction(Mfw.app.onSettings)) {
            // Mfw.app.onSettings = function (route) {
            //     var cmp = view.down('#currentSettings'), xtype,
            //         tree = view.down('treelist'),
            //         node = tree.getStore().findNode('href', 'settings' + route);

            //     if (cmp) { cmp.destroy(); }

            //     Mfw.app.viewport.setActiveItem('mfw-pkg-settings');

            //     if (route) {
            //         xtype = 'mfw-settings' + route.replace(/\//g, '-');

            //         if (Ext.ClassManager.getByAlias('widget.' + xtype)) {
            //             view.add({
            //                 xtype: xtype,
            //                 itemId: 'currentSettings'
            //             });
            //         } else {
            //             console.log('view does not exists');
            //         }
            //     }

            //     tree.setSelection(node);
            // };
        }

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

    }

});
