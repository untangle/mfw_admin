Ext.define('Mfw.dashboard.widget.Report', {
    extend: 'Ext.Container',
    alias: 'widget.widget-report',

    viewModel: {},

    width: 500,
    height: 300,

    margin: 8,

    cls: 'mfw-widget',
    bodyStyle: {
        background: '#EEE'
    },
    // shadow: true,

    layout: 'fit',

    items: [{
        xtype: 'toolbar',
        docked: 'top',
        shadow: false,
        padding: '0 8',
        items: [{
            xtype: 'container',
            style: 'font-weight: 100;',
            bind: {
                html: '{record.name}'
            }
        }, '->', {
            iconCls: 'md-icon-refresh',
            ui: 'round',
            handler: 'loadData'
        }]
    }],

    controller: {
        init: function (widget) {
            var me = this, viewModel = widget.getViewModel(),
                record = viewModel.get('record'), activeItem;

            switch (record.get('type')) {
                case 'TEXT': widget.add({ xtype: 'text-report' }); break;
                case 'EVENTS': widget.add({ xtype: 'events-report' }); break;
                default: widget.add({ xtype: 'chart-report' });
            }
            // widget.setActiveItem(activeItem);


            viewModel.bind('{route}', function (route) {
                var conditionSince, userConditions = [];

                if (route.since) {
                    conditionSince = Ext.Date.subtract(Util.serverToClientDate(new Date()), Ext.Date.HOUR, route.since);
                } else {
                    conditionSince = Ext.Date.subtract(Util.serverToClientDate(new Date()), Ext.Date.HOUR, 1);
                }

                userConditions.push({
                    column: 'time_stamp',
                    operator: 'GT',
                    value: conditionSince.getTime()
                });
                Ext.Array.each(route.conditions, function (cond) {
                    userConditions.push(cond);
                });
                record.userConditions().loadData(userConditions);
                viewModel.set('record', record);
                me.loadData();
            }, me, { deep: true });
        },

        loadData: function () {
            var me = this, view = me.getView(), viewModel = me.getViewModel(),
                record = viewModel.get('record'), controller;

            switch (record.get('type')) {
                case 'TEXT': controller = view.down('text-report').getController(); break;
                case 'EVENTS': controller = view.down('events-report').getController(); break;
                default: controller = view.down('chart-report').getController();
            }
            controller.loadData();
        }
    }


});
