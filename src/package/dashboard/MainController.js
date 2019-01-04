Ext.define('Mfw.dashboard.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashboard',

    routes: {
        '*': function () {console.log('eeeeeeeeee'); },
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

    onWidgetSort: function (grid, context) {
        if (!this.sortMenu) {
            this.sortMenu = Ext.create(Ext.apply({
                ownerCmp: grid
            }, this.sortContextMenu));
        }

        var pos = null;
        if (grid.getStore().indexOf(context.record) === 0) { pos = 'first'; }
        if (grid.getStore().indexOf(context.record) === grid.getStore().getCount() - 1) { pos = 'last'; }

        this.sortMenu.record = context.record;
        this.sortMenu.getViewModel().set('pos', pos);
        this.sortMenu.showBy(context.tool.el, 'r-l');
    },

    onWidgetRemove: function (grid, context) {
        grid.getStore().remove(context.record);
        // Ext.Msg.confirm('')
    },

    onWidgetMove: function (menuItem) {
        var me = this, store = me.dialog.down('grid').getStore(),
            record = menuItem.up('menu').record,
            oldIndex = store.indexOf(record),
            newIndex;
        switch (menuItem.pos) {
            case 'first': newIndex = 0; break;
            case 'up':    newIndex = oldIndex - 1; break;
            case 'down':  newIndex = oldIndex + 1; break;
            case 'last':  newIndex = store.getCount(); break;
            default: break;
        }
        store.removeAt(oldIndex);
        store.insert(newIndex, record);
        // console.log(oldIndex, newIndex);
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

    // pause loading widgets while not on dashboard
    onDeactivate: function (view) {
        view.down('#widgets').getItems().each(function (widget) {
            if (widget.tout) {
                clearInterval(widget.tout);
            }
        });
    }


});
