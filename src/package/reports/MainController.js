Ext.define('Mfw.reports.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.reports',

    routes: {
        'reports:query': {
            before: 'onBefore',
            action: 'onAction',
            conditions: { ':query' : '(.*)' }
        }
    },

    onBefore: function () {
        var me = this, query, action,
            vm = me.getViewModel();

        if (arguments.length === 1) {
            action = arguments[0];
        } else {
            query = arguments[0].replace('?', '');
            action = arguments[1];
        }

        if (!query) {
            // if no condition parameters, load those condition params from view model and redirect
            Mfw.app.redirectTo('reports?' + ReportsUtil.conditionsToQuery(vm.get('conditions')));
            action.stop();
        } else {
            vm.set('conditions', ReportsUtil.queryToConditions(query));
            action.resume();
        }
    },

    onAction: function () {
        Mfw.app.viewport.setActiveItem('reports');
    },

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
