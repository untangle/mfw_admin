Ext.define('Mfw.store.ClassifyCategories', {
    extend: 'Ext.data.Store',
    storeId: 'classifycategories',
    alias: 'store.classifycategories',
    autoLoad: true,
    sorters: [{
        property: 'name',
        direction: 'ASC'
    }],
    proxy: {
        type: 'ajax',
        url: '/api/classify/categories',
        reader: {
            type: 'json'
        }
    }
});