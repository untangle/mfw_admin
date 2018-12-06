Ext.define('Mfw.reports.ReportController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.report',

    init: function (view) {
        var me = this, viewModel = me.getViewModel();

        viewModel.bind('{route}', function (route) {
            var record,
                activeItem = 'noselection-report',
                userConditions = [],
                conditionSince = Ext.Date.clearTime(Util.serverToClientDate(new Date())); // today

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

            if (!route.psince && !route.since) {
                conditionSince = parseInt(conditionSince.getTime(), 10);
            }

            // set time conditions
            if (route.psince && !route.since) {
                switch (route.psince) {
                    case '1h': conditionSince = Ext.Date.subtract(Util.serverToClientDate(new Date()), Ext.Date.HOUR, 1); break;
                    case '6h': conditionSince = Ext.Date.subtract(Util.serverToClientDate(new Date()), Ext.Date.HOUR, 6); break;
                    // case 'today': conditionSince = Ext.Date.clearTime(Util.serverToClientDate(new Date())); break;
                    case 'yesterday': conditionSince = Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, 1); break;
                    case 'thisweek': conditionSince = Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, (Util.serverToClientDate(new Date())).getDay()); break;
                    case 'lastweek': conditionSince = Ext.Date.subtract(Ext.Date.clearTime(Util.serverToClientDate(new Date())), Ext.Date.DAY, (Util.serverToClientDate(new Date())).getDay() + 7); break;
                    case 'month': conditionSince = Ext.Date.getFirstDateOfMonth(Util.serverToClientDate(new Date())); break;
                    default: conditionSince = Ext.Date.clearTime(Util.serverToClientDate(new Date())); // today
                }
                conditionSince = conditionSince.getTime();
            }

            if (route.since) {
                conditionSince = route.since;
            }

            userConditions.push({
                column: 'time_stamp',
                operator: 'GE',
                value: conditionSince
            });

            if (route.until) {
                userConditions.push({
                    column: 'time_stamp',
                    operator: 'LE',
                    value: route.until
                });
            }

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

        if (!record) { return; }

        switch (record.get('type')) {
            case 'TEXT': controller = view.down('text-report').getController(); break;
            case 'EVENTS': controller = view.down('events-report').getController(); break;
            default: controller = view.down('chart-report').getController();
        }

        controller.loadData();
    },


    onSettings: function () {
        var me = this;
        if (!me.setingsSheet) {
            me.setingsSheet = me.getView().add({
                xtype: 'settings-sheet',
                owner: me.getView()
            });
        }
        me.setingsSheet.show();
    },

    onData: function () {
        var me = this;
        if (!me.dataSheet) {
            me.dataSheet = me.getView().down('data-sheet');
        }
        me.dataSheet.show();
    }

});
