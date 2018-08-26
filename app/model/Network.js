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
            read: window.location.origin + '/settings/get_settings/network',
            update: window.location.origin + '/settings/set_settings/network'
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
