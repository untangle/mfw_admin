/**
 * WireGuard interface options
 * shown only if interface type is WIREGUARD
 */
Ext.define('Mfw.settings.interface.WireGuard', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-wireguard',

    viewModel: {
        data: {
            activeCard: 'wg-conf',
            // the first peer of wg interface, populated on init
            peer: null
        },
        formulas: {
            // WireGuard has an array of interface addresses.
            // For the purpose of most of our implementaton, we only care about populating the first address.
            wireguardPrimaryAddress: {
                get: function (get){
                    return this.get('intf').wireguardAddresses().first() ? this.get('intf').wireguardAddresses().first().get('address') : '';
                },
                set: function(value){
                    this.get('intf').wireguardAddresses().first().set('address', value);
                }
            }
        }
    },

    scrollable: true,
    layout: 'vbox',

    items: [{
        xtype: 'formpanel',
        width: 400,
        bind: {
            flex: '{isDialog ? 1 : "auto"}'
        },
        items: [{
            xtype: 'component',
            padding: '16 0',
            style: 'font-weight: 100; font-size: 20px;',
            html: 'WireGuard VPN Configuration'
        }, {
            xtype: 'fieldset',
            title: 'Local',
            margin: '0 0 32 0',
            items:[{
                xtype: 'container',
                margin: '0 0 0 -8',
                layout: {
                    type: 'hbox',
                    align: 'bottom'
                },
                items: [{
                    /**
                     * the key is dummy generated in UI
                     * it should be retreived via an API status call (see MFW-940)
                     */
                    xtype: 'component',
                    flex: 1,
                    bind: {
                        html: '<div style="color: rgba(17, 17, 17, 0.54)">Public key</div>' +
                                    '<div style="color: #555; margin-top: 8px;">' +
                                    '{intf.wireguardPublicKey}' +
                                    '</div>',
                    }
                }]
            },{
                // copy to clipboard hidden until the public key feature will be in place
                // {
                //     xtype: 'button',
                //     iconCls: 'x-far fa-copy',
                //     tooltip: 'Copy to Clipboard'
                // }
                xtype: 'containerfield',
                layout: 'hbox',
                margin: '0 0 0 -8',
                defaults: {
                    // flex: 1,
                    required: false,
                    clearable: false
                },
                items:[{
                    xtype: 'selectfield',
                    label: 'Type',
                    placeholder: 'Select type ...',
                    required: true,
                    autoSelect: true,
                    hidden: true,
                    options: [
                        { text: 'Roaming', value: 'ROAMING' },
                        { text: 'Tunnel', value: 'TUNNEL' }
                    ],
                    bind: {
                        value: '{intf.wireguardType}',
                        hidden: '{intf.type !== "WIREGUARD"}',
                        required: '{intf.type === "WIREGUARD"}',
                        disabled: '{intf.type !== "WIREGUARD"}'
                    },
                },{
                    xtype: 'textfield',
                    label: 'Listen Port',
                    // margin: '0 0 0 -8',
                    clearable: false,
                    hidden: true,
                    bind: {
                        value: '{intf.wireguardPort}',
                        required: '{intf.type === "WIREGUARD"}',
                        hidden: '{intf.wireguardType !== "TUNNEL"}',
                        disabled: '{intf.type !== "WIREGUARD"}'
                    },
                    validators: 'port'
                }]
            },{
                xtype: 'textfield',
                label: 'Interface IP address',
                margin: '0 0 0 -8',
                placeholder: 'enter IP address ...',
                clearable: false,
                autoComplete: false,
                labelAlign: 'top',
                flex: 1,
                bind: {
                    value: '{wireguardPrimaryAddress}',
                    required: '{intf.type === "WIREGUARD"}',
                    disabled: '{intf.type !== "WIREGUARD"}'
                },
                validators: 'ipany'
            }]
        }, {
            xtype: 'fieldset',
            margin: '-16 0 0 0',
            title: 'Remote',
            items: [{
                xtype: 'textfield',
                name: 'publicKey',
                label: 'Public key',
                margin: '0 0 0 -8',
                labelAlign: 'top',
                clearable: false,
                autoComplete: false,
                placeholder: 'enter public key ...',
                flex: 1,
                bind: {
                    value: '{peer.publicKey}',
                    required: '{intf.type === "WIREGUARD"}',
                    disabled: '{intf.type !== "WIREGUARD"}'
                },
                validators: [function (val) {
                    if (val.length !== 44 || val.indexOf(' ') >= 0) {
                        return 'Invalid base64 key value'
                    }
                    return true;
                }]
            },{
                xtype: 'container',
                layout: 'vbox',
                // margin: '0 0 32 0',
                margin: '0 0 0 -8',
                hidden: true,
                bind: { hidden: '{intf.type !== "WIREGUARD"}' },
                items: [{
                    xtype: 'containerfield',
                    layout: 'hbox',
                    defaults: {
                        flex: 1,
                        required: false,
                        clearable: false
                    },
                    items: [{
                        xtype: 'textfield',
                        name: 'host',
                        label: 'Endpoint IP address',
                        placeholder: 'enter address ...',
                        clearable: false,
                        autoComplete: false,
                        labelAlign: 'top',
                        flex: 1,
                        bind: {
                            value: '{peer.host}',
                            required: '{intf.type === "WIREGUARD"}',
                            disabled: '{intf.type !== "WIREGUARD"}'
                        },
                        validators: 'ipany'
                    }, {
                        xtype: 'textfield',
                        label: 'Endpoint Listen Port',
                        margin: '0 0 0 16',
                        clearable: false,
                        bind: {
                            value: '{peer.port}',
                            required: '{intf.type === "WIREGUARD"}',
                            disabled: '{intf.type !== "WIREGUARD"}'
                        },
                        validators: 'port'
                    }]
                }]
            }, {
                xtype: 'button',
                margin: '16 0 0 -16',
                bind: {
                    text: 'Allowed IP Addresses ({peer.allowedIps.count || "none"})',
                    disabled: '{intf.type !== "WIREGUARD"}'
                },
                ui: 'action',
                handler: 'showPeerAllowedIpAddresses'
            }]
        }]
    }],

    controller: {
        init: function (view) {
            var vm = view.getViewModel(),
                intf = vm.get('intf');

            /**
             * because bindings cannot handle arrays
             * set a new bind on the unique first wireguard interface peer
             */
            vm.set('peer', intf.wireguardPeers().first());

            /**
             * because wireguard backend requires intf 'device' to be set
             * just gave it the same value as the name
             * only when creating a new interface!
             */
            if (vm.get('isNew')) {
                vm.bind('{intf.name}', function(name) {
                    intf.set('device', name);
                });
            }

            /**
             * attempt not to show field errors on form initialization
             * as the user hasn't done any input yet
             * - requires fields to have a "name"
             * - it should be done after the initial binding occurs (which triggers change event)
             * - it still requires a small delay to be effective
             */
            vm.bind('{intf}', function() {
                Ext.defer(function () { view.down('formpanel').clearErrors(); }, 50);
            });
        },
        /**
         * Generate dialog to allow editing of allowedIP networks.
         */
        showPeerAllowedIpAddresses: function () {
            var me = this;
            me.aliasesDialog = Ext.Viewport.add({
                xtype: 'interface-wireguard-allowedipaddresses',
                width: 500,
                height: 500,
                ownerCmp: me.getView()
            });
            me.aliasesDialog.show();
        },
    }
});
