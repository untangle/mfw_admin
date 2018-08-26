Ext.define('Mfw.store.Interfaces', {
    extend: 'Ext.data.Store',
    storeId: 'interfaces',
    alias: 'store.interfaces',
    model: 'Mfw.model.Interface',

    trackRemoved: false, // important so no need to post dropped records
    autoSort: false, // important so store is not sorted on record add
});
