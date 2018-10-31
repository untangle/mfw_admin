Ext.define('Mfw.view.Reports', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-reports',

    layout: 'fit',

    controller: 'reports',

    config: {
        chart: null
    },

    viewModel: {
        data: {
            conditions: {
                predefinedSince: 'today',
                since: '',
                until: '',
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
        docked: 'top',
        items: [{
            xtype: 'reports-timerange-btn'
        }, {
            xtype: 'toolbarseparator',
        }, {
            xtype: 'reports-conditions'
        }]
    }, {
        xtype: 'panel',
        style: 'border-top: 1px #e1e1e1 solid;',
        layout: 'fit',
        items: [{
            xtype: 'panel',
            bind: {
                docked: '{(!smallScreen) ? "left" : null }',
                width: '{(!smallScreen) ? 250 : null }',
                hidden: '{ smallScreen && currentView }',
            },

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
                store: 'reports-nav',
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
        initialize: 'onInitialize'
    },
});
