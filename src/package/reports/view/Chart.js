Ext.define('Mfw.reports.Chart', {
    extend: 'Ext.Container',
    alias: 'widget.chart-report',

    controller: 'chart',

    viewModel: {},

    bodyPadding: 0,
    innerCls: 'chart-wrapper',
    items: [{
        xtype: 'component',
        itemId: 'chart'
    }],

    listeners: {
        resize: 'onResize'
    }

});
