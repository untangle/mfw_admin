Ext.define('Mfw.settings.routing.WanPolicies', {
    extend: 'Mfw.cmp.grid.MasterGrid',
    alias: 'widget.mfw-settings-routing-wan-policies',
    controller: 'mfw-settings-routing-wan-policies',

    title: 'WAN Policies'.t(),

    config: {
        enableManualSort: false,
        recordModel: 'Mfw.model.WanPolicy'
    },

    sortable: false,

    store: {
        model: 'Mfw.model.WanPolicy'
    },

    variableHeights: true,

    columns: [{
        xtype: 'checkcolumn',
        // text: 'Enabled',
        width: 40,
        dataIndex: 'enabled'
    }, {
        text: 'Policy Id',
        dataIndex: 'policyId',
        align: 'right',
        width: 80
    }, {
        text: 'Description',
        dataIndex: 'description',
        width: 200
    }, {
        text: 'Type',
        dataIndex: 'type',
        width: 150,
        renderer: function (value) {
            var str;
            switch (value) {
                case 'SPECIFIC_WAN': str = 'Specific WAN'; break;
                case 'BEST_OF': str = 'Best Of'; break;
                case 'BALANCE': str = 'Balance'; break;
                default:
            }
            return str;
        }
    }, {
        text: 'Best of Metric',
        dataIndex: 'best_of_metric',
        width: 200,
        renderer: function (value) {
            var str;
            switch (value) {
                case 'LOWEST_LATENCY': str = 'Lowest Latency'; break;
                case 'HIGHEST_AVAILABLE_BANDWIDTH': str = 'Highest Available Bandwidth'; break;
                case 'LOWEST_JITTER': str = 'Lowest Jitter'; break;
                case 'LOWEST_PACKET_LOSS': str = 'Lowest Packet Loss'; break;
                default:
            }
            return str;
        }
    }, {
        text: 'Interfaces',
        dataIndex: 'interfaces',
        width: 240,
        cell: { encodeHtml: false },
        renderer: function (value, record) {
            var output = [], text;
            record.interfaces().each(function (i) {
                output.push(Renderer.interface(i.get('id')) + ' (' + i.get('weight') + ')');
            });
            return output.join(', ');
        }
    }, {
        text: 'Balance Algorithm',
        dataIndex: 'balance_algorithm',
        width: 200,
        renderer: function (value) {
            var str;
            switch (value) {
                case 'WEIGHTED': str = 'Weighted'; break;
                case 'LATENCY': str = 'Latency'; break;
                case 'AVAILABLE_BANDWIDTH': str = 'Available Bandwidth'; break;
                case 'BANDWIDTH': str = 'Bandwidth'; break;
                default:
            }
            return str;
        }
    }, {
        text: 'Criteria',
        dataIndex: 'criteria',
        flex: 1,
        cell: { encodeHtml: false },
        renderer: function (value, record) {
            var output = [], text;
            record.criteria().each(function (c) {
                if (c.get('type') === 'ATTRIBUTE') {
                    if (c.get('attribute') === 'VPN') {
                        output.push('is <b>is VPN</b>');
                    }
                    if (c.get('attribute') === 'NAME') {
                        output.push('name contains "<strong>' + c.get('name_contains') + '</strong>"');
                    }
                }
                if (c.get('type') === 'METRIC') {
                    text = '';
                    switch (c.get('metric')) {
                        case 'LATENCY': text += 'latency'; break;
                        case 'AVAILABLE_BANDWIDTH': text += 'available bandwidth'; break;
                        case 'JITTER': text += 'jitter'; break;
                        case 'PACKET_LOSS': text += 'packet loss'; break;
                        default: text += 'n/a';
                    }

                    text += ' ' + c.get('metric_op');
                    text += ' <strong>' + c.get('metric_value') + '</strong>';
                    output.push(text);
                }
            });
            if (output.length > 0) {
                return 'Interface ' + output.join(', ');
            }
            return '';
        }
    }]
});
