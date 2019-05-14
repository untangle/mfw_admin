Ext.define('Mfw.settings.NoSelection', {
    extend: 'Ext.Panel',
    alias: 'widget.noselection-settings',

    viewModel: {},

    layout: 'center',

    items: [{
        xtype: 'container',
        items: [{
            xtype: 'container',
            bind: {
                html: '<h1 style="font-weight: 100;">Select Settings from a category!</h1>'
            }
        }]
    }]
});
