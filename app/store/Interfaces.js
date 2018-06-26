Ext.define('Mfw.store.Interfaces', {
    extend: 'Ext.data.Store',
    storeId: 'interfaces',
    alias: 'store.interfaces',
    model: 'Mfw.model.Interface',
    proxy: {
        type: 'jsonp',
        url: 'http://192.168.0.109:8080/settings/get_settings/network',
        callbackKey: 'theCallbackFunction',
        reader: {
            type: 'array',
            rootProperty: 'interfaces'
        }
    }
});
