Ext.define('Mfw.dashboard.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashboard',

    routes: {
        // '*': function () { },
        'dashboard:query': {
            before: 'onBefore',
            action: 'onAction',
            conditions: { ':query' : '(.*)' }
        }
    },

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
            vm = me.getViewModel();

        if (Mfw.app.viewport.getActiveItem().xtype !== 'dashboard' ) {
            Mfw.app.viewport.setActiveItem('dashboard');
        }

        if (!query) {
            Mfw.app.redirectTo(DashboardUtil.routeToQuery(vm.get('route')));
            return;
        }
        me.getViewModel().set('route', DashboardUtil.queryToRoute(query));
    },

    onMoreWidgetsInfo: function () {
        Ext.Msg.show({
            title: 'Add more widgets',
            message: 'To add more custom widgets, go to <strong>Reports</strong> and add any specific report as a widget on Dashboard!',
            width: 300,
            showAnimation: null,
            hideAnimation: null,
            // closeAction: 'destroy',
            buttons: [{
                text: 'Cancel',
                handler: function () { this.up('messagebox').hide(); }
            }, {
                text: 'Go to Reports',
                handler: function () {
                    this.up('messagebox').hide();
                    Mfw.app.redirectTo('reports');
                }
            }]
        });
    },

    toggleManager: function () {
        var me = this, vm = me.getViewModel(),
            manager = vm.get('manager');
        vm.set('manager', !manager);
    },


    onActivate: function (view) {
        /**
         * reports widgets refresh based on route change as they watch conditions
         * custom widgets are generic (non conditions based) so when activating dashboard
         * they have to be added manually to the refresh widgets queue
         */
        view.down('#widgets').getItems().each(function (widget) {
            if (!widget.isXType('widget-report')) {
                WidgetsPipe.add(widget);
            }
        });
    },

    // pause loading widgets while not on dashboard
    onDeactivate: function (view) {
        view.down('#widgets').getItems().each(function (widget) {
            if (widget.tout) {
                clearTimeout(widget.tout);
                widget.tout = null;
            }
        });
    }


});
