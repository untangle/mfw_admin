Ext.define('Mfw.reports.Events', {
    extend: 'Ext.Panel',
    alias: 'widget.events-report',

    viewModel: {
        stores: {
            events: {
                data: '{data}'
            }
        }
    },

    layout: 'fit',

    items: [{
        xtype: 'grid',
        // plugins: {
        //     gridfilters: true
        // },
        bind: '{events}'
    }],

    controller: {
        init: function (view) {
            var me = this,
                viewModel = me.getViewModel(),
                grid = view.down('grid');

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
                record = viewModel.get('record');

            if (!record) { return; }

            /**
             * data is an array of objects {column_name: value}
             * textString is defined in report rendering settings like:
             * text ... {0}... {1} end text
             */
            viewModel.set('data', []);
            view.mask({xtype: 'loadmask'});
            ReportsUtil.fetchReportData(record, function (data) {
                viewModel.set('data', data);
                if (cb) { cb(); }
                view.unmask();
            });
        }
    }

});
