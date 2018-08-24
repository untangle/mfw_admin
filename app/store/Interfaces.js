Ext.define('Mfw.store.Interfaces', {
    extend: 'Ext.data.Store',
    storeId: 'interfaces',
    alias: 'store.interfaces',
    model: 'Mfw.model.Interface',

    proxy: {
        type: 'ajax',
        api: {
            read: window.location.origin + '/settings/get_settings/network/interfaces',
            update: window.location.origin + '/settings/set_settings/network/interfaces'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            allDataOptions: {
                serialize: true
                // changes: false,
                // persist: false
            },
            transform: {
                fn: function(data, request) {
                    // do some manipulation of the unserialized data object
                    console.log(data);
                    return data;
                },
                scope: this
            }
        }
    }
});
