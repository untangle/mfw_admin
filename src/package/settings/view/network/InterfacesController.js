Ext.define('Mfw.settings.network.InterfacesController', {
    extend: 'Mfw.cmp.grid.MasterGridController',
    alias: 'controller.mfw-settings-network-interfaces',

    onAddInterface: function (mItem) {
        var me = this, type = mItem.type, newIntf;

        if (type === 'VLAN') {
            newIntf = Ext.create('Mfw.model.Interface', {
                type: 'VLAN',
                configType: 'BRIDGED',
                wan: false,
                boundInterfaceId: 0,
            })
        }

        if (type === 'OPENVPN') {
            newIntf = Ext.create('Mfw.model.Interface', {
                type: 'OPENVPN',
                configType: 'ADDRESSED',
                wan: true,
                natEgress: true,
                openvpnBoundInterfaceId: 0,
                openvpnUsernamePasswordEnabled: false,
                openvpnUsername: null,
                openvpnPasswordBase64: null
            });

            newIntf.setOpenvpnConfFile(Ext.create('Mfw.model.OpenVpnConfFile', {
                encoding: 'base64',
                contents: ''
            }));
        }

        if (type === "WIREGUARD") {
            /**
             * new WireGuard interface defaults
             */
            newIntf = Ext.create('Mfw.model.Interface', {
                type: 'WIREGUARD',
                configType: 'ADDRESSED',
                // 'wan' is always true for WireGuard (cannot be changed)
                wan: true,
                // 'natEgress' enables or disables NAT
                natEgress: true,
                /**
                 * from MFW-494
                 * The IPv4 address (v4StaticAddress) for the first WireGuard interface
                 * should be 172.16.200.1/32 and it should increment for each new WireGuard interface
                 * (e.g. 172.16.200.2/32, 172.16.200.3/32 ...).
                 * These addressed will later be pulled from an API endpoint (MFW-945).
                 */
                v4StaticAddress: '172.16.200.1',
                v4StaticPrefix: 32,
                /**
                 * this is dummy set for now as it is required upon interface creation
                 * should be removed later (see MFW-940)
                 */
                wireguardPrivateKey: btoa(Math.random().toFixed(32).substr(2)),
                /**
                 * TODO
                 * 'wireguardAddresses' are not set in UI,
                 * but wireguard backend requires to be set
                 * put a dummy address, should be removed
                 */
                wireguardAddresses: ['100.100.100.100'],
                /**
                 * the default WireGuard port (cannot be changed in UI)
                 */
                wireguardPort: 51820
            });

            /**
             * WireGuard unique peer
             */
            newIntf.wireguardPeers().add({
                // peer 'host' can be an IP or hostname, user defined
                host: '',
                // peer port, not set in UI
                port: null,
                // peer 'publicKey', user defined
                publicKey: '',
                // peer 'presharedKey' is not implemented and used yet
                presharedKey: null,
                /**
                 * preset to allow all IPv4 addresses (now shown and not changeable)
                 * passed as an array as backend expect it to be
                 */
                allowedIps: ['0.0.0.0/0'],
                // peer 'keepalive' defaults to 60 seconds (not shown and not changeable)
                keepalive: 60,
                // peer 'routeAllowedIps' always true (not shown and not changeable)
                routeAllowedIps: true
            })
        }

        me.intfDialog = Ext.Viewport.add({
            xtype: 'dialog',
            ownerCmp: me.getView(),
            layout: 'fit',
            width: 416,
            height: Ext.getBody().getViewSize().height < 700 ? (Ext.getBody().getViewSize().height - 20) : 700,
            padding: 0,

            showAnimation: false,
            hideAnimation: false,

            items: [{
                xtype: 'mfw-settings-network-interface',
                viewModel: {
                    data: {
                        intf: newIntf,
                        isNew: true,
                        isDialog: true
                    }
                }
            }]
        });

        me.intfDialog.on('destroy', function () {
            // me.onLoad();
            me.intfDialog = null;
        });
        me.intfDialog.show();
    },

    onEditRecord: function (grid, info) {
        Mfw.app.redirectTo('settings/network/interfaces/' + info.record.get('name'));
    },

    onDeleteRecord: function (grid, info) {
        var me = this;
        Ext.Msg.confirm('<i class="x-fa fa-exclamation-triangle"></i> Warning',
            'Delete <strong>' + info.record.get('name') + '</strong> interface?',
            function (answer) {
                if (answer === 'yes') {
                    info.record.drop();
                    me.onSave(); // defind in MasterGrid
                }
            });
    },

    configTypeRenderer: function (value, record) {
        if (value === 'ADDRESSED') {
            return 'Addressed';
        }
        if (value === 'BRIDGED') {
            var bridged = Ext.getStore('interfaces').findRecord('interfaceId', record.get('bridgedTo'));
            return 'Bridged to <strong>' + (bridged ? bridged.get('name') : 'undefined') + '</strong>';
        }
    },

    // override checking for dirty records, not needed for interfaces grid
    checkModified: Ext.emptyFn()

});
