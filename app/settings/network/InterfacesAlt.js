Ext.define('Mfw.settings.network.InterfacesAlt', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.mfw-settings-network-interfaces-alt',

    viewTitle: 'Interfaces Alt'.t(),

    scrollable: true,
    store: 'interfaces',

    plugins: ['rowexpander'],

    itemConfig: {
        body: {
            tpl: '<tpl if="dhcpEnabled === true">' +
                    '<div><strong>DHCP</strong>: enabled, <strong>Range</strong>: {dhcpRangeStart} - {dhcpRangeEnd}, <strong>Lease Duration</strong>: {dhcpLeaseDuration/60}</div>' +
                 '</tpl>' +
                 '<div><strong>IPv4</strong>: {v4ConfigType}, {v4StaticAddress} / {v4StaticPrefix}</div>' +
                 '<div><strong>IPv6</strong>: {v6ConfigType}</div>'
        }
    },

    selectable: false,

    columns: [{
        text: 'Name'.t(),
        dataIndex: 'name',
        minWidth: 150,
        flex: 1
    }, {
        text: 'Type'.t(),
        dataIndex: 'type',
    }, {
        text: 'Device'.t(),
        dataIndex: 'device'
    }, {
        text: 'Config Type'.t(),
        dataIndex: 'configType'
    }, {
        text: 'Is WAN',
        dataIndex: 'wan',
        align: 'center',
        cell: {
            encodeHtml: false,
        },
        renderer: function (value) {
            return value ? '<i class="x-fa fa-check">' : '';
        }
    }, {
        text: 'Edit',
        width: 'auto',
        menuDisabled: true,
        cell: {
            tools: [{
                type: 'edit',
                iconCls: 'x-fa fa-pencil',
                handler: 'onEdit'
            }]
        }
    }],


    controller: {
        onEdit: function (grid, info) {
            var me = this;
            if (!me.dialog) {
                me.dialog = Ext.Viewport.add({
                    xtype: 'interface-dialog',
                    // ownerCmp: grid
                });
            }
            me.dialog.getViewModel().set('rec', info.record);
            me.dialog.show();
        }
    }

});
