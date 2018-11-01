Ext.define('Mfw.settings.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.settings',

    onInitialize: function (view) {
        // Ext.create('Mfw.settings.Nav',{
        //     autoLoad: true
        // });
        Mfw.app.setRoutes({
            'settings:p1': { action: 'onSettings', conditions: { ':p1' : '(.*)' } }
        });


        Mfw.app.onSettings = function (route) {
            var cmp = view.down('#currentSettings'), xtype;
            if (cmp) { cmp.destroy(); }

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
        };

    },

    onSelectionChange: function (el, record) {
        var me = this, view = me.getView();

        if (!record || !record.get('href')) { return; }

        if (view.getType() === 'api') {
            Mfw.app.redirectTo(record.get('href'));
        }

    }

});
