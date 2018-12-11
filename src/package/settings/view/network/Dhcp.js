Ext.define('Mfw.settings.network.Dhcp', {
    // extend: 'Ext.Panel',
    extend: 'Mfw.cmp.panel.MasterPanel',
    alias: 'widget.mfw-settings-network-dhcp',

    title: 'DHCP'.t(),

    layout: 'vbox',

    config: {
        recordModel: new Mfw.model.Dhcp()
    },

    items: [{
        xtype: 'togglefield',
        margin: 16,
        boxLabel: 'DHCP Authoritative'.t(),
        bind: '{rec.dhcpAuthoritative}'
    }, {
        xtype: 'mastergrid',
        controller: 'dhcpstaticentries',
        title: 'Static Entries',

        plugins: {
            gridcellediting: {
                triggerEvent: 'tap'
            }
        },

        enableSave: false,
        enableReload: true,
        enableReset: false,
        // enableCopy: false,

        flex: 1,

        bind: '{rec.staticDhcpEntries}',

        columns: [{
            text: 'Description'.t(),
            dataIndex: 'description',
            flex: 1,
            editable: true
        }, {
            text: 'Mac Address'.t(),
            dataIndex: 'macAddress',
            width: 250,
            editable: true
        } , {
            text: 'Address'.t(),
            dataIndex: 'address',
            width: 250,
            editable: true
        }]
    }]
});


Ext.define('Mfw.settings.network.DhcpEntriesController', {
    extend: 'Mfw.cmp.grid.MasterGridController',
    alias: 'controller.dhcpstaticentries',


    onAddRecord: function () {
        var me = this;

        var rec = Ext.create('Mfw.model.DhcpStaticEntry', {
            address: '1.2.3.4',
            macAddress: 'somestring'
        });
        me.getView().getStore().add(rec);
    }

});

