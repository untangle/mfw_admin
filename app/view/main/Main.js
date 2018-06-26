Ext.define('Mfw.view.main.Main', {
    extend: 'Ext.Panel',
    // alias: 'widget.mfw-main',
    // controller: 'main',
    viewModel: {},

    layout: 'card',
    border: false,
    bodyBorder: false,
    bind: {
        activeItem: '{currentView}'
    },
    items: [
        // heading
        { xtype: 'mfw-heading' },
        { xtype: 'container', itemId: 'loadingCard' }, // empty loading card till routing sets the view
        // { xtype: 'mfw-mainmenu' },
        // views
        { xtype: 'mfw-dashboard' },
        { xtype: 'mfw-reports' },
        { xtype: 'mfw-settings' }
    ]
});
