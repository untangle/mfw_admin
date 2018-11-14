Ext.define('Mfw.dashboard.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashboard',

    routes: {
        'dashboard:query': {
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
            Mfw.app.redirectTo('dashboard?' + DashboardUtil.conditionsToQuery(vm.get('conditions')));
            action.stop();
        } else {
            vm.set('conditions', DashboardUtil.queryToConditions(query));
            action.resume();
        }
    },

    onAction: function () {
        Mfw.app.viewport.setActiveItem('dashboard');
    },

    sortContextMenu: {
        xtype: 'menu',
        anchor: true,
        // padding: 10,
        // minWidth: 300,
        viewModel: {
            data: {
                pos: null
            }
        },
        defaults: {
            disabled: true
        },
        items: [{
            text: 'First'.t(),
            iconCls: 'x-fa fa-angle-double-up',
            pos: 'first',
            handler: 'onWidgetMove',
            bind: { disabled: '{pos === "first"}' }
        }, {
            text: 'Up'.t(),
            iconCls: 'x-fa fa-angle-up',
            pos: 'up',
            handler: 'onWidgetMove',
            bind: { disabled: '{pos === "first"}' }
        }, {
            text: 'Down'.t(),
            iconCls: 'x-fa fa-angle-down',
            pos: 'down',
            handler: 'onWidgetMove',
            bind: { disabled: '{pos === "last"}' }
        }, {
            text: 'Last'.t(),
            iconCls: 'x-fa fa-angle-double-down',
            pos: 'last',
            handler: 'onWidgetMove',
            bind: { disabled: '{pos === "last"}' }
        }]
    },


    onBeforeRoute: function () {
        console.log('on dashboard');
    },

    // onInitialize: function () {
    //     console.log('on init');
    //     Mfw.app.onDashboard = function () {
    //         console.log('dashboard route');
    //     }
    // },







    showSettings: function () {
        var me = this;
        if (!me.dialog) {
            me.dialog = Ext.Viewport.add({
                xtype: 'dashboard-manager-dialog',
                ownerCmp: me.getView()
            });
        }
        me.dialog.show();
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

    onDialogOk: function () {
        var me = this
        me.dialog.hide();
    },
    onDialogCancel: function () {
        var me = this;
        me.dialog.hide();
    },

});
