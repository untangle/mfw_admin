Ext.define('Mfw.settings.network.InterfacesController', {
    extend: 'Mfw.cmp.grid.MasterGridController',
    alias: 'controller.mfw-settings-network-interfaces',

    init: function (grid) {
        var me = this;
        grid.getStore().on('load', function () {
            console.log('load');
            if (me.statusTout) {
                clearTimeout(me.statusTout);
            }
            me.checkStatus();
        });
    },

    checkStatus: function () {
        var me = this,
            grid = me.getView();
        Ext.Ajax.request({
            url: '/api/status/interfaces/all',
            success: function (response) {
                var status = Ext.decode(response.responseText);

                if (!grid) {
                    if (me.statusTout) {
                        clearTimeout(me.statusTout);
                    }
                    return;
                }

                // match status response with each interface
                grid.getStore().each(function (intf) {
                    var intfStatus = Ext.Array.findBy(status, function (s) {
                        return s.device === intf.get('device');
                    });
                    if (intfStatus) {
                        intf.set('_connected', intfStatus.connected);
                    }
                });

                me.statusTout = setTimeout(function () {
                    me.checkStatus();
                }, 5000);
            },
            failure: function () {
                console.error('Unable to get interfaces status!');
            }
        });
    },

    onAddRecord: function () {
        var me = this,
            intf = Ext.create('Mfw.model.Interface', {
                type: 'OPENVPN',
                configType: 'ADDRESSED',
                wan: true,
                natEgress: true,
                openvpnBoundInterfaceId: 0,
                openvpnUsernamePasswordEnabled: false,
                openvpnUsername: null,
                openvpnPasswordBase64: null
            });

        intf.setOpenvpnConfFile(Ext.create('Mfw.model.OpenVpnConfFile', {
            encoding: 'base64',
            contents: ''
        }));

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
                        intf: intf,
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
    }
});
