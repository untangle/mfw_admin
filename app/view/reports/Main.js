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

    items: [{
        xtype: 'toolbar',
        shadow: false,
        padding: 8,
        // padding: 0, // to remove left spacing
        dock: 'top',
        items: [{
            xtype: 'reports-conditions'
        }, '->', {
            xtype: 'dashboard-timerange-btn'
        }]
    }, {
        xtype: 'component',
        padding: 20,
        bind: {
            html: 'Since: {timerange.range.since} <br/> Until: {timerange.range.until}'
        }
    }]
});
