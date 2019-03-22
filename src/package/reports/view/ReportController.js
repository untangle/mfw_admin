Ext.define('Mfw.reports.ReportController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.report',

    init: function (view) {
        var me = this, viewModel = me.getViewModel();

        viewModel.bind('{route}', function (route) {

            if (window.location.hash.indexOf('#reports') < 0) { return; }

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
