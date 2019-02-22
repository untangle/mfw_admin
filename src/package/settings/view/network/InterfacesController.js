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
        var me = this,
            intf = info.record;

        if (intf.get('type') === 'OPENVPN') {
            me.intfDialog = Ext.Viewport.add({
                xtype: 'openvpn-interface-dialog',
                ownerCmp: me.getView(),
                interface: intf
            });
        } else {
            me.intfDialog = Ext.Viewport.add({
                xtype: 'generic-interface-dialog',
                ownerCmp: me.getView(),
                interface: intf
            });
        }
        me.intfDialog.on('destroy', function () {
            me.onLoad();
            me.intfDialog = null;
        });
        me.intfDialog.show();
    }
});
