Ext.define('Mfw.settings.network.Interfaces', {
    // extend: 'Ext.grid.Grid',
    extend: 'Mfw.cmp.grid.MasterGrid',
    alias: 'widget.mfw-settings-network-interfaces',

    controller: 'mfw-settings-network-interfaces',

    title: 'Interfaces'.t(),

    config: {
        enableManualSort: false,
        enableDelete: '{record.wan}',
        editorDialog: 'interface-dialog',
        newRecordModel: 'Mfw.model.Interface'
    },

    sortable: false,

    scrollable: true,
    store: {
        type: 'interfaces'
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
        text: 'Name'.t(),
        dataIndex: 'name',
        flex: 1,
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
    }, {
        text: 'Type'.t(),
        dataIndex: 'type',
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
    }]
});
