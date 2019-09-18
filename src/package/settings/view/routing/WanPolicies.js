Ext.define('Mfw.settings.routing.WanPolicies', {
    extend: 'Mfw.cmp.grid.MasterGrid',
    alias: 'widget.mfw-settings-routing-wan-policies',
    controller: 'mfw-settings-routing-wan-policies',

    title: 'WAN Policies'.t(),

    config: {
        enableManualSort: false,
        recordModel: 'Mfw.model.WanPolicy',
        editor: 'wan-policy-dialog'
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
        width: 300,
        cell: { encodeHtml: false },
        renderer: function (value, record) {
            var str;
            if (record.get('type') === 'SPECIFIC_WAN') {
                str = '<strong>Specific WAN</strong>';
            }
            if (record.get('type') === 'BEST_OF') {
                str = '<strong>Best WAN with </strong> ';
                switch (record.get('best_of_metric')) {
                    case 'LOWEST_LATENCY': str += 'Lowest Latency'; break;
                    case 'HIGHEST_AVAILABLE_BANDWIDTH': str += 'Highest Available Bandwidth'; break;
                    case 'LOWEST_JITTER': str += 'Lowest Jitter'; break;
                    case 'LOWEST_PACKET_LOSS': str += 'Lowest Packet Loss'; break;
                    default: break;
                }
            }
            if (record.get('type') === 'BALANCE') {
                str = '<strong>Balance</strong> ';
                switch (record.get('balance_algorithm')) {
                    case 'WEIGHTED': str += 'Weighted'; break;
                    case 'LATENCY': str += 'Latency'; break;
                    case 'AVAILABLE_BANDWIDTH': str += 'Available Bandwidth'; break;
                    case 'BANDWIDTH': str += 'Bandwidth'; break;
                    default: break;
                }
            }
            return str;
        }
    }, {
        text: 'Interfaces',
        dataIndex: 'interfaces',
        flex: 1,
        cell: { encodeHtml: false },
        renderer: function (value, record) {
            var output = [],
                weighted = record.get('balance_algorithm') === 'WEIGHTED';
            record.interfaces().each(function (i) {
                if (i.get('interfaceId') === 0) {
                    output.push('All WANs' + (weighted ? ' (evenly weighted)' : ''));
                } else {
                    output.push('<b>' + Map.interfaces[i.get('interfaceId')] + '</b>' + (record.get('type') == 'BALANCE' && weighted ? '/' + i.get('weight') : ''));
                }
            });
            return output.join(', ');
        }
    }, {
        text: 'WAN Criterion',
        dataIndex: 'criteria',
        flex: 1,
        cell: { encodeHtml: false },
        renderer: function (value, record) {
            var output = [], text;
            record.criteria().each(function (c) {
                if (c.get('type') === 'ATTRIBUTE') {
                    if (c.get('attribute') === 'VPN') {
                        output.push('<b>is VPN</b>');
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

                if (c.get('type') === 'CONNECTIVITY') {
                    text = c.get('connectivityTestType') + ' test ' +
                           '<b>' + c.get('connectivityTestTarget') + '</b> at ' +
                           c.get('connectivityTestInterval') + ' seconds interval, ' +
                           ' with max ' + c.get('connectivityTestFailureThreshold') + ' failures';
                    output.push(text);
                }

            });
            if (output.length > 0) {
                return 'Interface ' + output.join('<br/>');
            }
            return '';
        }
    }]
});
