Ext.define('Mfw.dashboard.TimeButton', {
    extend: 'Ext.Button',
    alias: 'widget.dashboard-timerange-btn',

    // arrow: false,
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
            var view = btn.up('dashboard'),
                vm = view.getViewModel();
            // watch since condition change and update button text
            vm.bind('{conditions.since}', function (since) {
                btn.setText(since + ' hour(s)');
            });

            // when selecting a new since, redirect
            btn.getMenu().on('click', function (menu, item) {
                vm.set('conditions.since', item.value);
                Mfw.app.redirect(view);
                menu.hide();
            });
        }
    },
});
