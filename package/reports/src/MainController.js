Ext.define('Mfw.reports.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.reports',

    onInitialize: function (view) {
        var me = this, vm = view.getViewModel();
        // me.chart = view.down('chart-time');
        // vm.bind('{reportsConditions}', function (conditions) {
        //     console.log('BINDING FIRED');
        // });
        var reps = Ext.create('Mfw.store.Reports');
        reps.loadRawData([
            {
                "uniqueId" : "network-oyzBpGMc",
                "name": "TIME SERIES",
                "category": "Network",
                "description": "Time Series description",
                "displayOrder": 100,
                "readOnly": true,
                "type": "STATIC_SERIES",
                "rendering": {
                    "type": "areaspline"
                }
            }, {
                "uniqueId" : "network-oyzBpGMc",
                "name": "CATEGORIES",
                "category": "Network",
                "description": "Categories description",
                "displayOrder": 100,
                "readOnly": true,
                "type": "CATEGORIES",
                "rendering": {
                    "type": "pie"
                }
            }
        ]);
        console.log(reps);
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
