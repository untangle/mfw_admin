Ext.define('Mfw.view.settings.Main', {
    extend: 'Ext.Container',
    alias: 'widget.mfw-settings',

    viewModel: {
        data: {
            currentView: false
        }
    },

    controller: 'settings',

    // viewModel: true,
    // defaultType: 'panel',

    layout: 'fit',
    // plugins: 'responsive',
    // responsiveFormulas: {
    //     formula: function (context) {
    //         // var me = this;
    //         // console.log(me);
    //         return (new Date()).getDay() === 2;
    //     }
    // },

    tbar: {
        padding: 8,
        // hidden: true,
        // bind: { hidden: '{!params}' },
        shadow: false,
        items: [{
            xtype: 'button',
            iconCls: 'x-fa fa-chevron-left',
            handler: function () { Ext.util.History.back(); },
            // hidden: true,
            // bind: {
            //     hidden: '{ screen === "WIDE" }'
            // }
        }, {
            xtype: 'component',
            margin: '0 0 0 8',
            bind: {
                html: 'Network / {ttl}',
            }
        }]
    },

    listeners: {
        deactivate: 'onDeactivate',
        add: function (cmp) {
            cmp.getViewModel().set('currentView', true);
        },
        remove: function (cmp) {
            cmp.getViewModel().set('currentView', false);
        }
    },

    items: [{
        layout: 'fit',
        xtype: 'panel',
        shadow: true,
        zIndex: 999,

        bind: {
            docked: '{(screen === "large" && currentView) ? "left" : null }',
            width: '{(screen === "large" && currentView) ? 320 : null }',
            hidden: '{ screen === "small" && currentView }',
        },

        // hidden: true,

        // plugins: 'responsive',
        // responsiveConfig: {
        //     large: { docked: 'left', width: 320 },
        //     small: { docked: null }
        //     // formula: { width: 500 }
        // },

        // bind: {
        //     // docked: '{ screen === "WIDE" ? "left" : null }',
        //     width: '{ screen === "WIDE" ? 320 : null }',
        //     // hidden: '{params && screen !== "WIDE" }',
        //     // resizable: {
        //     //     split: '{ screen === "WIDE" }',
        //     //     direction: 'left',
        //     //     edges: 'east'
        //     // }
        // },

        tbar: {
            shadow: false,
            items: [{
                xtype: 'searchfield',
                ui: 'faded',
                flex: 1,
                placeholder: 'Find settings...'.t(),
                listeners: {
                    change: 'filterSettings'
                }
            }]
        },

        items: [{
            xtype: 'treelist',
            scrollable: true,
            userCls: 'config-menu',
            ui: 'nav',
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
                type: 'tree',
                rootVisible: false,
                filterer: 'bottomup',
                root: {
                    expanded: true,
                    children: [{
                        text: 'Network'.t(),
                        // icon: '/skins/modern-rack/images/admin/config/icon_config_network.png',
                        // iconCls: 'tree network',
                        // iconCls: 'x-fa fa-cog',
                        href: 'settings/network',
                        children: [
                            { text: 'Interfaces'.t(), leaf: true, href: 'settings/network/interfaces' }
                        ]
                    }, {
                        text: 'System'.t(),
                        // iconCls: 'x-fa fa-',
                        href: 'settings/system',
                        children: [
                            { text: 'Host/Domain'.t(), leaf: true, href: 'settings/system/host' }
                        ]
                    }]
                }
            },
            listeners: {
                selectionchange: function (el, record) {
                    // console.log(record);
                    if (!record || !record.get('href')) { return; }
                    Mfw.app.redirectTo(record.get('href'));
                }
            }
        }]
    },
    //{
    //    xtype: 'mfw-settings-select',
        // hidden: true,
        // bind: {
        //     hidden: '{params || screen !== "WIDE"}'
        // }
    // }
    ]
});
