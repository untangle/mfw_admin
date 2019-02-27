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

    // plugins: ['rowexpander'],

    // itemConfig: {
    //     body: {
    //         tpl: '<tpl if="dhcpEnabled === true">' +
    //                 '<div><strong>DHCP</strong>: enabled, <strong>Range</strong>: {dhcpRangeStart} - {dhcpRangeEnd}, <strong>Lease Duration</strong>: {dhcpLeaseDuration/60}</div>' +
    //              '</tpl>' +
    //              '<div><strong>IPv4</strong>: {v4ConfigType}, {v4StaticAddress} / {v4StaticPrefix}</div>' +
    //              '<div><strong>IPv6</strong>: {v6ConfigType}</div>'
    //     }
    // },

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
        flex: 1,
        // responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
    }, {
        text: 'Type'.t(),
        dataIndex: 'type',
        // responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
    }, {
        text: 'Device'.t(),
        dataIndex: 'device',
        menuDisabled: true,
        // responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
    }, {
        text: 'Config Type'.t(),
        dataIndex: 'configType',
        menuDisabled: true,
        // responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
    }, {
        text: 'Current Address'.t(),
        width: 150,
        dataIndex: 'v4StaticAddress',
        menuDisabled: true,
        // responsiveConfig: { large: { hidden: false }, small: { hidden: true } }
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
        // responsiveConfig: { large: { hidden: false }, small: { hidden: true } }
    }]
});
