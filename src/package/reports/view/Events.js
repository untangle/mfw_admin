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
        // plugins: {
        //     gridfilters: true
        // },
        // bind: '{events}'
        store: {
            model: 'Mfw.model.Session',
            sorters: [{
                property: 'time_stamp',
                direction: 'DESC'
            }]
        }
    }],

    controller: {
        init: function (view) {
            var me = this,
                grid = view.down('grid');


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
            if (!me.getView().up('widget-report')) {
                view.add(                {
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
                        xtype: 'event-details',
                    }],
                    hidden: true,
                    bind: {
                        hidden: '{!list.selection}'
                    }
                });
            }


            view.getViewModel().bind('{record}', function (record) {
                var tableNames = [],
                    columns = [], defaultColumns, columnRenames;

                grid.getStore().loadData([]);

                if (!record || record.get('type') !== 'EVENTS') {
                    // clear data
                    grid.getStore().loadData([]);
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
                                    column.text = columnRenames[column.dataIndex];
                                }
                            }
                            columns.push(Ext.clone(column)); // !!!! important to clone the value to not modify reference
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
            });
        },

        loadData: function (cb) {
            var me = this,
                view = me.getView().up('report') || me.getView().up('widget-report'),
                viewModel = me.getViewModel(),
                record = viewModel.get('record'),
                since = ReportsUtil.computeSince(me.getViewModel().get('route')),
                userConditions, sinceCondition;

            if (!record) { return; }

            view.down('grid').getStore().loadData([]);

            // remove existing since condition
            userConditions = record.userConditions();
            sinceCondition = userConditions.findBy(function (c) {
                return c.get('column') === 'time_stamp' && c.get('operator') === 'GT';
            });
            if (sinceCondition >= 0) {
                userConditions.removeAt(sinceCondition);
            }

            // add updated since
            record.userConditions().add({
                column: 'time_stamp',
                operator: 'GT',
                value: since
            });

            /**
             * data is an array of objects {column_name: value}
             * textString is defined in report rendering settings like:
             * text ... {0}... {1} end text
             */
            view.mask({xtype: 'loadmask'});
            ReportsUtil.fetchReportData(record, function (data) {
                view.unmask();
                if (data === 'error') { return; }
                view.down('grid').getStore().loadData(data);
                if (cb) { cb(); }
            });
        }
    }

});
