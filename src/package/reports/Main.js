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
            route: {
                cat: null,
                rep: null,
                predefinedSince: 'today',
                since: null,
                until: null,
                columns: []
            }
        }
    },

    items: [{
        xtype: 'toolbar',
        userCls: 'x-conditions',
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
        }]
    }, {
        xtype: 'panel',
        style: 'border-top: 1px #e1e1e1 solid;',
        layout: 'fit',
        items: [{
            xtype: 'panel',
            docked: 'left',
            width: 400,

            resizable: {
                split: true,
                edges: 'east'
            },

            items: [{
                xtype: 'treelist',
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
            bbar: {
                shadow: true,
                items: [{
                    xtype: 'searchfield',
                    ui: 'faded',
                    flex: 1,
                    placeholder: 'Find report...'.t(),
                    listeners: {
                        change: 'filterSettings'
                    }
                }]
            }
        }, {
            xtype: 'chart'
        }]
    }],

    listeners: {
        deactivate: 'onDeactivate'
    }
});
