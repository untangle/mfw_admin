Ext.define('Mfw.model.Network', {
    extend: 'Ext.data.Model',
    alias: 'model.network',

    hasMany: {
        model: 'Mfw.model.Interface',
        name: 'interfaces',
        associationKey: 'interfaces'
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
