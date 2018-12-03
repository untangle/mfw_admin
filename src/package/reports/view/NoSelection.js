Ext.define('Mfw.reports.NoSelection', {
    extend: 'Ext.Panel',
    alias: 'widget.noselection-report',

    viewModel: {},

    items: [{
        xtype: 'container',
        padding: 16,
        bind: {
            html: '<h1>Select a Report from a category!</h1>'
        }
    }]
});
