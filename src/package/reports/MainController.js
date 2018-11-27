Ext.define('Mfw.reports.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.reports',

    routes: {
        // 'reports': {
        //     before: 'onBefore',
        //     action: 'onAction'
        // },
        // 'reports:conditions': {
        //     before: 'onBefore',
        //     action: 'onAction',
        //     conditions: { ':conditions' : '(.*)' }
        // },
        // 'reports/:category': {
        //     // before: 'onBefore',
        //     action: 'onAction'
        // },
        // 'reports/:category/:name': {
        //     before: 'onBefore',
        //     action: 'onAction',
        //     // conditions: { ':query' : '(.*)' }
        // }
        'reports:query': {
            // before: 'onBefore',
            action: 'onAction',
            conditions: { ':query' : '(.*)' }
        }
    },

    onBefore: function () {
        var me = this, query, queryObj, route='reports?', action,
            vm = me.getViewModel();
        // console.log(query, category);
        // var action;
        // Ext.Array.each(arguments, function (arg, idx) {
        //     if (!Ext.isString(arg)) {
        //         action = arg;
        //     }
        // });

        // action.resume();
        if (arguments.length === 1) {
            action = arguments[0];
        } else {
            // query = Ext.Object.fromQueryString(arguments[0]);
            query = arguments[0];
            action = arguments[1];
        }
        vm.set('conditions', ReportsUtil.queryToConditions(query));
        // if (query) {
        //     console.log(Ext.Object.fromQueryString(query));
        // }

        // if (query) {
        //     queryObj = Ext.Object.fromQueryString(query);
        //     if (queryObj.c) {
        //         route += 'c=' + queryObj.c
        //     }
        //     if (queryObj.r) {
        //         route += '&r=' + queryObj.r
        //     }
        // }
        // // Mfw.app.redirectTo('reports?' + query + ReportsUtil.conditionsToQuery(vm.get('conditions')));
        // // action.resume();
        // console.log(query.indexOf('since='));
        // if (!query || query.indexOf('since=') === -1) {
        //     // if no condition parameters, load those condition params from view model and redirect
        //     Mfw.app.redirectTo(ReportsUtil.conditionsToQuery(query, vm.get('conditions')));
        //     action.stop();
        // } else {M
        //     vm.set('conditions', ReportsUtil.queryToConditions(query));
        //     action.resume();
        // }
    },

    onAction: function (query) {
        var me = this, vm = me.getViewModel(),
            tree = me.getView().down('treelist');

        // todo expand tree on given cat/rep from query

        // var q = Ext.Object.fromQueryString(query);
        // if (q.cat) {

        // }
        // console.log(q);
        // console.log('action', tree);

        // console.log(query, ReportsUtil.queryToConditions(query));
        if (query) {
            vm.set('conditions', ReportsUtil.queryToConditions(query));
        }
        Mfw.app.viewport.setActiveItem('reports');
    },

    init: function (view) {
        var me = this, vm = view.getViewModel();
        // me.chart = view.down('chart-time');

        console.log(vm);

        vm.bind('{conditions}', function (conditions) {
            console.log('BINDING FIRED', conditions);
            Mfw.app.redirectTo(ReportsUtil.conditionsToQuery(conditions));
        }, me, {
            deep: true
        });
        // var reps = Ext.create('Mfw.store.Reports');

        Ext.getStore('reports').load();

        // reps.loadRawData();
        // vm.bind('{conditions}', function (fields) {
        //     // console.log('BINDING');
        //     // me.generateConditionsButtons(reportsView, fields)
        // });
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
        if (!node || !node.get('route')) { return; }
        if (!node.isLeaf() && !node.isExpanded()) {
            Ext.defer(function () { node.expand(true); }, 100);
        }

        console.log(node.get('route'));
        // if (node.isLeaf()) {
        //     record = Ext.getStore('reports').findRecord('_href', node.get('href'));
        //     chart.getViewModel().set('record', record);
        // }
        Mfw.app.redirectTo(node.get('route'));
    }

});
