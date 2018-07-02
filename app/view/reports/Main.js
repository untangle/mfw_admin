Ext.define('Mfw.view.reports.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mfw-reports',
    // controller: 'main',
    // viewModel: {
    //     data: {
    //         timeRange: {
    //             range: '1h'
    //         }
    //     }
    // },

    // viewModel: {},

    items: [{
        xtype: 'toolbar',
        shadow: false,
        padding: 8,
        // padding: 0, // to remove left spacing
        dock: 'top',
        items: [{
            xtype: 'reports-conditions'
        }, '->', {
            xtype: 'reports-timerange-btn'
        }]
    }, {
        xtype: 'component',
        padding: 20,
        userSelectable: {
            element: true,       // optionally allow the element to be user selectable
            bodyElement: true    // optionally allow the component's body element to be user selectable
        },
        bind: {
            html: 'PredefSince: {reportsConditions.predefinedSince} <br/> Since: {reportsConditions.since} <br/> Until: {reportsConditions.until || "none" }'
        }
    }]
});
