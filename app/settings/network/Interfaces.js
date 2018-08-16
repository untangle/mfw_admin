Ext.define('Mfw.settings.network.Interfaces', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.mfw-settings-network-interfaces',

    viewTitle: 'Interfaces'.t(),

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

    bind: {
        hideHeaders: '{smallScreen}'
    },

    selectable: {
        mode: 'multi'
    },

    columns: [{
        dataIndex: 'name',
        flex: 1,
        renderer: function (val, rec) {
            return rec.get('name') + ' / ' + rec.get('device') + ' / ' + rec.get('configType');
        },
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: true }, small: { hidden: false } },
    }, {
        text: 'Name'.t(),
        dataIndex: 'name',
        flex: 1,
        menuDisabled: true,
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
    }, {
        text: 'Type'.t(),
        dataIndex: 'type',
        menuDisabled: true,
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
    }, {
        text: 'Device'.t(),
        dataIndex: 'device',
        menuDisabled: true,
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
    }, {
        text: 'Config Type'.t(),
        dataIndex: 'configType',
        menuDisabled: true,
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
    }, {
        text: 'Is WAN',
        dataIndex: 'wan',
        align: 'center',
        menuDisabled: true,
        cell: {
            encodeHtml: false,
        },
        renderer: function (value) {
            return value ? '<i class="x-fa fa-check">' : '';
        },
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false }, small: { hidden: true } }
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
            // info.record.getValidation()


            me.dialog.getViewModel().set('rec', info.record);
            me.dialog.show();
        }
    }

});
