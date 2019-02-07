Ext.define('Mfw.settings.network.interface.DhcpOptions', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.interface-dhcp-options',
    itemId: 'dhcp-options',

    headerTitle: 'DHCP Options'.t(),

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

    bind: '{record.dhcpOptions}',

    columns: [{
        xtype: 'checkcolumn',
        width: 44,
        dataIndex: 'enabled'
    }, {
        text: 'Description'.t(),
        dataIndex: 'description',
        editable: true,
        flex: 1
    }, {
        text: 'Value'.t(),
        dataIndex: 'value',
        editable: true
    }, {
        width: 44,
        menuDisabled: true,
        cell: {
            tools: [{
                type: 'delete',
                iconCls: 'x-fa fa-times',
                handler: function (grid, info) {
                    grid.getStore().remove(info.record);
                }
            }]
        }
    }]

});
