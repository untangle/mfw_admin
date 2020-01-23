Ext.define('Mfw.settings.network.Interfaces', {
    // extend: 'Ext.grid.Grid',
    extend: 'Mfw.cmp.grid.MasterGrid',
    alias: 'widget.mfw-settings-network-interfaces',

    controller: 'mfw-settings-network-interfaces',

    title: 'Interfaces',

    config: {
        enableAdd: false,
        enableAddInterface: true,
        enableStatusColumn: false,
        enableSave: false,
        enableManualSort: false,
        disableDeleteCondition: '{record.wan && record.type === "NIC"}',
        disableCopyCondition: '{record.wan}',
        editor: 'interface-sheet',
        recordModel: 'Mfw.model.Interface'
    },

    plugins: {
        mastergrideditable: true
    },

    selectable: false,

    scrollable: true,
    store: {
        type: 'interfaces',
        // do not display hidden interfaces
        filters: [{
            property: 'hidden',
            value: false
        }]
    },

    bind: {
        hideHeaders: '{smallScreen}'
    },

    columns: [{
        text: 'Id',
        dataIndex: 'interfaceId',
        align: 'right',
        width: 60,
        resizable: false,
        menuDisabled: true,
        hidden: true
    }, {
        align: 'center',
        dataIndex: 'type',
        width: 44,
        resizable: false,
        hideable: false,
        menuDisabled: true,
        cell: { encodeHtml: false },
        renderer: Renderer.interfaceIcon
    }, {
        text: 'Name',
        dataIndex: 'name',
        flex: 1,
        minWidth: 150,
        groupable: false,
        cell: { encodeHtml: false },
        renderer: function (value, record) {
            // return '<b>' + record.get('name') + ' </b>';
            return '<b><a href="#settings/network/interfaces/' + value + '">' + record.get('name') + '</a></b>';
        }
    }, {
        dataIndex: '_status',
        text: 'Status',
        align: 'center',
        width: 80,
        resizable: false,
        hideable: false,
        sortable: false,
        menuDisabled: true,
        cell: { encodeHtml: false },
        renderer: Renderer.intfStatusConnected
    }, {
        text: 'Enabled',
        dataIndex: 'enabled',
        align: 'center',
        width: 80,
        resizable: false,
        hideable: false,
        sortable: false,
        menuDisabled: true,
        cell: { encodeHtml: false },
        renderer: function (value) {
            return value ? '<i class="fa fa-check"></i>' : '-';
        }
    }, {
        text: 'Type',
        dataIndex: 'type',
        width: 100,
        hidden: true
    }, {
        text: 'Device',
        dataIndex: 'device',
        groupable: false,
        width: 100,
        hidden: true
    }, {
        text: 'WAN',
        dataIndex: 'wan',
        align: 'center',
        resizable: false,
        hideable: false,
        sortable: false,
        menuDisabled: true,
        width: 80,
        renderer: function (value) {
            return value ? 'WAN' : '-';
        }
    }, {
        text: 'Config',
        dataIndex: 'configType',
        minWidth: 180,
        flex: 1,
        cell: {
            encodeHtml: false,
        },
        renderer: 'configTypeRenderer'
    }, {
        text: 'IPv4',
        dataIndex: 'v4ConfigType',
        minWidth: 200,
        flex: 1,
        renderer: Renderer.ipv4
    }, {
        text: 'IPv6',
        dataIndex: 'v6ConfigType',
        minWidth: 200,
        flex: 1,
        renderer: Renderer.ipv6
    }, {
        text: 'QoS',
        dataIndex: 'qosEnabled',
        width: 60,
        resizable: false,
        align: 'center',
        hidden: true,
        cell: {
            encodeHtml: false,
        },
        renderer: function (value) {
            return value ? '<i class="fa fa-check"></i>' : '-';
        }
    }, {
        text: 'NAT Egress',
        dataIndex: 'natEgress',
        align: 'center',
        width: 100,
        hidden: true,
        cell: {
            encodeHtml: false,
        },
        renderer: function (value) {
            return value ? '<i class="fa fa-check"></i>' : '-';
        }
    }, {
        text: 'NAT Ingress',
        dataIndex: 'natIngress',
        align: 'center',
        width: 100,
        hidden: true,
        cell: {
            encodeHtml: false,
        },
        renderer: function (value) {
            return value ? '<i class="fa fa-check"></i>' : '-';
        }
    }, {
        text: 'MAC',
        dataIndex: 'macaddr',
        width: 150,
        hidden: true
    }, {
        dataIndex: '_status',
        text: 'Download / Upload Rate',
        minWidth: 180,
        flex: 1,
        resizable: true,
        hideable: false,
        sortable: false,
        menuDisabled: true,
        cell: { encodeHtml: false },
        renderer: Renderer.intfStatusRates
    }]
});
