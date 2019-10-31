Ext.define('Mfw.dashboard.widget.Report', {
    extend: 'Ext.Container',
    alias: 'widget.widget-report',

    viewModel: {
        data: {
            widget: null,
            record: null
        }
    },

    // height: 300,

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
            hidden: true,
            bind: {
                hidden: '{widget.interval === 0 || processing}'
            }
        }, {
            xtype: 'component',
            html: '<i class="fa fa-spinner fa-spin fa-fw" style="font-size: 12px; margin: 0 2px;"></i>',
            hidden: true,
            bind: {
                hidden: '{!processing}'
            }
        }, {
            iconCls: 'md-icon-refresh',
            ui: 'round',
            handler: 'reload',
            disabled: true,
            bind: {
                disabled: '{processing}'
            }
        }]
    }, {
        xtype: 'component',
        docked: 'top',
        margin: '0 16 16 16',
        style: 'background: #DDD; font-size: 12px; line-height: 32px; padding: 0 8px; border-radius: 3px;',
        hidden: true,
        bind: {
            hidden: '{!record || !invalidConditionsWarning}',
            html: '{invalidConditionsWarning}'
        },
    }],
    listeners: {
        removed: 'onRemoved'
    },

    controller: {
        init: function (widget) {
            var me = this, viewModel = widget.getViewModel(),
                record = viewModel.get('record');

            widget.tout = null;

            switch (record.get('type')) {
                case 'TEXT':
                    widget.add({ xtype: 'text-report' }); widget.setUserCls('widget-text'); break;
                case 'EVENTS':
                    widget.add({ xtype: 'events-report' }); widget.setUserCls('widget-events'); break;
                case 'SERIES':
                case 'CATEGORIES_SERIES':
                    widget.add({ xtype: 'chart-report' }); widget.setUserCls('widget-series'); break;
                default: widget.add({ xtype: 'chart-report' }); widget.setUserCls('widget-pies');
            }

            viewModel.bind('{route}', function (route) {
                var conditionSince, userConditions = [], invalidConditions = [];

                // avoid dasboard activity if not on Dashboard
                if (!Mfw.app.viewport.getActiveItem().isXType('dashboard')) { return; }

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
                    if (record._validColumns.indexOf(cond.column) < 0) {
                        if (invalidConditions.indexOf(cond.column) < 0) {
                            invalidConditions.push(cond.column);
                        }
                    } else {
                        userConditions.push(cond);
                    }
                });

                if (invalidConditions.length > 0) {
                    viewModel.set('invalidConditionsWarning', '<i class="fa fa-info-circle"></i> <strong>' + invalidConditions.join(', ') + '</strong> condition(s) ommited!');
                } else {
                    viewModel.set('invalidConditionsWarning', null);
                }

                record.userConditions().loadData(userConditions);
                viewModel.set('record', record);

                WidgetsPipe.add(widget);
            }, me, { deep: true });
        },

        reload: function () {
            var me = this;
            WidgetsPipe.add(me.getView());
        },

        onRemoved: function (widget) {
            // abort ongoing async calls if removed
            var reportName = widget.getViewModel().get('record.name');

            Ext.Object.each(Ext.Ajax.requests, function (key, req) {
                if (req.url.startsWith('/api/reports') && req.reportName === reportName) {
                    // Ext.defer(function () {
                        req.abort();
                    // }, 200);
                }
            });
            if (widget.tout) {
                clearTimeout(widget.tout);
            }
        }
    }


});
