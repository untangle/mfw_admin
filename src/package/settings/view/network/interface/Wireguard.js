/**
 * Wireguard interface options
 * shown only if interface type is WIREGUARD
 */
Ext.define('Mfw.settings.interface.Wireguard', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-wireguard',

    viewModel: {
        data: {
            activeCard: 'wg-conf'
        }
    },

    layout: 'vbox',

    items: [{
        xtype: 'toolbar',
        items: [{
            text: 'Configuration',
            margin: '0 16 0 0',
            card: 'wg-conf',
            bind: {
                ui: '{activeCard === "wg-conf" ? "action" : ""}'
            },
            handler: 'setActiveCard'
        }, {
            text: 'Peers',
            card: 'wg-peers',
            bind: {
                ui: '{activeCard === "wg-peers" ? "action" : ""}'
            },
            handler: 'setActiveCard'
        }]
    }, {
        xtype: 'panel',
        flex: 1,
        itemId: 'card-panel',
        layout: 'card',
        bind: {
            activeItem: '#{activeCard}',
            // hidden: '{!intf}'
        },
        items: [{
            xtype: 'formpanel',
            itemId: 'wg-conf',
            padding: '8 16 16 16',
            width: 400,
            bind: {
                flex: '{isDialog ? 1 : "auto"}'
            },
            items: [{
                xtype: 'containerfield',
                layout: {
                    type: 'hbox',
                    align: 'bottom'
                },
                items: [{
                    xtype: 'textfield',
                    name: 'wireguardPrivateKey',
                    label: 'Private Key',
                    labelAlign: 'top',
                    editable: false,
                    placeholder: 'generate key ...',
                    flex: 1,
                    bind: {
                        value: '{intf.wireguardPrivateKey}',
                        required: '{intf.type === "WIREGUARD"}',
                        disabled: '{intf.type !== "WIREGUARD"}'
                    }
                }, {
                    xtype: 'button',
                    text: 'Generate',
                    ui: 'action',
                    margin: '0 0 0 16'
                }]
            }, {
                xtype: 'containerfield',
                layout: {
                    type: 'hbox',
                    align: 'bottom'
                },
                items: [{
                    xtype: 'textfield',
                    name: 'wireguardPublicKey',
                    label: 'Public Key',
                    editable: false,
                    placeholder: 'generate key ...',
                    clearable: false,
                    labelAlign: 'top',
                    flex: 1,
                    bind: {
                        value: '{intf.wireguardPublicKey}', // not in schema
                        required: '{intf.type === "WIREGUARD"}',
                        disabled: '{intf.type !== "WIREGUARD"}'
                    }
                }, {
                    xtype: 'button',
                    text: 'Generate',
                    ui: 'action',
                    margin: '0 0 0 16'
                }]
            }, {
                xtype: 'textfield',
                name: 'wireguardAddresses',
                label: 'Addresses',
                placeholder: 'enter comma separated IPs ...',
                clearable: false,
                autoComplete: false,
                labelAlign: 'top',
                flex: 1,
                bind: {
                    value: '{intf.wireguardAddresses}',
                    required: '{intf.type === "WIREGUARD"}',
                    disabled: '{!intf.type === "WIREGUARD"}'
                },
                validators: 'ipv4'
            }, {
                xtype: 'numberfield',
                name: 'wireguardPort',
                width: 100,
                label: 'Port',
                labelAlign: 'top',
                placeholder: 'enter port ...',
                bind: {
                    value: '{intf.wireguardPort}',
                    required: '{intf.type === "WIREGUARD"}',
                    disabled: '{!intf.type === "WIREGUARD"}'
                },
                validators: 'port',
            }],
            listeners: {
                painted: 'clearErrors'
            }
        }, {
            xtype: 'grid',
            itemId: 'wg-peers'
        }]
    }],

    controller: {
        init: function (view) {
        },

        clearErrors: function (form) {
            form.clearErrors()
        },

        setActiveCard: function (btn) {
            this.getViewModel().set('activeCard', btn.card);
        }
    }
});
