Ext.define('Mfw.settings.network.InterfacesController', {
    extend: 'Mfw.cmp.grid.MasterGridController',
    alias: 'controller.mfw-settings-network-interfaces',

    onAddInterface: function (mItem) {
        var me = this, type = mItem.type, newIntf;

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
             * when creating a new wireguard interface is WAN by defalt meaning:
             * - interface port defaults to 51820
             * - has only a single peer having Allowed IPv4 to default '0.0.0.0/0'
             * IMPORTANT!
             * the wireguardPrivateKey and peer publicKey should be handled on backend
             */
            newIntf = Ext.create('Mfw.model.Interface', {
                type: 'WIREGUARD',
                configType: 'ADDRESSED',
                wan: true,
                natEgress: true,
                wireguardPrivateKey: btoa(Math.random().toFixed(32).substr(2)),
                wireguardAddresses: [],
                wireguardPort: 51820
            });

            /**
             * IMPORTANT!
             * the peer should be handled in backend
             * kept to avoid current exceptions if ommited
             */
            newIntf.wireguardPeers().add({
                publicKey: btoa(Math.random().toFixed(32).substr(2)),
                allowedIps: ['0.0.0.0/0'] // catch-all IPv4 addresses
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
