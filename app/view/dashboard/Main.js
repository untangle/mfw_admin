Ext.define('Mfw.view.dashboard.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mfw-dashboard',
    // controller: 'main',
    // viewModel: {
    //     data: {
    //         timeRange: {
    //             since: 1
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
            xtype: 'dashboard-conditions'
        }, '->', {
            xtype: 'dashboard-timerange-btn'
        }]
    }, {
        xtype: 'container',
        padding: 20,
        items: [{
            xtype: 'component',
            bind: {
                html: 'Dashboard View since <strong>{dashboardConditions.since} hour(s)</strong> <br/><br/>'
            }
        }, {
            xtype: 'dataview',
            disableSelection: true,
            bind: {
                store: {
                    data: '{dashboardConditions.fields}'
                }
            },
            itemTpl: '<div>{column} {operator} {value} (autoformat: {autoFormatValue})</div>'
        }]
    }],

    listeners: {
        activate: function() {
            // Mfw.app.redirect('dashboard');
        }
    }
});
