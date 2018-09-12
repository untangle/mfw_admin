Ext.define('Mfw.model.table.Rule', {
    extend: 'Ext.data.Model',
    alias: 'model.table-rule',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'ruleId', type: 'integer' },
        { name: 'enabled', type: 'boolean' },
        { name: 'description', type: 'string' },
        { name: 'action', type: 'auto' },
        { name: '_deleteSchedule', type: 'boolean', default: false }
    ],

    hasMany: [{
        model: 'Mfw.model.table.Condition',
        name: 'conditions',
        associationKey: 'conditions'
    }],

    hasOne: {
        model: 'Mfw.model.table.Action',
        name: 'action',
        associationKey: 'action'
    },

    proxy: {
        type: 'ajax',
        // api: {
        //     read: Util.api + '/settings/network',
        //     update: Util.api + '/settings/network'
        // },
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
