Ext.define('Mfw.store.Reports', {
    extend: 'Ext.data.Store',
    storeId: 'reports',
    alias: 'store.reports',

    model: 'Mfw.model.Report',

    groupField: 'category',
    sorters: [{
        property: 'displayOrder',
        direction: 'ASC'
    }],

    listeners: {
        load: function () {
            // console.log(Ext.getStore('ReportsNav'));
            Ext.getStore('reports-nav').build();
        }
    }
});
