Ext.define('Mfw.dashboard.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.dashboard',
    controller: 'dashboard',

    viewModel: {
        data: {
            route: {
                since: null, // timestamp
                conditions: [] // user conditions
            }
        }
    },

    layout: 'fit',

    items: [{
        xtype: 'toolbar',
        userCls: 'x-subbar',
        shadow: false,
        padding: 8,
        // padding: 0, // to remove left spacing
        docked: 'top',
        items: [{
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
        padding: 8

        // xtype: 'container',
        // padding: 20,
        // items: [{
        //     xtype: 'component',
        //     bind: {
        //         html: 'Dashboard View since <strong>{route.since} hour(s)</strong> <br/><br/>'
        //     }
        // }, {
        //     xtype: 'dataview',
        //     disableSelection: true,
        //     bind: {
        //         store: {
        //             data: '{route.conditions}'
        //         }
        //     },
        //     itemTpl: '<div>{column} {operator} {value}</div>'
        // }]
    }]
});
