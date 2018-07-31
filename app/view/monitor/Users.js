Ext.define('Mfw.view.monitor.Users', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mfw-monitor-users',
    // controller: 'main',
    // viewModel: {
    //     data: {
    //         timeRange: {
    //             since: 1
    //         }
    //     }
    // },

    items: [{
        xtype: 'container',
        padding: 20,
        html: 'users'
    }],

    // listeners: {
    //     deactivate: function (view) {
    //         console.log(view);
    //     }
    // }
});
