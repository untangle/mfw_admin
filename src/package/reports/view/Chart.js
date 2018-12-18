Ext.define('Mfw.reports.Chart', {
    extend: 'Ext.Container',
    alias: 'widget.chart-report',

    controller: 'chart',

    viewModel: {},

    layout: 'fit',
    bodyPadding: 0,

    items: [{
        xtype: 'component',
        // flex: 1,
        itemId: 'chart'
    }]

});
