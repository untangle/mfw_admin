Ext.define('Mfw.reports.ReportController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.report',

    init: function (view) {
        var me = this,
            viewModel = me.getViewModel();

        viewModel.bind('{route}', function (route) {

            if (window.location.hash.indexOf('#reports') < 0) { return; }

            Ext.Object.each(Ext.Ajax.requests, function (key, req) {
                if (req.url.startsWith('/api/reports')) {
                    req.abort();
                }
            });

            var record,
                activeItem = 'noselection-report',
                userConditions = [],
                invalidConditions = []; // not all conditions might fit a specific report

            // check if report route
            if (route.cat && route.rep) {
                record = Ext.getStore('reports').findRecord('_route', 'cat=' + route.cat + '&rep=' + route.rep, 0, false, false, true);
            }

            if (!record) {
                viewModel.set('record', null);
                view.setActiveItem(activeItem);
                return;
            }

            switch (record.get('type')) {
                case 'TEXT': activeItem = 'text-report'; break;
                case 'EVENTS': activeItem = 'events-report'; break;
                default: activeItem = 'chart-report';
            }
            view.setActiveItem(activeItem);

            if (route.until) {
                userConditions.push({
                    column: 'time_stamp',
                    operator: 'LT',
                    value: route.until
                });
            }

            Ext.Array.each(route.conditions, function (cond) {
                if (record._validColumns.indexOf(cond.column) < 0) {
                    if (invalidConditions.indexOf(cond.column) < 0) {
                        invalidConditions.push(cond.column);
                    }
                } else {
                    userConditions.push(cond);
                }
            });

            if (invalidConditions.length > 0) {
                viewModel.set('invalidConditionsWarning', '<i class="fa fa-info-circle"></i> <span style="color: #b13232; font-weight: bold;">Some conditions were ommited!</span> <strong>' + invalidConditions.join(', ') + '</strong> does not apply for this report.');
            } else {
                viewModel.set('invalidConditionsWarning', null);
            }

            record.userConditions().loadData(userConditions);

            viewModel.set('record', record);

            me.loadData();

        }, me, { deep: true });
    },

    loadData: function () {
        var me = this, view = me.getView(), viewModel = me.getViewModel(),
            dataGrid = view.down('#dataPanel').down('grid'),
            record = viewModel.get('record'), controller;

        // clear data grid
        dataGrid.getStore().setData([]);
        dataGrid.setColumns([]);

        if (!record) { return; }

        switch (record.get('type')) {
            case 'TEXT': controller = view.down('text-report').getController(); break;
            case 'EVENTS': controller = view.down('events-report').getController(); break;
            default: controller = view.down('chart-report').getController();
        }

        controller.loadData(function (data) {
            if (!data) { return; }
            me.setDataGrid(dataGrid, record, data);
        });
    },

    /**
     * Sets the data grid columns and data
     * The columns might not be known/set but only after data is received, so are created based on that
     */
    setDataGrid: function (grid, record, data) {
        var me = this,
            reportType = record.get('type'), columns;

        // no data grid for EVENTS reports
        if (reportType === 'TEXT' || reportType === 'EVENTS') {
            me.getView().down('#dataBtn').setPressed(false);
            grid.getStore().loadData([]);
            return;
        }

        // for PIE charts
        if (reportType === 'CATEGORIES') {
            var tableNames = [], // tables to lok for columns
                columnName = record.getQueryCategories().get('groupColumn'),
                column;

            /**
             * there could be a single table
             * or multiple tables in a JOIN, definec in tables array
             */

            if (record.get('tables')) {
                tableNames = record.get('tables');
            } else {
                tableNames.push(record.get('table'));
            }

            Ext.Array.each(tableNames, function (table) {
                if (!Table[table] || !Table[table].columns) {
                    console.warn('Table ' + table + ' is not defined!');
                    return;
                }

                if (!column) {
                    column = Ext.Array.findBy(Table[table].columns, function (col) {
                        return col.dataIndex === columnName;
                    });
                }
            });

            if (!column) {
                console.warn('Column not found/defined!');
                return;
            }

            column.renderer = function (val) {
                return val || 'Unknown';
            };
            column.width = 300;

            columns = [
                column, {
                    text: 'Value',
                    dataIndex: 'value',
                    cell: { encodeHtml: false },
                    renderer: function (value) {
                        var units = record.get('units');
                        if (units === 'bytes/s') {
                            return Renderer.bytesSecRenderer(value);
                        }
                        return !value ? 0 : value;
                    }
                }, {
                    text: 'Add as Condition',
                    width: 200,
                    flex: 1,
                    cell: {
                        encodeHtml: false,
                        tools: [{
                            iconCls: 'x-fa fa-plus',
                            handler: 'addCondition'
                        }]
                    }
                }
            ];
        }

        // for CATEGORIES_SERIES
        if (reportType === 'CATEGORIES_SERIES') {
            columns = [];
            // create columns from first data row
            Ext.Object.each(data[0], function (key, val) {
                if (key === 'id') { return; }
                if (key === 'time_trunc') {
                    columns.unshift({
                        text: 'Time',
                        dataIndex: 'time_trunc',
                        width: 180,
                        menuDisabled: true,
                        sortable: false,
                        cell: {
                            encodeHtml: false
                        },
                        renderer: Renderer.timeStamp
                    });
                    return;
                }

                columns.push({
                    text: key === '<nil>' ? 'none' : key,
                    dataIndex: key,
                    width: 120,
                    menuDisabled: true,
                    sortable: false,
                    cell: { encodeHtml: false },
                    renderer: function (value) {
                        var units = record.get('units');
                        if (!value) { return 0; }
                        if (units === 'bytes/s') {
                            return Renderer.bytesSecRenderer(value);
                        }
                        if (units === 'ms') {
                            return Renderer.round(value) + ' ms';
                        }
                        return value;
                    }
                });
            });
        }

        // for simple SERIES
        if (reportType === 'SERIES') {
            columns = [{
                text: 'Time',
                dataIndex: 'time_trunc',
                width: 180,
                menuDisabled: true,
                sortable: false,
                cell: {
                    encodeHtml: false
                },
                renderer: Renderer.timeStamp
            }, {
                text: record.get('table'),
                dataIndex: record.get('table'),
                flex: 1,
                menuDisabled: true,
                sortable: false,
                renderer: function (value) {
                    return !value ? 0 : value;
                }
            }];
        }

        grid.setColumns(columns);
        grid.getStore().setData(data);
    },

    showData: function () {
        var me = this;
        me.getView().down('#dataPanel').show();
    },

    addCondition: function (grid, info) {
        var me = this, vm = me.getViewModel(),
            column = grid.getColumns()[0].getDataIndex(),
            value = info.record.getData()[column],
            route = vm.get('route');

        if (column) {
            route.conditions.push({
                column: column,
                operator: 'EQ',
                value: value
            });
            Mfw.app.redirectTo(ReportsUtil.routeToQuery(route));
        } else {
            console.warn('Unable to add Condition!');
        }
    },

    clearFilters: function () {
        var me = this,
            filterField = me.getView().up('reports').down('searchfield');

        if (me.getView().down('events-report')) {
            var grid = me.getView().down('events-report > grid');
            // remove gridfilters plugin fiter
            grid.getPlugin('gridfilters').setActiveFilter(null);
        }

        if (filterField) {
            // clear global filter
            filterField.setValue('');
        }

    }
});
