Ext.define('Mfw.store.Widgets', {
    extend: 'Ext.data.Store',
    storeId: 'widgets',
    alias: 'store.widgets',

    model: 'Mfw.model.Widget',

    proxy: {
        type: 'ajax',
        url: '/admin/widgets.json',
        reader: {
            type: 'json',
        }
    }
});
