Ext.define('Mfw.dashboard.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.dashboard',
    controller: 'dashboard',

    viewModel: {
        data: {
            manager: true,
            route: {
                since: null, // timestamp
                conditions: [] // user conditions
            }
        }
    },

    layout: 'fit',

    items: [{
        xtype: 'dashboard-manager',
        docked: 'left',
        width: 300,
        resizable: {
            split: true,
            edges: 'east'
        },
        hidden: true,
        bind: {
            hidden: '{!manager}'
        }
    }, {
        xtype: 'toolbar',
        userCls: 'x-subbar',
        shadow: false,
        padding: 8,
        // padding: 0, // to remove left spacing
        docked: 'top',
        items: [{
            iconCls: 'x-fa fa-angle-right',
            iconAlign: 'right',
            text: 'Widgets',
            handler: 'toggleManager',
            hidden: true,
            bind: {
                hidden: '{manager}'
            }
        }, {
            xtype: 'toolbarseparator',
            hidden: true,
            bind: {
                hidden: '{manager}'
            }
        }, {
            xtype: 'dashboard-since'
        }, {
            xtype: 'toolbarseparator',
        }, {
            xtype: 'conditions-fields'
        }, '->', {
            xtype: 'button',
            iconCls: 'x-fa fa-bars',
            arrow: false,
            menu: {
                items: [{
                    text: 'Manage'.t(),
                    iconCls: 'x-fa fa-cog',
                    handler: 'showSettings'
                }, {
                    text: 'Add'.t(),
                    iconCls: 'x-fa fa-plus',
                    menu: {
                        items: [
                            { text: 'Information'.t() },
                            { text: 'Resources'.t() },
                            { text: 'CPU Load'.t() },
                            { text: 'Network Information'.t() },
                            { text: 'Network Layout'.t() },
                            { text: 'Map Distribution'.t() },
                            { text: 'Notifications'.t() },
                            '-',
                            { text: 'More widgets...'.t(), handler: 'onMoreWidgetsInfo' }
                        ]
                    }
                }, '-', {
                    text: 'Import'.t(),
                    iconCls: 'x-fa fa-download'
                }, {
                    text: 'Export'.t(),
                    iconCls: 'x-fa fa-upload'
                }, '-', {
                    text: 'Reset'.t(),
                    iconCls: 'x-fa fa-rotate-left'
                }]
            }
        }]
    }, {
        // widgets holder
        itemId: 'widgets',
        xtype: 'panel',
        padding: 8,
        scrollable: true
    }]
});
