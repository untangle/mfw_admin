Ext.define('Mfw.reports.NoSelection', {
    extend: 'Ext.Panel',
    alias: 'widget.noselection-report',

    viewModel: {},

    layout: 'center',

    items: [{
        xtype: 'container',
        items: [{
            xtype: 'container',
            height: 40,
            style: 'text-align: center;',
            html: '<i class="x-fa fa-line-chart fa-2x" style="color: #DDD; margin: 0 16px;"></i>' +
                  '<i class="x-fa fa-area-chart fa-2x" style="color: #DDD; margin: 0 16px;"></i>' +
                  '<i class="x-fa fa-pie-chart fa-2x" style="color: #DDD; margin: 0 16px;"></i>' +
                  '<i class="x-fa fa-bar-chart fa-2x" style="color: #DDD; margin: 0 16px;"></i>'
        }, {
            xtype: 'container',
            bind: {
                html: '<h1 style="font-weight: 100;">Select a Report from a category!</h1>'
            }
        }]
    }]
});
