Ext.define('Mfw.view.monitor.Devices', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mfw-monitor-devices',
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
        html: 'devices'
    }],

    // listeners: {
    //     deactivate: function (view) {
    //         console.log(view);
    //     }
    // }
});
