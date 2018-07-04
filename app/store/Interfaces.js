Ext.define('Mfw.store.Interfaces', {
    extend: 'Ext.data.Store',
    storeId: 'interfaces',
    alias: 'store.interfaces',
    model: 'Mfw.model.Interface',

    proxy: {
        type: 'ajax',
        // url: 'http://192.168.0.101:8080/settings/get_settings/network/interfaces',
        reader: {
            type: 'array',
            // rootProperty: 'interfaces'
        },
    },
    // autoLoad: true
});
