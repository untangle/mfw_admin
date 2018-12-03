Ext.define('Mfw.reports.Chart', {
    extend: 'Ext.Panel',
    alias: 'widget.chart-report',

    controller: 'chart',

    viewModel: {},

    layout: 'fit',
    bodyPadding: 0,

    items: [{
        xtype: 'container',
        // flex: 1,
        itemId: 'chart'
    }]

});
