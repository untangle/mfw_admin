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
            // set valid columns for each record
            var validColumns;
            Ext.Array.each(records, function (record) {
                validColumns = [];
                Ext.Array.each(Table.names, function (name) {
                    if (record.get('table').indexOf(name) >= 0) {
                        Ext.Array.each(Table[name].columns, function (c) {
                            if (validColumns.indexOf(c.dataIndex) < 0) {
                                validColumns.push(c.dataIndex);
                            }
                        });
                    }
                });
                record._validColumns = validColumns;
            });
            Ext.getStore('reports-nav').build();
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
