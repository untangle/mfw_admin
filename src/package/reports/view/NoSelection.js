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
            html: '<i class="x-fa fa-chart-line fa-2x" style="color: #DDD; margin: 0 16px;"></i>' +
                  '<i class="x-fa fa-chart-area fa-2x" style="color: #DDD; margin: 0 16px;"></i>' +
                  '<i class="x-fa fa-chart-pie fa-2x" style="color: #DDD; margin: 0 16px;"></i>' +
                  '<i class="x-fa fa-chart-bar fa-2x" style="color: #DDD; margin: 0 16px;"></i>'
        }, {
            xtype: 'container',
            bind: {
                html: '<h1 style="font-weight: 100;">Select a Report from a category!</h1>'
            }
        }]
    }],

    listeners: {
        activate: function (view) {
            var dataBtn = view.up('report').down('#dataBtn'),
                dataPanel = view.up('report').down('#dataPanel');

            dataBtn.setPressed(false);
            if (dataPanel) {
                dataPanel.down('grid').getStore().loadData([]);
            }
        }
    }
});
