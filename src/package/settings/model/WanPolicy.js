Ext.define('Mfw.model.WanInterface', {
    extend: 'Ext.data.Model',
    alias: 'model.wan-interface',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'id',  type: 'integer' },
        { name: 'weight', type: 'integer' }
    ]
});

Ext.define('Mfw.model.WanCriterion', {
    extend: 'Ext.data.Model',
    alias: 'model.wan-criteria',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'type',  type: 'string', defaultValue: 'ATTRIBUTE' }, // [ "ATTRIBUTE", "METRIC" ]
        { name: 'attribute', type: 'string', allowNull: true }, // [ "VPN", "NAME" ]
        { name: 'name_contains', type: 'string' },
        { name: 'metric', type: 'string' }, // [ "LATENCY", "AVAILABLE_BANDWIDTH", "JITTER", "PACKET_LOSS" ]
        { name: 'metric_value', type: 'integer' },
        { name: 'metric_op', type: 'string' } // ["<",">","<=",">="]
    ]
});

Ext.define('Mfw.model.WanPolicy', {
    extend: 'Ext.data.Model',
    alias: 'model.wan-policy',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'policyId', type: 'integer', allowNull: true },
        { name: 'enabled',    type: 'boolean', defaultValue: true },
        { name: 'description', type: 'string' },
        { name: 'type', type: 'string', defaultValue: 'SPECIFIC_WAN' }, // ["SPECIFIC_WAN", "BEST_OF", "BALANCE" ]
        { name: 'best_of_metric', type: 'string', allowNull: true }, // [ "LOWEST_LATENCY", "HIGHEST_AVAILABLE_BANDWIDTH", "LOWEST_JITTER", "LOWEST_PACKET_LOSS" ]
        { name: 'balance_algorithm', type: 'string', allowNull: true } // [ "WEIGHTED", "LATENCY", "AVAILABLE_BANDWIDTH", "BANDWIDTH" ]
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
