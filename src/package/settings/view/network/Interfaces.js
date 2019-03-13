Ext.define('Mfw.settings.network.Interfaces', {
    // extend: 'Ext.grid.Grid',
    extend: 'Mfw.cmp.grid.MasterGrid',
    alias: 'widget.mfw-settings-network-interfaces',

    controller: 'mfw-settings-network-interfaces',

    title: 'Interfaces'.t(),

    config: {
        enableManualSort: false,
        disableDeleteCondition: '{record.wan && record.type === "NIC"}',
        disableCopyCondition: '{record.wan}',
        editor: 'interface-sheet',
        recordModel: 'Mfw.model.Interface'
    },

    plugins: {
        mastergrideditable: true
    },

    sortable: false,

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
        text: 'Id'.t(),
        dataIndex: 'interfaceId',
        align: 'right',
        width: 60,
        resizable: false,
        sortable: false,
        menuDisabled: true
    }, {
        text: 'Name'.t(),
        dataIndex: 'name',
        menuDisabled: true,
        sortable: false,
        flex: 1
    }, {
        text: 'Type'.t(),
        menuDisabled: true,
        dataIndex: 'type',
        sortable: false
    }, {
        text: 'Device'.t(),
        dataIndex: 'device',
        menuDisabled: true,
        sortable: false
    }, {
        text: 'Config'.t(),
        dataIndex: 'configType',
        menuDisabled: true,
        sortable: false,
        minWidth: 180,
        cell: {
            encodeHtml: false,
        },
        renderer: 'configTypeRenderer'
    }, {
        text: 'IPv4'.t(),
        minWidth: 200,
        dataIndex: 'v4ConfigType',
        sortable: false,
        menuDisabled: true,
        renderer: function (value, record) {
            if (value === 'DHCP' || value === 'PPPOE') {
                return value;
            }
            if (value === 'STATIC') {
                return 'STATIC, ' + record.get('v4StaticAddress') + '/' + record.get('v4StaticPrefix');
            }
            return '-';
        }
    }, {
        text: 'IPv6'.t(),
        minWidth: 200,
        dataIndex: 'v6ConfigType',
        sortable: false,
        menuDisabled: true,
        renderer: function (value) {
            if (value) {
                return value;
            }
            return '-';
        }
    }, {
        text: 'MAC',
        dataIndex: 'macaddr',
        minWidth: 140,
        sortable: false,
        menuDisabled: true
    }]
});
