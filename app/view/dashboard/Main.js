Ext.define('Mfw.view.dashboard.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mfw-dashboard',
    // controller: 'main',
    viewModel: {
        data: {
            timeRange: {
                since: 1
            }
        }
    },

    items: [{
        xtype: 'toolbar',
        shadow: false,
        padding: 8,
        // padding: 0, // to remove left spacing
        dock: 'top',
        items: [{
            xtype: 'fields-conditions'
        }, '->', {
            xtype: 'dashboard-timerange-btn'
        }]
    }, {
        xtype: 'container',
        padding: 50,
        items: [{
            xtype: 'component',
            bind: {
                html: 'Dashboard View <br/> Timerange: {timeRange.since} hour(s)'
            }
        }]
    }],

    listeners: {
        activate: function() {
            // Mfw.app.redirect('dashboard');
        }
    }
});
