Ext.define('Mfw.settings.network.InterfacesController', {
    extend: 'Mfw.cmp.grid.MasterGridController',
    alias: 'controller.mfw-settings-network-interfaces',

    onAddRecord: function () {
        var me = this;

        me.intfDialog = Ext.Viewport.add({
            xtype: 'openvpn-interface-dialog',
            ownerCmp: me.getView()
        });
        me.intfDialog.on('destroy', function () {
            me.onLoad();
            me.intfDialog = null;
        });
        me.intfDialog.show();
    },

    onEditRecord: function (grid, info) {
        var me = this;

        me.intfDialog = Ext.Viewport.add({
            xtype: 'openvpn-interface-dialog',
            ownerCmp: me.getView(),
            interface: info.record
        });
        me.intfDialog.on('destroy', function () {
            me.onLoad();
            me.intfDialog = null;
        });
        me.intfDialog.show();
    },

    onAddRecordAll: function () {
        var me = this;
        if (!me.intfDialog) {
            me.intfDialog = Ext.Viewport.add({
                xtype: 'interface-dialog-all',
                ownerCmp: me.getView()
            });
            me.intfDialog.on('destroy', function () {
                me.onLoad();
                me.intfDialog = null;
            });
        }
        me.intfDialog.show();
    }
});
