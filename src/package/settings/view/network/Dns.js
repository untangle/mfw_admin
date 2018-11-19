Ext.define('Mfw.settings.network.Dns', {

    extend: 'Mfw.cmp.panel.MasterPanel',
    alias: 'widget.mfw-settings-network-dns',

    title: 'DNS'.t(),

    config: {
        recordModel: new Mfw.model.Dns()
    },

    layout: 'hbox',

    items: [{
        xtype: 'mastergrid',
        // controller: 'dhcpstaticentries',
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

        bind: '{rec.staticEntries}',

        columns: [{
            text: 'Name'.t(),
            dataIndex: 'name',
            flex: 1,
            editable: true
        } , {
            text: 'Address'.t(),
            dataIndex: 'address',
            flex: 1,
            editable: true
        }]
    }, {
        xtype: 'mastergrid',
        // docked: 'right',
        // width: '40%',
        // resizable: {
        //     split: true,
        //     edges: 'west'
        // },

        // controller: 'dhcpstaticentries',
        title: 'Local Servers',

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

        bind: '{rec.localServers}',

        columns: [{
            text: 'Name'.t(),
            dataIndex: 'name',
            flex: 1,
            editable: true
        } , {
            text: 'Address'.t(),
            dataIndex: 'address',
            flex: 1,
            editable: true
        }]
    }]

});
