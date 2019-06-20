Ext.define('Mfw.model.table.Action', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'type', type: 'string' }
    ]

});

Ext.define('Mfw.model.table.Rule', {
    extend: 'Ext.data.Model',
    alias: 'model.table-rule',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'ruleId', type: 'integer' },
        { name: 'enabled', type: 'boolean', defaultValue: true },
        { name: 'description', type: 'string' },
        { name: '_deleteSchedule', type: 'boolean', default: false },
        { name: '_state', type: 'string', default: null } // NEW, REMOVED, MODIFIED, MOVED
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
    }

    // proxy: {
    //     type: 'ajax',
    //     reader: {
    //         type: 'json'
    //     },
    //     writer: {
    //         type: 'json',
    //         writeAllFields: true,
    //         allowSingle: false,
    //         allDataOptions: {
    //             associated: true,
    //             persist: true
    //         },
    //         transform: {
    //             fn: Util.sanitize,
    //             scope: this
    //         }
    //     }
    // }
});
