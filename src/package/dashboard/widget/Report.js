Ext.define('Mfw.dashboard.widget.Report', {
    extend: 'Ext.Container',
    alias: 'widget.widget-report',

    viewModel: {
        data: {
            widget: null,
            record: null
        }
    },

    width: 500,
    height: 300,

    margin: 8,

    cls: 'mfw-widget',
    // shadow: true,

    layout: 'fit',

    items: [{
        xtype: 'toolbar',
        style: { background: 'transparent' },
        docked: 'top',
        shadow: false,
        padding: '0 8 0 16',
        items: [{
            xtype: 'container',
            style: 'font-weight: 100;',
            bind: {
                html: '<a href="#reports?{record._route}" style="color: #333; text-decoration: none; border-bottom: 1px #999 solid; display: inline-block;">{record.name}</a>'
            }
        }, '->', {
            xtype: 'component',
            itemId: 'timer',
            margin: '0 5 0 0',
            html: ''
        }, {
            iconCls: 'md-icon-refresh',
            ui: 'round',
            handler: 'loadData'
        }]
    }],
    listeners: {
        removed: function (widget) {
            if (widget.tout) {
                clearTimeout(widget.tout);
            }
        }
    },

    controller: {
        init: function (widget) {
            var me = this, viewModel = widget.getViewModel(),
                record = viewModel.get('record');

            widget.tout = null;

            switch (record.get('type')) {
                case 'TEXT':
                    widget.add({ xtype: 'text-report' }); widget.setWidth(300); break;
                case 'EVENTS':
                    widget.add({ xtype: 'events-report' }); widget.setWidth(600); break;
                case 'SERIES':
                case 'CATEGORIES_SERIES':
                    widget.add({ xtype: 'chart-report' }); widget.setWidth(500); break;
                default: widget.add({ xtype: 'chart-report' }); widget.setWidth(400);
            }

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
            var me = this,
                view = me.getView(),
                timer = view.down('#timer'),
                viewModel = me.getViewModel(),
                widget = viewModel.get('widget'),
                record = viewModel.get('record'),
                controller;

            switch (record.get('type')) {
                case 'TEXT': controller = view.down('text-report').getController(); break;
                case 'EVENTS': controller = view.down('events-report').getController(); break;
                default: controller = view.down('chart-report').getController();
            }

            if (view.tout) {
                clearInterval(view.tout);
            }
            view.tout = setTimeout(function () {
                me.loadData();
            }, widget.get('interval') * 1000);

            timer.setHtml('');
            timer.setHtml('<div class="wrapper">' +
                          '<div class="pie spinner" style="animation-duration: ' + widget.get('interval') + 's;"></div>' +
                          '<div class="pie filler" style="animation-duration: ' + widget.get('interval') + 's;"></div>' +
                          '<div class="mask" style="animation-duration: ' + widget.get('interval') + 's;"></div>' +
                          '</div>');

            controller.loadData();
        }
    }


});
