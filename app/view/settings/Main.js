Ext.define('Mfw.view.settings.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings',

    viewModel: {
        data: {
            params: null
        }
    },

    controller: 'settings',
    // viewModel: true,
    // defaultType: 'panel',

    layout: 'fit',

    tbar: {
        padding: 8,
        // hidden: true,
        // bind: { hidden: '{!params}' },
        shadow: false,
        items: [{
            xtype: 'button',
            iconCls: 'x-fa fa-chevron-left',
            handler: function () { Mfw.app.redirectTo('config'); },
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
        deactivate: 'onDeactivate'
    },

    items: [{
        layout: 'fit',
        xtype: 'panel',
        shadow: true,
        zIndex: 999,
        // hidden: true,
        docked: 'left',
        width: 320,
        bind: {
            // docked: '{ screen === "WIDE" ? "left" : null }',
            width: '{ screen === "WIDE" ? 320 : null }',
            // hidden: '{params && screen !== "WIDE" }',
            // resizable: {
            //     split: '{ screen === "WIDE" }',
            //     direction: 'left',
            //     edges: 'east'
            // }
        },

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
