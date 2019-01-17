Ext.define('Mfw.reports.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.reports',

    layout: 'fit',

    controller: 'reports',

    config: {
        chart: null
    },

    viewModel: {
        data: {
            record: null,
            data: null,
            route: {
                cat: null, // report category
                rep: null, // report name
                psince: null, // predefined since, e.g. today, thisweek etc...
                since: null, // timestamp
                until: null, // timestamp
                conditions: [] // user conditions
            }
        }
    },

    items: [{
        xtype: 'toolbar',
        userCls: 'x-subbar',
        shadow: false,
        padding: 8,
        // padding: 0, // to remove left spacing
        docked: 'top',
        items: [{
            xtype: 'time-range'
        }, {
            xtype: 'toolbarseparator',
        }, {
            xtype: 'conditions-fields'
        }
        // , '->', {
        //     text: 'Toast 1',
        //     handler: function () {
        //         // Notification.toast('normal', 'some message' + (new Date().getTime()));
        //         Ext.toast('some message' + (new Date().getTime()), 3000);
        //     }
        // }
    ]
    }, {
        xtype: 'panel',
        style: 'border-top: 1px #e1e1e1 solid;',
        layout: 'fit',
        items: [{
            xtype: 'panel',
            docked: 'left',
            width: 380,

            resizable: {
                split: true,
                edges: 'east'
            },

            items: [{
                xtype: 'treelist',
                cls: 'reports-tree',
                scrollable: true,
                ui: 'nav',
                style: {
                    background: '#f5f5f5'
                },
                // micro: true,
                // selectable: {
                //     mode: 'single'
                // },

                animation: {
                    duration: 150,
                    easing: 'ease'
                },
                singleExpand: true,
                expanderFirst: false,
                expanderOnly: false,
                selectOnExpander: true,
                highlightPath: false,
                store: {
                    type: 'reports-nav'
                },
                listeners: {
                    selectionchange: 'onSelectionChange'
                }
            }],
            tbar: {
                shadow: false,
                padding: '0 8',
                items: [{
                    xtype: 'searchfield',
                    ui: 'faded',
                    flex: 1,
                    margin: '0 8 0 0',
                    placeholder: 'Find report...'.t(),
                    listeners: {
                        change: 'filterReports'
                    }
                }, {
                    iconCls: 'md-icon-import-export',
                    ui: 'round',
                    arrow: false,
                    menuAlign: 'tr-br?',
                    menu: {
                        items: [{
                            text: 'Export',
                            iconCls: 'x-fa fa-upload',
                            handler: 'exportReports'
                        }, {
                            text: 'Import (not implemented)',
                            iconCls: 'x-fa fa-download'
                        }]
                    }
                }]
            }
        }, {
            xtype: 'report'
        }]
    }],

    listeners: {
        deactivate: 'onDeactivate'
    }
});
