Ext.define('Mfw.settings.network.interface.Sheet', {
    extend: 'Mfw.cmp.grid.SheetEditor',
    alias: 'widget.interface-sheet',
    controller: 'settings-interface-sheet',
    viewModel: 'settings-interface-viewmodel',

    bind: {
        title: '{isNew ? "Create" : "Edit"} Interface'.t(),
    },

    scrollable: true,
    layout: 'fit',
    // alwaysOnTop: true, // important
    padding: 0,

    // bind: {
    //     maximized: '{smallScreen}',
    //     minWidth: '{!smallScreen ? 320 : null}',
    //     maxHeight: '{!smallScreen ? 600 : null}',
    // },
    // bodyPadding: '0 16',

    items: [{
        xtype: 'toolbar',
        docked: 'top',
        // padding: '10 8',
        shadow: false,
        style: { background: 'transparent' },
        items: [{
            xtype: 'button',
            iconCls: 'x-fa fa-arrow-left',
            margin: '0 8 0 0',
            hidden: true,
            bind: { hidden: '{isMainCard}' },
            handler: 'onBack'
        }, {
            xtype: 'component',
            bind: { html: '{record.name} [{record.interfaceId}] / <span style="font-size: smaller; font-weight: 100;">{record.device}, {record.wan ? "WAN" : "nonWAN"}</span>' }
            // html: 'Edit Interface'.t()
        }, '->',
        // {
        //     xtype: 'togglefield',
        //     hidden: true,
        //     bind: {
        //         hidden: '{!enableIpv6Toggle}',
        //         value: '{record.v6ConfigType !== "DISABLED"}'
        //     }
        // },
        {
            xtype: 'button',
            iconCls: 'x-fa fa-plus',
            ui: 'action round',
            hidden: true,
            bind: { hidden: '{!addGridItemsBtn}' },
            handler: 'addGridItem'
        }, {
            xtype: 'togglefield',
            hidden: true,
            bind: {
                hidden: '{!enableDhcpToggle}',
                value: '{record.dhcpEnabled}'
            }
        }, {
            xtype: 'togglefield',
            hidden: true,
            bind: {
                hidden: '{!enableVrrpToggle}',
                value: '{record.vrrpEnabled}'
            }
        }]
    },
    // {
    //     xtype: 'toolbar',
    //     docked: 'bottom',
    //     defaultType: 'button',
    //     ui: 'footer',
    //     hidden: true,
    //     bind: { hidden: '{!isMainCard}' },
    //     items: [
    //         '->',
    //         { text: 'Cancel'.t(), handler: 'onCancel' },
    //         { text: 'Apply'.t(), handler: 'onApply' }
    //         // '->',
    //     ]
    // },
    {
        xtype: 'formpanel',
        reference: 'form',
        // modelValidation: true,
        layout: {
            type: 'card',
            deferRender: false, // important so the validation works if card not yet visible
            animation: {
                duration: 150,
                type: 'slide',
                direction: 'horizontal'
            },
        },
        scrollable: 'y',
        padding: 0,
        margin: 0,

        items: [
            { xtype: 'interface-main' },
            { xtype: 'interface-ipv4' },
            { xtype: 'interface-ipv4-aliases' },
            { xtype: 'interface-ipv6' },
            { xtype: 'interface-ipv6-aliases' },
            { xtype: 'interface-dhcp' },
            { xtype: 'interface-dhcp-options' },
            { xtype: 'interface-vrrp' },
            { xtype: 'interface-vrrp-aliases' },
            { xtype: 'interface-wifi' }
        ],

        listeners: {
            activeItemchange: 'onActiveItemChange'
        }

    }],
    listeners: {
        initialize: 'onInitialize',
        hide: 'onHide'
    }
});
