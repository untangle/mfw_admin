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
        load: function (el, records) {
            console.log(records);
            Ext.getStore('reports-nav').build();
            // if (Ext.getStore('reports-nav')) {
            //    //  Ext.getStore('reports-nav').build();
            // }
        }
    },

    proxy: {
        type: 'ajax',
        url: '/reports/entries.json',
        reader: {
            type: 'json',
        }
    }
});
