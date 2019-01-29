Ext.define('Mfw.dashboard.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.dashboard',
    controller: 'dashboard',

    viewModel: {
        data: {
            manager: false,
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
        width: 400,
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
        }]
    }, {
        xtype: 'container',
        innerCls: 'widgets-outer',
        scrollable: true,
        items: [{
            // widgets holder
            xtype: 'container',
            itemId: 'widgets',
            innerCls: 'widgets-inner',
            padding: 8,
            scrollable: true
        }]
    }],

    listeners: {
        deactivate: 'onDeactivate'
    }
});
