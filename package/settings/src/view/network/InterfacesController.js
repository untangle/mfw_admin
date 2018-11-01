Ext.define('Mfw.settings.network.InterfacesController', {
    extend: 'Mfw.cmp.grid.MasterGridController',
    alias: 'controller.mfw-settings-network-interfaces',

    // onEditRecord: function (cmp, info) {
    //     console.log(cmp.getRecord());
    //     var me = this;
    //     if (!me.dialog) {
    //         me.dialog = Ext.Viewport.add({
    //             xtype: 'interface-dialog',
    //             // ownerCmp: grid
    //         });
    //     }
    //     // info.record.getValidation()

    //     me.dialog.getViewModel().set('rec', cmp.getRecord());
    //     me.dialog.show();
    // },

    // onSave: function () {
    //     var me = this,
    //         data = Ext.Array.pluck(me.getView().getStore().getRange(), 'data');

    //     // var original = [{"configType":"ADDRESSED","device":"eth0","dhcpEnabled":true,"dhcpLeaseDuration":3600,"dhcpRangeEnd":"192.168.1.200","dhcpRangeStart":"192.168.1.100","interfaceId":1,"name":"internal","type":"NIC","v4ConfigType":"STATIC","v4StaticAddress":"192.168.1.1","v4StaticPrefix":24,"v6AssignHint":"1234","v6AssignPrefix":64,"v6ConfigType":"ASSIGN","wan":false},{"configType":"ADDRESSED","device":"eth1","interfaceId":2,"name":"external","natEgress":true,"type":"NIC","v4ConfigType":"DHCP","v6ConfigType":"DISABLED","wan":true}];
    //     // use a simple AJAX post to push all the grid data for now
    //     me.getView().mask();
    //     Ext.Ajax.request({
    //         url: window.location.origin + '/settings/set_settings/network/interfaces',
    //         method: 'POST',
    //         params: Ext.JSON.encode(data),
    //         success: function(response, opts) {
    //             var obj = Ext.decode(response.responseText);
    //             me.getView().unmask();
    //             Ext.toast('Settings saved!');
    //             console.dir(obj);
    //         },

    //         failure: function(response, opts) {
    //             me.getView().mask();
    //             Ext.toast('Error while saving settings!');
    //             console.log('server-side failure with status code ' + response.status);
    //         }
    //     });

    //     // this will be used when full REST features will be supported
    //     // me.getView().getStore().sync();
    // },

    onAdd: function () {
        var me = this, store = me.getView().getStore();
        var rec = Ext.create('Mfw.model.Interface', {
            name: 'new interface',
            // interfaceId: 0
        });
        store.add(rec);
    }
});
