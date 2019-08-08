Ext.define('Mfw.settings.network.Interfaces', {
    // extend: 'Ext.grid.Grid',
    extend: 'Mfw.cmp.grid.MasterGrid',
    alias: 'widget.mfw-settings-network-interfaces',

    controller: 'mfw-settings-network-interfaces',

    title: 'Interfaces',

    config: {
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
        menuDisabled: true,
        cell: { encodeHtml: false },
        renderer: function (value) {
            var svgIcon = '';
            switch (value) {
                case 'NIC': svgIcon = 'network-wired.svg'; break;
                case 'WIFI': svgIcon = 'wifi.svg'; break;
                case 'VLAN':
                case 'OPENVPN': svgIcon = 'project-diagram.svg'; break;
                default: svgIcon = 'signal.svg';
            }
            return '<img width=16 src="../static/res/icons/intf/' + svgIcon + '">';
        }
    }, {
        text: 'Name',
        dataIndex: 'name',
        flex: 1,
        minWidth: 150,
        groupable: false,
        cell: { encodeHtml: false },
        renderer: function (value, record) {
            return '<b>' + record.get('name') + ' </b>';
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
        menuDisabled: true,
        width: 70,
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
        text: 'IPv6',
        dataIndex: 'v6ConfigType',
        minWidth: 200,
        flex: 1,
        renderer: function (value) {
            if (value) {
                return value;
            }
            return '-';
        }
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
        text: 'Download',
        align: 'right',
        width: 120,
        dataIndex: 'downloadKbps',
        resizable: false,
        groupable: false,
        cell: {
            encodeHtml: false,
        },
        renderer: function (value, record) {
            if (!record.get('wan')) { return '-'; }
            return value ? '<strong>' + (value/1000).toFixed(2) + ' Mbps</strong>' : '<em style="color: #777;">< not set ></em>';
        }
    }, {
        text: 'Upload',
        align: 'right',
        width: 120,
        dataIndex: 'uploadKbps',
        resizable: false,
        groupable: false,
        cell: {
            encodeHtml: false
        },
        renderer: function (value, record) {
            if (!record.get('wan')) { return '-'; }
            return value ? '<strong>' + (value/1000).toFixed(2) + ' Mbps</strong>' : '<em style="color: #777;">< not set ></em>';
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
    }]
});
