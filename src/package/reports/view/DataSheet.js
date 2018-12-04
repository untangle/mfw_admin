Ext.define('Mfw.reports.Data', {
    extend: 'Ext.Sheet',
    alias: 'widget.data-sheet',

    title: 'Data'.t(),
    width: 500,

    // scrollable: true,

    // closable: true,
    closeAction: 'hide',
    hideMode: 'clip',
    // centered: true,
    cover: true,
    side: 'right',



    viewModel: {
        stores: {
            gridData: {
                data: '{data}'
            }
        }
    },

    layout: 'fit',
    items: [{
        xtype: 'grid',
        scrollable: true,
        bind: '{gridData}'
    }],

    listeners: {
        hide: 'onHide'
    },

    controller: {
        init: function (view) {
            var me = this, vm = view.getViewModel(), record,
                grid = me.getView().down('grid');


            vm.bind('{data}', function (data) {
                record = vm.get('record');
                if (!record) { return; }

                switch (record.get('type')) {
                    case 'TEXT': me.setTextData(grid, record, data); break;
                    case 'CATEGORIES': me.setCategoriesData(grid, record, data); break;
                    case 'SERIES': me.setSeriesData(grid, record, data); break;
                    case 'CATEGORIES_SERIES': me.setCategoriesSeriesData(grid, record, data); break;
                    default: Ext.emptyFn;
                }


            });
        },

        onHide: function (view) {
            view.down('grid').setColumns([]);
        },

        setTextData: function (grid, record, data) {
            // todo
            console.log(data);
        },

        setCategoriesData: function (grid, record, data) {
            var tableName = record.get('table'),
                columnName = record.getQueryCategories().get('groupColumn'),
                column;

            if (!tableName || !columnName) { return; }

            if (!Table[tableName] || !Table[tableName].columns) {
                return;
            }

            column = Ext.Array.findBy(Table[tableName].columns, function (item, idx) {
                return item.dataIndex === columnName;
            });

            grid.setColumns([
                column, {
                    text: 'Value',
                    dataIndex: 'value',
                    flex: 1
                }
            ]);

            // data is set in the viewModel already
        },

        setSeriesData: function (grid, record, data) {
            grid.setColumns([{
                text: 'Time',
                dataIndex: 'time_trunc',
                width: 180,
                cell: {
                    encodeHtml: false
                },
                renderer: Renderer.time_stamp
            }, {
                text: record.get('table'),
                dataIndex: record.get('table'),
                flex: 1,
                renderer: function (value) {
                    return !value ? 0 : value;
                }
            }]);
        },

        setCategoriesSeriesData: function (grid, record, data) {
            var columns = [];
            // create columns from first data row
            Ext.Object.each(data[0], function (key, val) {
                if (key === 'id') { return; }
                if (key === 'time_trunc') {
                    columns.unshift({
                        text: 'Time',
                        dataIndex: 'time_trunc',
                        width: 180,
                        cell: {
                            encodeHtml: false
                        },
                        renderer: Renderer.time_stamp
                    });
                    return;
                }
                columns.push({
                    text: key,
                    dataIndex: key,
                    width: 120,
                    renderer: function (value) {
                        return !value ? 0 : value;
                    }
                });
            });

            grid.setColumns(columns);
        }

    }

});
