Ext.define('Mfw.model.Condition', {
    extend: 'Ext.data.Model',
    alias: 'model.condition',

    fields: [
        { name: 'type',  type: 'string' },
        { name: 'op',    type: 'string' },
        { name: 'value', type: 'string' }
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
