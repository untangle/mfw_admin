Ext.define('Mfw.store.Interfaces', {
    extend: 'Ext.data.Store',
    storeId: 'interfaces',
    alias: 'store.interfaces',
    model: 'Mfw.model.Interface',

    // important so interfaces are loaded at startup
    // autoLoad: true,

    trackRemoved: false, // important so no need to post dropped records
    autoSort: false, // important so store is not sorted on record add,

    listeners: {
        // refresh interfaces map on data change
        datachanged: function (store) {
            var interfacesMap = {};
            store.each(function (interface) {
                interfacesMap[interface.get('interfaceId')] = interface.get('name');
            });
            Map.interfaces = interfacesMap;
            Map.options.interfaces = Map.toOptions(interfacesMap);
        }
    }
});
