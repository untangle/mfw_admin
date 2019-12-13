Ext.define('Mfw.reports.Events', {
    extend: 'Ext.Panel',
    alias: 'widget.events-report',

    viewModel: {},

    layout: 'fit',

    items: [{
        xtype: 'grid',
        reference: 'list',
        deferEmptyText: false,
        emptyText: 'No Data!',
        plugins: {
            gridfilters: true
        },
        items: [{
            xtype: 'menu',
            anchor: true,
            mouseLeaveDelay: 0,
            minWidth: 200,
            defaults: {
                handler: 'contextMenuHandler'
            },
            contextData: null,
            items: [{
                xtype: 'component',
                style: 'font-size: 14px; font-weight: bold;',
                // html: location.column.getText() + ' = ' + cell.getRawValue()
            }, {
                xtype: 'menuseparator'
            }, {
                text: 'Add as query condition',
                action: 'query'
            }, {
                text: 'Add as filter',
                action: 'filter'
            }, {
                xtype: 'menuseparator'
            }, {
                text: 'Cancel'
            }],
            listeners: {
                hide: 'hideContextMenu'
            }
        }],
        store: {
            model: 'Mfw.model.Session',
            sorters: [{
                property: 'time_stamp',
                direction: 'DESC'
            }]
        },
        listeners: {
            columnshow: 'updateVisibleColumnKeys',
            columnhide: 'updateVisibleColumnKeys',
            childcontextmenu: 'showContextMenu'
        }
    }],

    controller: {
        init: function (view) {
            var me = this,
                vm = view.getViewModel(),
                grid = view.down('grid'),
                store = grid.getStore();

            me.isWidget = view.up('widget-report') ? true : false;


            // fetch wan policies/rules used in rendering
            if (!Map.wanPolicies) {
                var policies = {};
                Ext.Ajax.request({
                    url: Util.api + '/settings/wan/policies',
                    success: function(response) {
                        var resp = Ext.decode(response.responseText);
                        Ext.Array.each(resp, function (policy) {
                            policies[policy.policyId] = policy.description;
                        });
                        Map.wanPolicies = policies;
                        Map.options.wanPolicies = Map.toOptions(policies);
                    },
                    failure: function(response) {
                        console.log('server-side failure with status code ' + response.status);
                    }
                });
            }

            if (!Map.wanRules) {
                Ext.Ajax.request({
                    url: Util.api + '/settings/wan/policy_chains',
                    success: function(response) {
                        var resp = Ext.decode(response.responseText);
                        Map.wanRules = resp;
                    },
                    failure: function(response) {
                        console.log('server-side failure with status code ' + response.status);
                    }
                });
            }


            // if not widget add details panel
            if (!me.isWidget) {
                view.add({
                    xtype: 'panel',
                    docked: 'right',
                    width: 450,
                    minWidth: 300,
                    maxWidth: 500,
                    resizable: {
                        split: true,
                        edges: 'west'
                    },
                    layout: 'fit',
                    items: [{
                        xtype: 'session-details',
                    }],
                    hidden: true,
                    bind: {
                        hidden: '{!list.selection}'
                    }
                });
            }


            vm.bind('{record}', function (record) {
                var tableNames = [],
                    columns = [], defaultColumns, columnRenames;

                grid.getStore().loadData([]);

                if (!record || record.get('type') !== 'EVENTS') {
                    return;
                }

                /**
                 * there could be a single table
                 * or multiple tables in a JOIN, defined in tables array
                 */

                columnRenames = record.getRendering().get('columnRenames');

                if (record.get('tables')) {
                    tableNames = record.get('tables');
                } else {
                    tableNames.push(record.get('table'));
                }

                Ext.Array.each(tableNames, function (table) {
                    Ext.Array.each(Table[table].columns, function (column) {
                        // make sure to avoid duplicate columns, e.g. time_stamp
                        if (!Ext.Array.findBy(columns, function (c) {
                            return column.dataIndex === c.dataIndex;
                        })) {
                            if (columnRenames) {
                                if (columnRenames[column.dataIndex]) {
                                    /**
                                     * store original column text to be able to revert its value
                                     * if no column renames
                                     */
                                    column.originalText = column.text;
                                    column.text = columnRenames[column.dataIndex];
                                } else {
                                    column.text = column.originalText || column.text;
                                }
                            } else {
                                column.text = column.originalText || column.text;
                            }
                            columns.push(column);
                        }
                    });
                });

                // set the default columns if define din rendering
                if (record.getRendering()) {
                    defaultColumns = record.getRendering().get('defaultColumns');
                    if (defaultColumns) {
                        Ext.Array.each(columns, function (column) {
                            column.hidden = !Ext.Array.contains(defaultColumns, column.dataIndex);
                        });
                    }
                }
                grid.setColumns(columns);

                if (!me.isWidget) {
                    me.updateVisibleColumnKeys();
                }
            });


            if (!me.isWidget) {
                // when limit events number changed reload data
                vm.bind('{eventsMaxRows}', function (limit) {
                    me.loadData();
                })

                // when global filter term is changed apply filter
                vm.bind('{globalFilter}', function (term) {
                    me.applyGlobalFilter(term);
                })

                // set the number of filtered records
                store.on('filterchange', function () {
                    vm.set('recordsFiltered', store.count());
                });
            }
        },

        loadData: function (cb) {
            var me = this,
                vm = me.getViewModel(),
                view = me.getView().up('report') || me.getView().up('widget-report'),
                store = view.down('grid').getStore(),
                record = vm.get('record'),
                since = ReportsUtil.computeSince(me.getViewModel().get('route')),
                limit = vm.get('eventsMaxRows'),
                userConditions, sinceCondition;

            if (!record) { return; }

            view.down('grid').getStore().loadData([]);

            userConditions = record.userConditions();

            /**
             * MFW-809 - removed time_stamp conditions from reports
             * will fetch latest max 3000 records
             *
             * keep stil greater than condition for widgets, where it makes sense
             */
            if (me.isWidget) {
                // remove condition if exists
                sinceCondition = userConditions.findBy(function (c) {
                    return c.get('column') === 'time_stamp' && c.get('operator') === 'GT';
                });
                if (sinceCondition >= 0) {
                    userConditions.removeAt(sinceCondition);
                }
                // add new greater than condition
                record.userConditions().add({
                    column: 'time_stamp',
                    operator: 'GT',
                    value: since
                });
            }

            view.mask({xtype: 'loadmask'});

            // reset total and filtered counters
            if (!me.isWidget) {
                vm.set({
                    recordsTotal: 0,
                    recordsFiltered: 0
                });                
                
                //Pass the limit into the LIMIT param for events
                record.data.queryEvents.limit = limit;

            }
            /**
             * data is an array of objects {column_name: value}
             * textString is defined in report rendering settings like:
             * text ... {0}... {1} end text
             */
            ReportsUtil.fetchReportData(record, limit, function (data) {
                view.unmask();
                if (data === 'error') { return; }
                store.loadData(data);

                if (!me.isWidget) {
                    // set new total count
                    vm.set('recordsTotal', data.length);
                    // apply global filter using pre existing value if set
                    me.applyGlobalFilter(vm.get('globalFilter'));
                }
                if (cb) { cb(); }
            });
        },


        /**
         * Creates a list of visible columns used along with global filtering
         * When a column is hidden/shown the columns list is updated and the global filter triggers
         */
        updateVisibleColumnKeys: function () {
            var me = this;
            if (me.isWidget) { return; }

            var view = me.getView(),
                vm = me.getViewModel(),
                grid = me.getView().down('grid'),
                visibleColumns = grid.getColumns(function (c) { return !c.getHidden(); }),
                columnsKeys = [];

            Ext.Array.each(visibleColumns, function (col) {
                columnsKeys.push(col.getDataIndex());
            });
            // store visible columns in the controller scope
            me.visibleColumnsKeys = columnsKeys;
            me.applyGlobalFilter(vm.get('globalFilter'));
        },


        /**
         * Finds all the records matching at least a column value with the filter term
         * All column values are converted to string/lowercase before match test
         * @param {string} term
         */
        applyGlobalFilter: function (term) {
            var me = this,
                view = me.getView(),
                eventsGrid = view.down('grid'),
                eventsStore = eventsGrid.getStore();

            if (!eventsGrid) { return; }

            /**
             * use the Filer class to attach an id to it so
             * it does not interfere with other filters in the grid
             */
            var globalFilter = new Ext.util.Filter({
                id: 'global',
                filterFn: function (rec) {
                    var match = false;
                    /**
                     * iterate each column and find a possible match
                     * match "true" will show the record, hide otherwise
                     */
                    me.visibleColumnsKeys.forEach(function (key) {
                        var value = rec.get(key);
                        if (key === 'time_stamp' || !value || match) { return; }

                        if (value.toString().toLowerCase().indexOf(term.toLowerCase()) >= 0) {
                            match = true;
                        }
                    });
                    return match;
                }
            });

            /**
             * even the filter is added it will actually update the filter with id "global"
             * as specified above
             */
            eventsStore.getFilters().add(globalFilter);

            // update the filtered records counter
            me.getViewModel().set('recordsFilters', eventsStore.count());
        },

        showContextMenu: function (grid, location) {
            var me = this;
            if (me.isWidget) { return; }

            var cell = location.cell,
                value = cell.getValue(),
                event = location.event,
                menu = grid.down('menu');

            menu.down('component').setHtml(location.column.getText() + ' = ' + cell.getRawValue());
            menu.contextData = {
                column: location.column.getDataIndex(),
                operator: Ext.isString(value) ? 'LIKE' : 'EQ',
                value: Ext.isString(value) ? ('%' + value + '%') : value
            };
            menu.showBy(cell);
            event.stopEvent();
        },

        contextMenuHandler: function (item) {
            var me = this,
                vm = me.getViewModel(),
                grid = me.getView().down('grid'),
                route = vm.get('route')
                data = item.up('menu').contextData;

            if (item.action === 'query') {
                route.conditions.push(data);
                Mfw.app.redirectTo(ReportsUtil.routeToQuery(route));
            }
            if (item.action === 'filter') {
                var activeFilters = grid.getPlugin('gridfilters').getActiveFilter();
                grid.getPlugin('gridfilters').setActiveFilter(null);

                if (!Ext.isArray(activeFilters)) {
                    activeFilters = [];
                }

                var existingFilter = Ext.Array.findBy(activeFilters, function(filter) {
                    return filter.property === data.column
                });

                if (existingFilter) {
                    existingFilter = {
                        property: data.column,
                        operator: data.operator === 'LIKE' ? 'like' : '==',
                        value: data.operator === 'LIKE' ? data.value.replace(/%/g, '') : data.value
                    }
                } else {
                    activeFilters.push({
                        property: data.column,
                        operator: data.operator === 'LIKE' ? 'like' : '==',
                        value: data.operator === 'LIKE' ? data.value.replace(/%/g, '') : data.value
                    })
                }
                grid.getPlugin('gridfilters').setActiveFilter(activeFilters);
            }
            item.up('menu').hide();
        },

        hideContextMenu: function (menu) {
            menu.contextData = null
        },

    }
});
