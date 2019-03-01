Ext.define('Mfw.reports.Events', {
    extend: 'Ext.Panel',
    alias: 'widget.events-report',

    viewModel: {
        // data: {
        //     data: '{data}'
        // }
        // stores: {
        //     events: {
        //         data: '{data}'
        //     }
        // }
    },

    layout: 'fit',

    items: [{
        xtype: 'grid',
        reference: 'list',
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
                viewModel = me.getViewModel(),
                grid = view.down('grid');

            // if not widget add details panel
            if (!me.getView().up('widget-report')) {
                view.add({
                    xtype: 'event-details',
                    docked: 'right',
                    width: 400,
                    resizable: {
                        split: true,
                        edges: 'west'
                    },
                    hidden: true,
                    bind: {
                        hidden: '{!list.selection}'
                    }
                });
            }


            view.getViewModel().bind('{record}', function (record) {
                if (!record) {
                    // clear data when deactivating reports
                    viewModel.set('data', []);
                    return;
                }
                if (record.get('type') !== 'EVENTS') {
                    return;
                }
                grid.setColumns(Table.sessions.columns);
                // me.loadData();
            });
        },

        loadData: function (cb) {
            var me = this,
                // grid = me.getView().down('grid'),
                view = me.getView().up('report') || me.getView().up('widget-report'),
                viewModel = me.getViewModel(),
                record = viewModel.get('record'),
                since = ReportsUtil.computeSince(me.getViewModel().get('route')),
                userConditions, sinceCondition;

            if (!record) { return; }

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
            viewModel.set('data', []);
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
