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
        xtype: 'container',
        padding: 20,
        items: [{
            xtype: 'component',
            bind: {
                html: 'Since: <br/>{reportsConditions.since} / {reportsConditions.since:dateFormatter}<br/><br/> Until: {reportsConditions.until || "none" } / {reportsConditions.until:dateFormatter}<br/><br/>'
            }
        }, {
            xtype: 'dataview',
            disableSelection: true,
            bind: {
                store: {
                    data: '{reportsConditions.fields}'
                }
            },
            itemTpl: '<div>{column} {operator} {value} (autoformat: {autoFormatValue})</div>'
        }]
    }]
});
