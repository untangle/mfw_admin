Ext.define('Mfw.reports.ReportController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.report',

    init: function (view) {
        var me = this, viewModel = me.getViewModel();

        viewModel.bind('{route}', function (route) {
            var record, activeItem = 'noselection-report', userConditions = [];

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

            userConditions.push({
                column: 'time_stamp',
                operator: 'GE',
                value: route.since
            });

            Ext.Array.each(route.conditions, function (cond) {
                userConditions.push(cond);
            });

            record.userConditions().loadData(userConditions);


            viewModel.set('record', record);
            me.loadData();
            // Mfw.app.redirectTo(ReportsUtil.routeToQuery(route));
        }, me, {
            deep: true
        });

        // vm.bind('{route}', function (route) {
        //     console.log(route);
        // }, me, { deep: true });


        // vm.bind('{record}', function (record) {
        //     var type, activeItem;

        //     if (!record) {
        //         view.setActiveItem('noselection-report');
        //         return;
        //     }

        //     type = record.get('type');
        //     switch (type) {
        //         case 'TEXT': activeItem = 'text-report'; break;
        //         case 'EVENTS': activeItem = 'events-report'; break;
        //         default: activeItem = 'chart-report';
        //     }
        //     view.setActiveItem(activeItem);
        // });
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
