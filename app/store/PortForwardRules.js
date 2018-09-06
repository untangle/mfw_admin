Ext.define('Mfw.store.PortForwardRules', {
    extend: 'Ext.data.Store',
    storeId: 'pfr',
    alias: 'store.pfr',
    model: 'Mfw.model.Rule',

    trackRemoved: false, // important so no need to post dropped records
    autoSort: false, // important so store is not sorted on record add

    data: [
        {
            ruleId: 1,
            enabled: true,
            description: 'Some desc',
            conditions: [{
                conditionType: 'DST_ADDR',
                invert: false,
                value: '1.2.3.4'
            }, {
                conditionType: 'DST_PORT',
                invert: true,
                value: '2345'
            }, {
                conditionType: 'PROTOCOL',
                invert: false,
                value: '80'
            }, {
                conditionType: 'HTTP_URL',
                invert: false,
                value: 'someurl.com'
            }, {
                conditionType: 'CLIENT_QUOTA_EXCEEDED',
                invert: false,
                value: true
            }],
            newDestination: '1.2.3.4',
            newPort: 80
        },
        {
            ruleId: 2,
            enabled: true,
            description: 'Some desc 2',
            conditions: [],
            newDestination: '1.2.3.5',
            newPort: 90
        },
        {
            ruleId: 3,
            enabled: true,
            description: 'Some desc 3',
            conditions: [],
            newDestination: '1.2.3.8',
            newPort: 90
        },
        {
            ruleId: 4,
            enabled: false,
            description: 'Some desc 4',
            conditions: [],
            newDestination: '123.456.789.12',
            newPort: 100
        },
        {
            ruleId: 5,
            enabled: true,
            description: 'Some desc',
            conditions: [{
                conditionType: 'DST_ADDR',
                invert: false,
                value: '1.2.3.4'
            }, {
                conditionType: 'DST_PORT',
                invert: true,
                value: '2345'
            }],
            newDestination: '1.2.3.4',
            newPort: 80
        },
        {
            ruleId: 6,
            enabled: true,
            description: 'Some more text',
            conditions: [{
                conditionType: 'DST_ADDR',
                invert: false,
                value: '1.2.3.4'
            }, {
                conditionType: 'DST_PORT',
                invert: true,
                value: '2345'
            }],
            newDestination: '1.2.3.4',
            newPort: 80
        },
        {
            ruleId: 7,
            enabled: false,
            description: 'Description Long Text',
            conditions: [{
                conditionType: 'DST_ADDR',
                invert: false,
                value: '1.2.3.4'
            }, {
                conditionType: 'DST_PORT',
                invert: true,
                value: '2345'
            }],
            newDestination: '1.2.3.4',
            newPort: 80
        },
    ]
});
