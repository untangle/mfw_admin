Ext.define('Mfw.view.settings.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings',

    viewModel: {
        data: {
            currentView: false
        }
    },

    controller: 'settings',

    layout: 'fit',

    // tbar: {
    //     padding: 8,
    //     hidden: true,
    //     bind: { hidden: '{!currentView}' },
    //     shadow: false,
    //     items: [{
    //         xtype: 'button',
    //         iconCls: 'x-fa fa-arrow-left',
    //         handler: function () { Ext.util.History.back(); },
    //         margin: '0 8 0 0',
    //         plugins: 'responsive',
    //         responsiveConfig: { large: { hidden: true }, small: { hidden: false } },
    //     }, {
    //         xtype: 'component',
    //         margin: '0 0 0 8',
    //         style: 'color: #777; font-size: 18px; font-weight: normal;',
    //         bind: {
    //             html: '{title}<br/><span style="font-size: 12px; color: #333; font-weight: bold;">Firewall</span>',
    //         }
    //     }]
    // },

    listeners: {
        deactivate: 'onDeactivate',
        add: function (cmp, view) {
            cmp.getViewModel().set({
                currentView: true,
                title: view.viewTitle
            });
        },
        remove: function (cmp) {
            cmp.getViewModel().set({
                currentView: false,
                title: null
            });
        }
    },

    items: [{
        layout: 'fit',
        xtype: 'panel',
        shadow: false,
        zIndex: 999,
        style: {
            background: '#EEE'
        },

        bind: {
            docked: '{(!smallScreen) ? "left" : null }',
            width: '{(!smallScreen) ? 320 : null }',
            hidden: '{ smallScreen && currentView }',
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
                type: 'tree',
                rootVisible: false,
                filterer: 'bottomup',
                root: {
                    expanded: true,
                    children: [{
                        text: '<strong>' + 'Network'.t() + '</strong>',
                        iconCls: 'tree network',
                        href: 'settings/network',
                        children: [
                            { text: 'Interfaces'.t(), leaf: true, href: 'settings/network/interfaces' },
                            { text: 'Interfaces Alt'.t(), leaf: true, href: 'settings/network/interfaces-alt' }
                        ]
                    }, {
                        text: '<strong>' + 'Firewall'.t() + '</strong>',
                        iconCls: 'tree administration',
                        href: 'settings/firewall',
                        children: [
                            { text: 'Port Forward Rules'.t(), leaf: true, href: 'settings/firewall/portforwardrules' },
                        ]
                    }, {
                        text: '<strong>' + 'System'.t() + '</strong>',
                        iconCls: 'tree system',
                        href: 'settings/system',
                        children: [
                            { text: 'Host/Domain'.t(), leaf: true, href: 'settings/system/host' }
                        ]
                    }, {
                        text: '<strong>' + 'Administration'.t() + '</strong>',
                        iconCls: 'tree administration',
                        href: 'settings/administration',
                        children: [
                            { text: 'Some Setting title'.t(), leaf: true }
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
    {
        xtype: 'mfw-settings-select',
        hidden: true,
        bind: {
            hidden: '{smallScreen || currentView}'
        }
    }
    ]
});
