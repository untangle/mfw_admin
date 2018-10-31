Ext.define('Mfw.settings.network.interface.VrrpAliases', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.interface-vrrp-aliases',
    itemId: 'vrrp-aliases',

    headerTitle: 'VRRP Aliases'.t(),

    platformConfig: {
        desktop: {
            plugins: {
                gridcellediting: true
            }
        },

        '!desktop': {
            plugins: {
                grideditable: true
            }
        }
    },

    // plugins: {
    //     gridcellediting: true
    // },

    store: {
        data: [
            { v4Address: '12345', v4Prefix: '10' }
        ]
    },

    columns: [{
        text: 'Address'.t(),
        dataIndex: 'v4Address',
        editable: true
    }, {
        text: 'Netmask/Prefix'.t(),
        dataIndex: 'v4Prefix',
        editable: true,
        flex: 1
    }, {
        width: 44,
        menuDisabled: true,
        cell: {
            tools: [{
                type: 'delete',
                iconCls: 'x-fa fa-times'
            }]
        }
    }]

});
