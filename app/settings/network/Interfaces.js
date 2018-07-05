Ext.define('Mfw.settings.network.Interfaces', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.mfw-settings-network-interfaces',

    title: 'Interfaces',

    store: 'interfaces',

    plugins: {
        rowexpander: true
    },

    itemConfig: {
        body: {
            tpl: '<tpl if="dhcpEnabled === true">' +
                    '<div>DHCP: enabled, Range: {dhcpRangeStart} -> {dhcpRangeEnd}, Lease Duration: {dhcpLeaseDuration/60}</div>' +
                 '</tpl>' +
                 '<div>IPv4: {v4ConfigType}, {v4StaticAddress}/{v4StaticPrefix}</div>' +
                 '<div>IPv6: {v6ConfigType}</div>'
        }
    },

    columns: [{
        text: 'Name'.t(),
        dataIndex: 'name'
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
    }]

});
