Ext.define('Mfw.reports.ReportController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.report',

    init: function (view) {
        var me = this, vm = me.getViewModel(),
            chartView = view.down('chart-report');

        // chartView.on('painted', function () {
        //     console.log('painted');
        //     // vm.set('record', vm.get('record'));


        //     view.getViewModel().bind('{record}', function (record) {
        //         console.log(chartView.chart, record);
        //         // if (!record) { return; }
        //         me.loadData();
        //     });


        //     // Mfw.app.redirectTo(window.location.hash, { force: true });
        // });


        vm.bind('{record}', function (record) {
            var type = record.get('type'), activeItem;
            console.log(type);
            switch (type) {
                case 'TEXT': activeItem = 'text-report'; break;
                case 'EVENTS': activeItem = 'events-report'; break;
                default: activeItem = 'chart-report';
            }
            view.setActiveItem(activeItem);

           // if (!record) { return; }
            // me.loadData();
        });


        // view.getViewModel().bind('{record.rendering}', function (r) {
        //     me.update();
        // }, me, { deep: true });
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
    }

});
