Ext.define('Mfw.model.Rule', {
    extend: 'Ext.data.Model',
    alias: 'model.rule',

    fields: [
        { name: 'ruleId', type: 'integer' },
        { name: 'enabled', type: 'boolean' },
        { name: 'description', type: 'string' },
        { name: 'newDestination', type: 'string' },
        { name: 'newPort', type: 'integer' }
        // { name: 'conditions', type: 'integer' },
    ],

    hasMany: {
        model: 'Mfw.model.Condition',
        name: 'conditions',
        associationKey: 'conditions'
    },

    proxy: {
        type: 'ajax',
        api: {
            read: Util.api + '/settings/network',
            update: Util.api + '/settings/network'
        },
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            allDataOptions: {
                associated: true,
                persist: true
            }
        }
    }
});
