Ext.define('Mfw.reports.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.reports',

    routes: {
        'reports': {
            action: 'onAction'
        },
        'reports:query': {
            before: 'onBefore',
            action: 'onAction',
            conditions: { ':query' : '(.*)' }
        }
    },

    /**
     * Check if reports store is loaded, otherwise load the store before continuing
     */
    onBefore: function () {
        var me = this, action,
            reportsStore = Ext.getStore('reports');
        if (arguments.length === 1) {
            action = arguments[0];
        } else {
            action = arguments[1];
        }

        if (!reportsStore.isLoaded()) {
            reportsStore.load(function (records, operation, success) {
                if (success) {
                    action.resume();
                    me.setBinding();
                } else {
                    console.warn('Unable to load reports');
                    action.stop();
                }
            });
        }
    },

    onAction: function (query) {
        var me = this,
            vm = me.getViewModel(),
            tree = me.getView().down('treelist'),
            queryObject,
            nodeRoute, // the route used for finding the node in the tree
            node;

        if (!query) {
            Mfw.app.viewport.setActiveItem('reports');
            Mfw.app.redirectTo(ReportsUtil.routeToQuery(vm.get('route')));
            return;
        }
        // set Reports view active in case is not already
        if (Mfw.app.viewport.getActiveItem().xtype !== 'reports' ) {
            Mfw.app.viewport.setActiveItem('reports');
        }

        queryObject = Ext.Object.fromQueryString(query);
        if (queryObject.cat) {
            nodeRoute = 'cat=' + queryObject.cat;
        }
        if (queryObject.rep) {
            nodeRoute += '&rep=' + queryObject.rep;
        }

        if (nodeRoute) {
            node = tree.getStore().findNode('route', nodeRoute);
            if (node) {
                // select the node based on route category/report name
                tree.setSelection(node);
            }
        }

        vm.set('route', ReportsUtil.queryToRoute(query));
        // console.log(vm.get('route'));
    },

    setBinding: function () {
        var viewModel = this.getViewModel();
        viewModel.bind('{route}', function (route) {
            // console.log('BINDING FIRED', route);
            if (route.cat && route.rep) {
                var rep = Ext.getStore('reports').findRecord('_route', 'cat=' + route.cat + '&rep=' + route.rep, 0, false, false, true);
                viewModel.set('record', rep);
            } else {
                viewModel.set('record', null);
            }
            Mfw.app.redirectTo(ReportsUtil.routeToQuery(route));
        }, this, {
            deep: true
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

    onDeactivate: function (view) {
        var viewModel = view.getViewModel(),
            tree = view.down('treelist'),
            route = viewModel.get('route');

        tree.setSelection(null);
        tree.getStore().getRoot().collapse(true);

        route.rep = null;
        route.cat = null;

        viewModel.set({
            route: route,
            record: null
        });
    },

    onSelectionChange: function (list, node) {
        var me = this, viewModel = me.getViewModel();

        if (!node || !node.get('route')) { return; }
        // if (!node.isLeaf() && !node.isExpanded()) {
        //     Ext.defer(function () { node.expand(true); }, 100);
        // }
        var route = viewModel.get('route');
        route.rep = node.get('rep');
        route.cat = node.get('cat');

        viewModel.set('route', route);
    }

});
