Ext.define('Mfw.settings.network.interface.Dialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.interface-dialog',
    controller: 'settings-interface-dialog',
    viewModel: 'settings-interface-viewmodel',
    // title: 'Edit Interface'.t(),

    // header: [{
    //     items: [{
    //         xtype: 'button',
    //         text: 'aaa',
    //         iconCls: 'x-fa fa-arrow-left'
    //     }]
    // }],

    scrollable: true,
    // closable: true,
    // closeAction: 'hide',
    draggable: false,
    // maskTapHandler: 'onCancel',
    layout: 'fit',
    alwaysOnTop: true, // important
    maximized: false,
    maximizeAnimation: null,

    padding: 0,

    height: 500,
    bind: {
        maximized: '{smallScreen}',
        minWidth: '{!smallScreen ? 320 : null}',
        maxHeight: '{!smallScreen ? 600 : null}',
    },
    // bodyPadding: '0 16',

    items: [{
        xtype: 'toolbar',
        docked: 'top',
        shadow: false,
        style: { background: 'transparent' },
        items: [{
            xtype: 'button',
            iconCls: 'x-fa fa-arrow-left',
            margin: '0 16 0 0',
            hidden: true,
            bind: { hidden: '{isMainCard}' },
            handler: 'onBack'
        }, {
            xtype: 'component',
            bind: { html: '{title}' }
            // html: 'Edit Interface'.t()
        }, '->',
        // {
        //     xtype: 'togglefield',
        //     hidden: true,
        //     bind: {
        //         hidden: '{!enableIpv6Toggle}',
        //         value: '{rec.v6ConfigType !== "DISABLED"}'
        //     }
        // },
        {
            xtype: 'button',
            iconCls: 'x-fa fa-plus',
            hidden: true,
            bind: { hidden: '{!addGridItemsBtn}' },
            handler: 'addGridItem'
        }, {
            xtype: 'togglefield',
            hidden: true,
            bind: {
                hidden: '{!enableDhcpToggle}',
                value: '{rec.dhcpEnabled}'
            }
        }, {
            xtype: 'togglefield',
            hidden: true,
            bind: {
                hidden: '{!enableVrrpToggle}',
                value: '{rec.vrrpEnabled}'
            }
        }]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        defaultType: 'button',
        // ui: 'footer',
        hidden: true,
        bind: { hidden: '{!isMainCard}' },
        items: [
            { text: 'Cancel'.t(), handler: 'onCancel' },
            { flex: 1 },
            { text: 'Apply'.t(), handler: 'onApply' }
        ]
    }, {
        xtype: 'formpanel',
        reference: 'form',
        layout: {
            type: 'card',
            animation: {
                duration: 100,
                type: 'slide',
                direction: 'horizontal'
            },
        },

        padding: 0,
        margin: 0,

        // defaults: {
        //     margin: '8 0'
        // },

        items: [
            { xtype: 'interface-main' },
            { xtype: 'interface-ipv4' },
            { xtype: 'interface-ipv4-aliases' },
            { xtype: 'interface-ipv6' },
            { xtype: 'interface-ipv6-aliases' },
            { xtype: 'interface-dhcp' },
            { xtype: 'interface-dhcp-options' },
            { xtype: 'interface-vrrp' },
            { xtype: 'interface-vrrp-aliases' }
        ],

        listeners: {
            activeItemchange: 'onActiveItemChange'
        }

    }],
    listeners: {
        initialize: 'onInitialize'
    }
});
