Ext.define('Mfw.model.table.Chain', {
    extend: 'Ext.data.Model',
    alias: 'model.table-chain',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'base',        type: 'boolean', defaultValue: false },
        { name: 'default',     type: 'boolean', defaultValue: false },
        { name: 'description', type: 'string' },
        { name: 'editable',    type: 'boolean', defaultValue: true },
        { name: 'hook',        type: 'string' },
        { name: 'name',        type: 'string' },
        { name: 'priority',    type: 'integer', defaultValue: null },
        { name: 'type',        type: 'string' }
    ],

    hasMany: {
        model: 'Mfw.model.table.Rule',
        name: 'rules',
        associationKey: 'rules'
    }

    // proxy: {
    //     type: 'ajax',
    //     // api: {
    //     //     read: Util.api + '/settings/network',
    //     //     update: Util.api + '/settings/network'
    //     // },
    //     reader: {
    //         type: 'json'
    //     },
    //     writer: {
    //         type: 'json',
    //         writeAllFields: true,
    //         allDataOptions: {
    //             associated: true,
    //             persist: true
    //         }
    //     }
    // }
});
