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
             * helper to convert the interface addresses string to array
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
        xtype: 'formpanel',
        width: 416,
        bind: {
            flex: '{isDialog ? 1 : "auto"}'
        },
        items: [{
            xtype: 'component',
            padding: '16 0',
            style: 'font-weight: 100; font-size: 20px;',
            html: 'Interface'
        }, {
            /**
             * wg private key, generated on creation
             * cannot be change once created
             */
            xtype: 'component',
            margin: '0 0 10 0',
            bind: {
                html: '<span style="color: rgba(17, 17, 17, 0.54)">Private key</span> <br/> <span style="color: #555; font-family: monospace; font-weight: bold;">{intf.wireguardPrivateKey}</span>'
            }
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
                label: 'Listen Port',
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
            xtype: 'container',
            margin: '32 0 16 0',
            layout: {
                type: 'hbox',
                align: 'middle'
            },

            items: [{
                xtype: 'component',
                flex: 1,
                style: 'font-weight: 100; font-size: 20px;',
                html: 'Peers'
            }, {
                xtype: 'button',
                text: 'Add Peer',
                handler: 'addPeer'
            }]
        }, {
            xtype: 'container',
            itemId: 'wg-peers'
        }]
    }],

    controller: {
        init: function (view) {
            var vm = view.getViewModel(),
                intf = vm.get('intf');



            /**
             * when creating a new wireguard interface
             * pre-generate the private key
             */
            if (vm.get('isNew')) {
                var privateKey = btoa(Math.random().toFixed(32).substr(2));
                intf.set('wireguardPrivateKey', privateKey);
            }
            this.updatePeers();
        },

        updatePeers: function () {
            var me = this,
                vm = me.getViewModel(),
                peers = vm.get('intf').wireguardPeers();

            me.getView().down('#wg-peers').removeAll()

            peers.each(function (peer, idx) {
                me.getView().down('#wg-peers').add(me.peerCmp(peer, idx));
            })
        },

        /**
         * Creates editable peer component
         * It won't handle bindings so any change will triger a manual update
         * of underlaying viewmodel peer
         * @param {*} peer
         * @param {*} idx
         */
        peerCmp: function (peer, idx) {
            var me = this,
                peers = me.getViewModel().get('intf').wireguardPeers();

            return {
                xtype: 'container',
                items: [{
                    xtype: 'container',
                    margin: '0 0 16 0',
                    layout: {
                        type: 'hbox',
                        align: 'top'
                    },
                    items: [{
                        xtype: 'component',
                        flex: 1,
                        html: '<span style="color: rgba(17, 17, 17, 0.54)">Public key</span> <br/> <span style="color: #777; font-family: monospace; font-weight: bold;">' + peer.get('publicKey') + '</span> <br/>' +
                              '<span style="color: rgba(17, 17, 17, 0.54)">Preshared key</span> <br/> <span style="color: #777; font-family: monospace; font-weight: bold;">' + peer.get('presharedKey') + '</span>'
                    }, {
                        xtype: 'button',
                        iconCls: 'md-icon-clear',
                        tooltip: 'Remove Peer',
                        idx: idx,
                        handler: 'removePeer'
                    }]
                }, {
                    xtype: 'textfield',
                    label: 'Allowed IPs (comma-separated list of CIDR addresses)',
                    value: peer.get('allowedIps'),
                    // maxRows: 2,
                    placeholder: 'e.g. 1.2.3.4/32',
                    clearable: false,
                    labelAlign: 'top',
                    validators: 'ipv4expression',
                    listeners: {
                        change: function (field, value) {
                            // transform comma-separated string to array
                            peers.getAt(idx).set('allowedIps', value.replace(/\s/g, '').split(','));
                        }
                    }
                }, {
                    xtype: 'containerfield',
                    layout: {
                        type: 'hbox',
                    },
                    items: [{
                        xtype: 'textfield',
                        flex: 1,
                        label: 'Hostname (endpoint)',
                        labelAlign: 'top',
                        placeholder: 'enter hostname ...',
                        clearable: false,
                        autoComplete: false,
                        listeners: {
                            change: function (field, value) {
                                peers.getAt(idx).set('host', value);
                            }
                        }
                    }, {
                        xtype: 'numberfield',
                        width: 100,
                        margin: '0 0 0 32',
                        label: 'Port',
                        labelAlign: 'top',
                        clearable: false,
                        autoComplete: false,
                        placeholder: 'enter port ...',
                        validators: 'port',
                        listeners: {
                            change: function (field, value) {
                                peers.getAt(idx).set('host', value);
                            }
                        }
                    }]
                }, {
                    xtype: 'component',
                    margin: '16 0',
                    html: '<hr />'
                }]
            }
        },

        /**
         * adds a new peer
         */
        addPeer: function () {
            var me = this,
                vm = me.getViewModel(),
                peers = vm.get('intf').wireguardPeers()

            /**
             * the keys should be generated from backend and cannot be changed
             * once created
             */
            var publicKey = btoa(Math.random().toFixed(32).substr(2)),
                presharedKey = btoa(Math.random().toFixed(32).substr(2));

            peers.add({
                publicKey: publicKey,
                presharedKey: presharedKey,
                allowedIps: [], // default - matches all IPv4 addresses
                host: '',
                port: ''
            })

            // update the peers to keep consistent indexes
            me.updatePeers();
        },

        /**
         * removes existing peer
         * @param {*} btn
         */
        removePeer: function (btn) {
            var me = this,
                peers = me.getViewModel().get('intf').wireguardPeers()

            peers.removeAt(btn.idx);
            // update the peers to keep consistent indexes
            me.updatePeers();
        }
    }
});
