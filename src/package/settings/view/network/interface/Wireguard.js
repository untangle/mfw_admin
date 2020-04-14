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
        },
        formulas: {
            /**
             * helper to convert the IPs string to array
             */
            _wireguardAddresses: {
                get: function (get) {
                    if (!get('intf.wireguardAddresses')) { return ''; }
                    return get('intf.wireguardAddresses').join(',');
                },
                set: function (value) {
                    this.set('intf.wireguardAddresses', value ? value.replace(/\s/g,'').split(',') : null);
                }
            }
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
                ui: '{activeCard === "wg-peers" || activeCard === "wg-peer" ? "action" : ""}'
            },
            handler: 'setActiveCard'
        }]
    }, {
        xtype: 'container',
        width: 416, // keep same aspect when adding or editing
        flex: 1,
        layout: {
            type: 'card',
            animation: 'slide'
        },
        bind: {
            activeItem: '#{activeCard}',
            // hidden: '{!intf}'
        },
        items: [{
            xtype: 'formpanel',
            itemId: 'wg-conf',
            width: 400,
            bind: {
                flex: '{isDialog ? 1 : "auto"}'
            },
            items: [{
                xtype: 'component',
                docked: 'top',
                padding: 16,
                style: 'font-weight: 100; font-size: 20px;',
                html: 'Main settings'
            }, {
                xtype: 'containerfield',
                layout: {
                    type: 'hbox',
                },
                items: [{
                    xtype: 'textfield',
                    name: 'wireguardAddresses',
                    label: 'Address',
                    placeholder: 'enter address ...',
                    clearable: false,
                    autoComplete: false,
                    labelAlign: 'top',
                    flex: 1,
                    bind: {
                        value: '{_wireguardAddresses}',
                        required: '{intf.type === "WIREGUARD"}',
                        disabled: '{intf.type !== "WIREGUARD"}'
                    },
                    validators: 'ipv4expression'
                }, {
                    xtype: 'numberfield',
                    name: 'wireguardPort',
                    width: 100,
                    margin: '0 0 0 32',
                    label: 'Port',
                    labelAlign: 'top',
                    clearable: false,
                    autoComplete: false,
                    placeholder: 'enter port ...',
                    bind: {
                        value: '{intf.wireguardPort}',
                        required: '{intf.type === "WIREGUARD"}',
                        disabled: '{intf.type !== "WIREGUARD"}'
                    },
                    validators: 'port',
                }]
            }, {
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
                    clearable: false,
                    focusable: false,
                    placeholder: 'generate key ...',
                    flex: 1,
                    bind: {
                        value: '{intf.wireguardPrivateKey}',
                        required: '{intf.type === "WIREGUARD"}',
                        disabled: '{intf.type !== "WIREGUARD"}'
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'x-fa fa-sync',
                    ui: 'round',
                    margin: '0 0 0 16',
                    handler: 'generatePrivateKey'
                }]
            }],
            listeners: {
                painted: 'clearErrors'
            }
        }, {
            xtype: 'container',
            itemId: 'wg-peers',
            layout: 'fit',
            items: [{
                xtype: 'container',
                docked: 'top',
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                padding: '16',
                items: [{
                    xtype: 'component',
                    flex: 1,
                    style: 'font-weight: 100; font-size: 20px;',
                    html: 'Add or remove Peers'
                }, {
                    xtype: 'button',
                    iconCls: 'x-fa fa-plus',
                    ui: 'round action',
                    handler: 'showPeerCard'
                }]
            }, {
                xtype: 'grid',
                userCls: 'c-noheaders',
                flex: 1,
                bind: '{intf.wireguardPeers}',
                hideHeaders: true,
                selectable: false,
                columns: [{
                    dataIndex: 'publicKey',
                    flex: 1,
                    sortable: false,
                    hideable: false,
                    resizable: false,
                    menuDisabled: true,
                    cell: {
                        encodeHtml: false
                    },
                    renderer: function (val, rec) {
                        return '<b>Public key:</b><br/>' + rec.get('publicKey') + '<br/>' +
                               '<b>Allowed IPs:</b><br/> ' + rec.get('allowedIps')
                    }
                }, {
                    align: 'center',
                    width: 40,
                    sortable: false,
                    hideable: false,
                    resizable: false,
                    menuDisabled: true,
                    cell: {
                        tools: {
                            delete: {
                                iconCls: 'md-icon-delete',
                                align: 'right',
                                handler: 'onRemovePeer'
                            }
                        }
                    }
                }]
            }]
        }, {
            xtype: 'formpanel',
            itemId: 'wg-peer',
            layout: 'vbox',
            items: [{
                xtype: 'component',
                padding: '16 0',
                style: 'font-weight: 100; font-size: 20px;',
                html: 'Add Peer'
            }, {
                xtype: 'containerfield',
                layout: {
                    type: 'hbox',
                    align: 'bottom'
                },
                items: [{
                    xtype: 'textfield',
                    name: 'publicKey',
                    label: 'Public Key',
                    editable: false,
                    placeholder: 'generate key ...',
                    clearable: false,
                    focusable: false,
                    labelAlign: 'top',
                    flex: 1,
                    bind: {
                        required: '{activeCard === "wg-peer"}'
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'x-fa fa-sync',
                    ui: 'round',
                    margin: '0 0 0 16',
                    handler: 'generatePublicKey'
                }]
            }, {
                xtype: 'containerfield',
                layout: {
                    type: 'hbox',
                    align: 'bottom'
                },
                items: [{
                    xtype: 'textfield',
                    name: 'presharedKey',
                    label: 'Preshared Key',
                    editable: false,
                    placeholder: 'generate key ...',
                    clearable: false,
                    focusable: false,
                    labelAlign: 'top',
                    flex: 1
                }, {
                    xtype: 'button',
                    iconCls: 'x-fa fa-sync',
                    ui: 'round',
                    margin: '0 0 0 16',
                    handler: 'generatePresharedKey'
                }]
            }, {
                xtype: 'textfield',
                name: 'allowedIps',
                label: 'Allowed IPs (comma separated values)',
                // maxRows: 2,
                placeholder: 'e.g. 1.2.3.4/32',
                clearable: false,
                labelAlign: 'top',
                bind: {
                    required: '{activeCard === "wg-peer"}'
                },
                validators: 'ipv4expression'
            }, {
                xtype: 'containerfield',
                layout: {
                    type: 'hbox',
                },
                items: [{
                    xtype: 'textfield',
                    flex: 1,
                    name: 'host',
                    label: 'Host',
                    labelAlign: 'top',
                    placeholder: 'enter host ...',
                    clearable: false,
                    focusable: false,
                }, {
                    xtype: 'numberfield',
                    name: 'port',
                    width: 100,
                    margin: '0 0 0 32',
                    label: 'Port',
                    labelAlign: 'top',
                    clearable: false,
                    autoComplete: false,
                    placeholder: 'enter port ...',
                    validators: 'port'
                }]
            }, {
                xtype: 'container',
                layout: {
                    type: 'hbox'
                },
                margin: '16 0',
                items: [{
                    xtype: 'component',
                    flex: 1
                }, {
                    xtype: 'button',
                    margin: '0 16 0 0',
                    text: 'Cancel',
                    handler: 'onCancelPeer'
                }, {
                    xtype: 'button',
                    text: 'Add Peer',
                    ui: 'action',
                    handler: 'onAddPeer'
                }]
            }],
            listeners: {
                painted: 'clearErrors'
            }
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
        },

        showPeerCard: function () {
            var me = this;
            me.getViewModel().set('activeCard', 'wg-peer');
        },

        onCancelPeer: function (btn) {
            var me = this, form = btn.up('formpanel');
            form.reset(true);
            me.getViewModel().set('activeCard', 'wg-peers');
        },

        onAddPeer: function (btn) {
            var me = this, form = btn.up('formpanel'),
            vm = me.getViewModel(), intf = vm.get('intf'),
            values = form.getValues();

            if (!form.validate()) {
                Ext.toast('Please fill or correct invalid fields!', 3000);
                return;
            }

            // transform ips string into array
            values['allowedIps'] = values['allowedIps'].replace(/\s/g,'').split(',');

            intf.wireguardPeers().add(values);
            form.reset(true);
            me.getViewModel().set('activeCard', 'wg-peers');
        },

        onRemovePeer: function (grid, info) {
            info.record.drop();
        },


        generatePrivateKey: function () {
            var me = this,
            vm = me.getViewModel();

            /**
             * just for demo generate a key
             * needs to be generated on the backend using wg genkey
             */
            var key = btoa(Math.random().toFixed(32).substr(2));

            vm.get('intf').set('wireguardPrivateKey', key);

        },

        /**
         * generates the peer public key
         */
        generatePublicKey: function (btn) {
            var me = this, form = btn.up('formpanel');
            /**
             * just for demo generate a key
             * needs to be generated on the backend using wg pubkey
             */
            var key = btoa(Math.random().toFixed(32).substr(2));
            form.getFields('publicKey').setValue(key)
        },

        /**
         * generates the peer preshared key
         */
        generatePresharedKey: function (btn) {
            var me = this, form = btn.up('formpanel');
            /**
             * just for demo generate a key
             * needs to be generated on the backend using wg genpsk
             */
            var key = btoa(Math.random().toFixed(32).substr(2));
            form.getFields('presharedKey').setValue(key)
        }


    }
});
