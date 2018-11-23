Ext.define('Mfw.dashboard.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.dashboard',
    controller: 'dashboard',

    viewModel: {
        data: {
            currentView: 'dashboard',
            conditions: {
                since: null,
                fields: []
            }
        }
    },

    items: [{
        xtype: 'toolbar',
        userCls: 'x-conditions',
        shadow: false,
        padding: 8,
        // padding: 0, // to remove left spacing
        dock: 'top',
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
        xtype: 'container',
        padding: 20,
        items: [{
            xtype: 'component',
            bind: {
                html: 'Dashboard View since <strong>{conditions.since} hour(s)</strong> <br/><br/>'
            }
        }, {
            xtype: 'dataview',
            disableSelection: true,
            bind: {
                store: {
                    data: '{conditions.fields}'
                }
            },
            itemTpl: '<div>{column} {operator} {value} (autoformat: {autoFormatValue})</div>'
        }]
    }]
});
