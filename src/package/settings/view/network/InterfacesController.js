Ext.define('Mfw.settings.network.InterfacesController', {
    extend: 'Mfw.cmp.grid.MasterGridController',
    alias: 'controller.mfw-settings-network-interfaces',

    onAddRecord: function () {
        var me = this;

        me.intfDialog = Ext.Viewport.add({
            xtype: 'interface-dialog',
            ownerCmp: me.getView()
        });

        me.intfDialog.on('destroy', function () {
            me.onLoad();
            me.intfDialog = null;
        });
        me.intfDialog.show();
    },

    onEditRecord: function (grid, info) {
        var me = this,
            intf = info.record;

        me.intfDialog = Ext.Viewport.add({
            xtype: 'interface-dialog',
            ownerCmp: me.getView(),
            interface: intf
        });

        me.intfDialog.on('destroy', function () {
            me.onLoad();
            me.intfDialog = null;
        });
        me.intfDialog.show();
    },

    onDeleteRecord: function (grid, info) {
        var me = this;
        Ext.Msg.confirm('<i class="x-fa fa-exclamation-triangle"></i> Warning',
            'Delete <strong>' + info.record.get('name') + '</strong> interface?',
            function (answer) {
                if (answer === 'yes') {
                    info.record.drop();
                    me.onSave(); // defind in MasterGrid
                }
            });
    },

    configTypeRenderer: function (value, record) {
        if (value === 'ADDRESSED') {
            return 'Addressed';
        }
        if (value === 'BRIDGED') {
            var bridged = Ext.getStore('interfaces').findRecord('interfaceId', record.get('bridgedTo'));
            return 'Bridged to <strong>' + (bridged ? bridged.get('name') : 'undefined') + '</strong>';
        }
    }
});
