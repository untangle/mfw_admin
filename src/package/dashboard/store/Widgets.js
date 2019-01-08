Ext.define('Mfw.store.Widgets', {
    extend: 'Ext.data.Store',
    storeId: 'widgets',
    alias: 'store.widgets',

    model: 'Mfw.model.Widget',

    trackRemoved: false,
    autoSort: false
});
