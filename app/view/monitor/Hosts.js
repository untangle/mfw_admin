Ext.define('Mfw.view.monitor.Hosts', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mfw-monitor-hosts',
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
        html: 'Hosts'
    }],

    // listeners: {
    //     deactivate: function (view) {
    //         console.log(view);
    //     }
    // }
});
