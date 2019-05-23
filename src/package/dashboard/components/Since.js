Ext.define('Mfw.dashboard.Since', {
    extend: 'Ext.Button',
    alias: 'widget.dashboard-since',

    // viewModel: {},

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

    controller: {
        init: function (btn) {
            var me = this, vm = me.getViewModel(), route, btnText;

            // watch since
            vm.bind('{route}', function (route) {
                if (!route.since) {
                    btnText = '1 hour';
                } else {
                    btnText = 'Since ' + route.since + ' hour(s)';
                }
                btn.setText(btnText);
            }, me, { deep: true });

            // set since
            btn.getMenu().on('click', function (menu, item) {
                route = vm.get('route');
                menu.hide();
                route.since = item.value;
                Mfw.app.redirectTo(DashboardUtil.routeToQuery(route));
            });
        }
    }
});
