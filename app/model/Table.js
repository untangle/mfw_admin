Ext.define('Mfw.model.Table', {
    extend: 'Ext.data.Model',
    alias: 'model.table',

    fields: [
        { name: 'description', type: 'string' },
        { name: 'family',      type: 'string' },
        { name: 'name',        type: 'string' }
    ],

    hasMany: {
        model: 'Mfw.model.Chain',
        name: 'chains',
        associationKey: 'chains'
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
