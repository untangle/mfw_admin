Ext.define('Mfw.store.ClassifyApplications', {
    extend: 'Ext.data.Store',
    storeId: 'classifyapplications',
    alias: 'store.classifyapplications',
    autoLoad: true,
    sorters: [{
        property: 'name',
        direction: 'ASC'
    }],
    proxy: {
        type: 'ajax',
        url: '/api/classify/applications',
        reader: {
            type: 'json'
        }
    }
});
