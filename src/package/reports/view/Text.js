Ext.define('Mfw.reports.Text', {
    extend: 'Ext.Panel',
    alias: 'widget.text-report',

    viewModel: {
        data: {
            text: ''
        }
    },

    items: [{
        xtype: 'container',
        padding: 16,
        bind: {
            html: '<h2 style="font-weight: 100;">{text}</h2>'
        }
    }],

    controller: {
        init: function (view) {
            var me = this;

            view.getViewModel().bind('{record}', function (record) {
                if (!record || record.get('type') !== 'TEXT') {
                    return;
                }
                // me.loadData();
            });
        },

        loadData: function (cb) {
            var me = this,
                view = me.getView().up('report') || me.getView().up('widget-report'),
                viewModel = me.getViewModel(),
                record = viewModel.get('record');

            if (!record) { return; }

            view.mask({xtype: 'loadmask'});
            /**
             * data is an array of objects {column_name: value}
             * textString is defined in report rendering settings like:
             * text ... {0}... {1} end text
             */
            ReportsUtil.fetchReportData(record, function (data) {
                var args = [];

                if (!record.getRendering() || !record.getRendering().get('textString')) {
                    console.error('Invalid report settings detected. textString rendering missing!');
                    viewModel.set('text', 'Invalid report settings!');
                    return;
                }

                args.push(record.getRendering().get('textString'));

                Ext.Array.each(data, function (d) {
                    Ext.Object.each(d, function (key, val) {
                        args.push(val);
                    });
                });

                if (cb) { cb(); }

                viewModel.set('data', data);
                viewModel.set('text', Ext.String.format.apply(this, args));

                view.unmask();
            });
        }
    }


});
