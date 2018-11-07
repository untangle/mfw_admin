Ext.define('Mfw.dashboard.Since', {
    extend: 'Ext.Button',
    alias: 'widget.dashboard-since',

    viewModel: {},

    menu: {
        indented: false,
        mouseLeaveDelay: 0,
        minWidth: 150,
        items: [
            { text: '1 hour'.t(), value: 1 },
            { text: '3 hours'.t(), value: 3 },
            { text: '6 hours'.t(), value: 6 },
            { text: '12 hours'.t(), value: 12 },
            { text: '24 hours'.t(), value: 24 }
        ]
    },

    // iconCls: 'x-fa fa-clock-o',

    listeners: {
        initialize: function (btn) {
            var vm = btn.getViewModel();

            // watch since
            vm.bind('{conditions.since}', function (since) {
                btn.setText(since + ' hour(s)');
            });

            // set since
            btn.getMenu().on('click', function (menu, item) {
                vm.set('conditions.since', item.value);
                Mfw.app.redirectTo('dashboard?' + DashboardUtil.conditionsToQuery(vm.get('conditions')));
                menu.hide();
            });
        }
    },
});
