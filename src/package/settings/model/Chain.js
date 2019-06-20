Ext.define('Mfw.model.table.Chain', {
    extend: 'Ext.data.Model',
    alias: 'model.table-chain',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'base',        type: 'boolean', defaultValue: false },
        { name: 'description', type: 'string' },
        { name: 'editable',    type: 'boolean', defaultValue: true },
        { name: 'hook',        type: 'string' },
        { name: 'name',        type: 'string' },
        { name: 'priority',    type: 'integer', defaultValue: null },
    ],

    hasMany: {
        model: 'Mfw.model.table.Rule',
        name: 'rules',
        associationKey: 'rules'
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
