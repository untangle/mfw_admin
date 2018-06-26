Ext.define('Mfw.view.dashboard.TimeRange', {
    extend: 'Ext.Button',
    alias: 'widget.aaadashboard-timerange-btn',

    bind: {
        text: 'Since'.t() + ' ' + '{timeRange.since} Hours',
    },
    // iconCls: 'x-fa fa-clock-o',
    menu: {
        minWidth: 150,
        defaultType: 'menuradioitem',
        bind: {
            groups: '{timeRange}'
        },
        defaults: {
            group: 'since',
            listeners: {
                checkchange: 'onRadioItemChange'
            },
        },
        items: [
            { text: '1 Hour'.t(), value: 1 },
            { text: '3 Hours'.t(), value: 3 },
            { text: '6 Hours'.t(), value: 6 },
            { text: '12 Hours'.t(), value: 12 },
            { text: '24 Hours'.t(), value: 24 }
        ]
    },

    controller: {
        onRadioItemChange: function (checkboxItem, checked) {
            checkboxItem.up('menu').hide();
            // if (checked) {
            //     Mfw.app.redirectTo('#since=' + checkboxItem.getValue());
            // }
            // Ext.toast('You ' + (checked ? 'checked' : 'unchecked') + ' Check Item');
        }
    }
});
