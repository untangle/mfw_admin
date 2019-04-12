Ext.define('Mfw.model.table.Condition', {
    extend: 'Ext.data.Model',
    alias: 'model.table-condition',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'type',  type: 'string' },
        { name: 'op',    type: 'string' },
        { name: 'rate_unit',  type: 'string', defaultValue: null },
        { name: 'value', type: 'auto' }
    ],

    // proxy: {
    //     type: 'ajax',
    //     api: {
    //         read: Util.api + '/settings/network',
    //         update: Util.api + '/settings/network'
    //     },
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
