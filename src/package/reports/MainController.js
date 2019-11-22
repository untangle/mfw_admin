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
        var action,
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
                } else {
                    console.warn('Unable to load reports');
                    action.stop();
                }
            });
        } else {
            action.resume();
        }
    },

    onAction: function (query) {
        var me = this,
            vm = me.getViewModel(),
            tree = me.getView().down('treelist'),
            queryObject,
            nodeRoute, // the route used for finding the node in the tree
            node;

        if (Mfw.app.viewport.getActiveItem().xtype !== 'reports' ) {
            Mfw.app.viewport.setActiveItem('reports');
        }

        if (!query) {
            Mfw.app.redirectTo(ReportsUtil.routeToQuery(vm.get('route')));
            return;
        }


        // important to set route before treeSelectoin below
        vm.set('route', ReportsUtil.queryToRoute(query));

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

        // depress data btn which also hides the data grid
        view.down('#dataBtn').setPressed(false);
        // reset global filter when leaving Reports
        view.down('searchfield').setValue('');
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

        Mfw.app.redirectTo(ReportsUtil.routeToQuery(route));
        // viewModel.set('route', route);
    },


    filterReports: function (field, value) {
        var me = this,
            tree = me.getView().down('treelist'),
            store = tree.getStore(),
            root = store.getRoot();
            // expandedNode = null;

        store.clearFilter();

        if (value) {
            // find expanded node if exists
            // root.eachChild(function (child) {
            //     if (child.isExpanded()) {
            //         expandedNode = child;
            //     }
            // });

            tree.setSingleExpand(false);
            root.expandChildren(true);
            store.filterBy(function (node) {
                var v = new RegExp(value, 'i');
                return node.isLeaf() ? v.test(node.get('text')) : false;
            });
        } else {
            tree.setSingleExpand(true);
            root.collapseChildren(true);
        }
    },

    // not used
    exportReports: function () {
        var out, arr = [], data, link;

        Ext.getStore('reports').each(function (record) {
            data = record.getData();
            Ext.Object.merge(data, record.getAssociatedData());
            delete data.userConditions; // remove eventually user conditions
            arr.push(data);
        });

        Util.sanitize(arr);

        out = 'data:text/json;charset=utf-8,' + Ext.JSON.encode(arr);

        out = encodeURI(out);

        link = document.createElement('a');
        link.setAttribute('href', out);
        link.setAttribute('download', 'reports.json');
        link.click();
    },

    /**
     * Sets predefined EVENTS limit
     */
    setEventsLimit: function (cmp) {
        var me = this;
        me.getViewModel().set('eventsMaxRows', cmp.value);
        cmp.up('menu').hide();
    },

    /**
     * Sets a custom EVENTS limit
     */
    setCustomEventsLimit: function (evt, field) {
        var me = this;
        if (!field.isValid() || !field.getValue()) {
            return;
        }
        me.getViewModel().set('eventsMaxRows', field.getValue());
        field.setValue('');
        field.blur();
        field.up('menu').hide();
    },


    /**
     * Set new global filter term in view model
     * This will trigger the filtering on the Events grid
     */
    onGlobalFilterChange: function (field, value) {
        var me = this;
        me.getViewModel().set('globalFilter', value);
    }
});
