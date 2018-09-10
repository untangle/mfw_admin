Ext.define('Mfw.model.Action', {
    extend: 'Ext.data.Model',
    alias: 'model.action',

    fields: [
        { name: 'type', type: 'string' },
        { name: 'chain', type: 'string' },
    ],

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
