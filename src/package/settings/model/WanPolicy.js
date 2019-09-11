Ext.define('Mfw.model.WanInterface', {
    extend: 'Ext.data.Model',
    alias: 'model.wan-interface',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'interfaceId', type: 'integer' },
        { name: 'weight', type: 'integer', allowNull: true }
    ]
});

Ext.define('Mfw.model.WanCriterion', {
    extend: 'Ext.data.Model',
    alias: 'model.wan-criteria',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'type',  type: 'string', defaultValue: 'ATTRIBUTE' }, // [ "ATTRIBUTE", "METRIC", "CONNECTIVITY" ]
        { name: 'attribute', type: 'string', allowNull: true, defaultValue: 'VPN' }, // [ "VPN", "NAME" ]
        { name: 'name_contains', type: 'string', allowNull: true },
        { name: 'metric', type: 'string', allowNull: true, defaultValue: 'LATENCY' }, // [ "LATENCY", "AVAILABLE_BANDWIDTH", "JITTER", "PACKET_LOSS" ]
        { name: 'metric_value', type: 'integer', allowNull: true },
        { name: 'metric_op', type: 'string', allowNull: true, defaultValue: '<' }, // ["<",">","<=",">="]
        { name: 'connectivityTestType', type: 'string', allowNull: true, defaultValue: 'PING' }, // [ "PING", "ARP", "DNS", "HTTP" ]
        { name: 'connectivityTestInterval', type: 'integer', allowNull: true }, // seconds
        { name: 'connectivityTestTimeout', type: 'integer', allowNull: true }, // seconds
        { name: 'connectivityTestFailureThreshold', type: 'integer', allowNull: true, defaultValue: 5 }, // 0 - 10 failures
        { name: 'connectivityTestTarget', type: 'string', allowNull: true } // IP/host to test
    ]
});

Ext.define('Mfw.model.WanPolicy', {
    extend: 'Ext.data.Model',
    alias: 'model.wan-policy',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'policyId', type: 'integer', allowNull: true },
        { name: 'enabled', type: 'boolean', defaultValue: true },
        { name: 'description', type: 'string' },
        { name: 'type', type: 'string', defaultValue: 'SPECIFIC_WAN' }, // ["SPECIFIC_WAN", "BEST_OF", "BALANCE" ]
        { name: 'best_of_metric', type: 'string', allowNull: true, defaultValue: 'LOWEST_LATENCY' }, // [ "LOWEST_LATENCY", "HIGHEST_AVAILABLE_BANDWIDTH", "LOWEST_JITTER", "LOWEST_PACKET_LOSS" ]
        { name: 'balance_algorithm', type: 'string', allowNull: true, defaultValue: 'WEIGHTED' } // [ "WEIGHTED", "LATENCY", "AVAILABLE_BANDWIDTH", "BANDWIDTH" ]
    ],

    hasMany: [{
        model: 'Mfw.model.WanInterface',
        name: 'interfaces',
        associationKey: 'interfaces'
    }, {
        model: 'Mfw.model.WanCriterion',
        name: 'criteria',
        associationKey: 'criteria'
    }],

    proxy: {
        type: 'ajax',
        api: {
            read: Util.api + '/settings/wan/policies',
            update: Util.api + '/settings/wan/policies'
        },
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            allowSingle: false, // wrap single record in array
            allDataOptions: {
                associated: true,
                persist: true
            },
            transform: {
                fn: Util.sanitize,
                scope: this
            }
        }
    }
});
