Ext.define('Mfw.settings.network.interface.Ipv6Aliases', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.interface-ipv6-aliases',
    itemId: 'ipv6-aliases',

    headerTitle: 'IPv6 Aliases'.t(),

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
            { v6Address: '12345', v6Prefix: '10' }
        ]
    },

    columns: [{
        text: 'Address'.t(),
        dataIndex: 'v6Address',
        editable: true
    }, {
        text: 'Netmask/Prefix'.t(),
        dataIndex: 'v6Prefix',
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
