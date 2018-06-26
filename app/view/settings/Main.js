Ext.define('Mfw.view.settings.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mfw-settings',
    // controller: 'main',
    viewModel: {},

    layout: 'fit',

    items: [{
        xtype: 'component',
        padding: 10,
        html: 'Settings view'
        // xtype: 'grid',
        // store: 'interfaces',
        // layout: 'fit',
        // columns: [{
        //     text: 'Interface ID',
        //     dataIndex: 'interfaceId'
        // }]
    }]
});
