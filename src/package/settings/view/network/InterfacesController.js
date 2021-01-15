Ext.define('Mfw.settings.network.InterfacesController', {
    extend: 'Mfw.cmp.grid.MasterGridController',
    alias: 'controller.mfw-settings-network-interfaces',

    onAddInterface: function (mItem) {
        var me = this, type = mItem.type, newIntf;

        if (type === 'VLAN') {
            newIntf = Ext.create('Mfw.model.Interface', {
                type: 'VLAN',
                configType: 'ADDRESSED',
                wan: false,
                v4ConfigType: 'STATIC',
                natEgress: false
            })
        }

        if (type === 'OPENVPN') {
            newIntf = Ext.create('Mfw.model.Interface', {
                type: 'OPENVPN',
                configType: 'ADDRESSED',
                wan: true,
                natEgress: true,
                boundInterfaceId: 0,
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
                 * this is dummy set for now as it is required upon interface creation
                 * should be removed later (see MFW-940)
                 */
                wireguardPrivateKey: null,
                wireguardPublicKey: null,
                /**
                * Type of edit mode - default to paste
                */
                wireguardEditMode: "PASTE",
                /**
                 * Type of connection - client or tunnel.
                 */
                wireguardType: "CLIENT",
                /**
                 * the default WireGuard port.  Only matters if wireguardType is TUNNEL
                 */
                wireguardPort: 51820
            });

            /**
             * WireGuard unique peer
             */
            var peer = newIntf.wireguardPeers().add({
                // peer 'host' can be an IP or hostname, user defined
                host: '',
                // peer port, not set in UI
                port: 51820,
                // peer 'publicKey', user defined
                publicKey: '',
                // peer 'presharedKey' is not implemented and used yet
                presharedKey: null,
                // peer 'keepalive' defaults to 60 seconds (not shown and not changeable)
                keepalive: 60,
                // peer 'routeAllowedIps' always true (not shown and not changeable)
                routeAllowedIps: true
            });
            /**
               * preset to allow all IPv4 addresses
               * passed as an array as backend expect it to be
            */
            peer[0].allowedIps().add({
                address: '0.0.0.0',
                prefix: 0
            });

            /**
             * Generate WireGuard private/public keypair.
             */
            Ext.Ajax.request({
                url: Util.api + '/wireguard/keypair',
                method: 'GET',
                async: false,
                success: function (response) {
                    var keypair = JSON.parse(response.responseText);
                    newIntf.set('wireguardPrivateKey', keypair.privateKey);
                    newIntf.set('wireguardPublicKey', keypair.publicKey);
                },
                failure: function () {
                }
            });
            /**
             * Generate namespace for WireGuard interface.
             */
            Ext.Ajax.request({
                url: Util.api + '/netspace/request',
                method: 'POST',
                params: Ext.JSON.encode({
                    ipVersion: "4",
                    hostID: "1",
                    networkSize: "1"
                }),
                async: false,
                success: function (response) {
                    var netspace = JSON.parse(response.responseText);
                    var ipAddress = netspace["network"];
                    ipAddress = ipAddress.substring(0, ipAddress.lastIndexOf(".") + 1) + "1";
                    var prefix = netspace["cidr"].substring(netspace["cidr"].lastIndexOf("/") + 1);
                    newIntf.wireguardAddresses().add({
                        'address': ipAddress,
                        'prefix': prefix
                    });
                },
                failure: function () {
                }
            });
        }

        me.intfDialog = Ext.Viewport.add({
            xtype: 'dialog',
            ownerCmp: me.getView(),
            layout: 'fit',
            width: 416,
            height: Ext.getBody().getViewSize().height < 800 ? (Ext.getBody().getViewSize().height - 20) : 800,
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
            me.intfDialog = null;
        });
        me.intfDialog.show();
    },

    onEditRecord: function (grid, info) {
        Mfw.app.redirectTo('settings/network/interfaces/' + info.record.get('interfaceId'));
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
