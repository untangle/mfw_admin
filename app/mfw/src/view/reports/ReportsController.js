Ext.define('Mfw.view.ReportsController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.reports',

    onInitialize: function (view) {
        var me = this, vm = view.getViewModel();
        // me.chart = view.down('chart-time');
        // vm.bind('{reportsConditions}', function (conditions) {
        //     console.log('BINDING FIRED');
        // });
        vm.bind('{conditions}', function (fields) {
            // console.log('BINDING');
            // me.generateConditionsButtons(reportsView, fields)
        });
    },

    onRefresh: function () {
        var me = this,
            vm = me.getViewModel(),
            chart = me.getView().down('chart');

        chart.chart.update({
            series: Util.generateTimeSeries()
        }, true);


    },

    onSelectionChange: function (list, node) {
        var me = this, record,
            chart = me.getView().down('chart');
        if (!node || !node.get('href')) { return; }
        if (!node.isLeaf() && !node.isExpanded()) {
            Ext.defer(function () { node.expand(true); }, 100);
        }
        if (node.isLeaf()) {
            record = Ext.getStore('reports').findRecord('_href', node.get('href'));
            chart.getViewModel().set('record', record);
        }
        Mfw.app.redirectTo(node.get('href'));
    }

});
