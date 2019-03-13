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
                xtype: 'interface-dialog',
                ownerCmp: me.getView(),
                interface: intf
            });
        }
        me.intfDialog.on('destroy', function () {
            me.onLoad();
            me.intfDialog = null;
        });
        me.intfDialog.show();
    },

    configTypeRenderer: function (value, record) {
        if (value === 'ADDRESSED') {
            return 'Addressed';
        }
        if (value === 'DISABLED') {
            return 'Disabled';
        }
        if (value === 'BRIDGED') {
            var bridged = Ext.getStore('interfaces').findRecord('interfaceId', record.get('bridgedTo'));
            return 'Bridged to <strong>' + (bridged ? bridged.get('name') : 'undefined') + '</strong>';
        }
    }
});
