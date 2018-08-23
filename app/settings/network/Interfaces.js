Ext.define('Mfw.settings.network.Interfaces', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.mfw-settings-network-interfaces',

    viewTitle: 'Interfaces'.t(),

    scrollable: true,
    store: 'interfaces',

    plugins: ['rowexpander'],

    itemConfig: {
        body: {
            tpl: '<tpl if="dhcpEnabled === true">' +
                    '<div><strong>DHCP</strong>: enabled, <strong>Range</strong>: {dhcpRangeStart} - {dhcpRangeEnd}, <strong>Lease Duration</strong>: {dhcpLeaseDuration/60}</div>' +
                 '</tpl>' +
                 '<div><strong>IPv4</strong>: {v4ConfigType}, {v4StaticAddress} / {v4StaticPrefix}</div>' +
                 '<div><strong>IPv6</strong>: {v6ConfigType}</div>'
        }
    },

    bind: {
        hideHeaders: '{smallScreen}'
    },

    selectable: {
        mode: 'multi'
    },

    columns: [{
        dataIndex: 'name',
        flex: 1,
        renderer: function (val, rec) {
            return rec.get('name') + ' / ' + rec.get('device') + ' / ' + rec.get('configType');
        },
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: true }, small: { hidden: false } },
    }, {
        text: 'Name'.t(),
        dataIndex: 'name',
        flex: 1,
        menuDisabled: true,
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
    }, {
        text: 'Type'.t(),
        dataIndex: 'type',
        menuDisabled: true,
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
    }, {
        text: 'Device'.t(),
        dataIndex: 'device',
        menuDisabled: true,
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
    }, {
        text: 'Config Type'.t(),
        dataIndex: 'configType',
        menuDisabled: true,
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
    }, {
        text: 'Is WAN',
        dataIndex: 'wan',
        align: 'center',
        menuDisabled: true,
        cell: {
            encodeHtml: false,
        },
        renderer: function (value) {
            return value ? '<i class="x-fa fa-check">' : '';
        },
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false }, small: { hidden: true } }
    }, {
        text: 'Edit'.t(),
        width: 'auto',
        menuDisabled: true,
        cell: {
            tools: [{
                type: 'edit',
                iconCls: 'x-fa fa-pencil',
                handler: 'onEdit'
            }]
        }
    }, {
        text: 'Remove'.t(),
        menuDisabled: true,
        cell: {
            tools: [{
                type: 'edit',
                iconCls: 'x-fa fa-trash',
                handler: function (grid, info) {
                    // console.log(info);
                    info.record.drop();
                }
            }]
        }
    }],

    items: [{
        xtype: 'toolbar',
        docked: 'bottom',
        items: [{
            text: 'Save'.t(),
            handler: 'onSave'
        }, {
            text: 'Add'.t(),
            handler: 'onAdd',
        }]
    }],

    controller: {
        onEdit: function (grid, info) {
            var me = this;
            if (!me.dialog) {
                me.dialog = Ext.Viewport.add({
                    xtype: 'interface-dialog',
                    // ownerCmp: grid
                });
            }
            // info.record.getValidation()


            me.dialog.getViewModel().set('rec', info.record);
            me.dialog.show();
        },

        onSave: function () {
            var me = this,
                data = Ext.Array.pluck(me.getView().getStore().getRange(), 'data');

            // console.log(data);
            // console.log(Ext.JSON.encode(data));

            // var original = [{"configType":"ADDRESSED","device":"eth0","dhcpEnabled":true,"dhcpLeaseDuration":3600,"dhcpRangeEnd":"192.168.1.200","dhcpRangeStart":"192.168.1.100","interfaceId":1,"name":"internal","type":"NIC","v4ConfigType":"STATIC","v4StaticAddress":"192.168.1.1","v4StaticPrefix":24,"v6AssignHint":"1234","v6AssignPrefix":64,"v6ConfigType":"ASSIGN","wan":false},{"configType":"ADDRESSED","device":"eth1","interfaceId":2,"name":"external","natEgress":true,"type":"NIC","v4ConfigType":"DHCP","v6ConfigType":"DISABLED","wan":true}];
            // Ext.Ajax.request({
            //     url: Util.server + 'set_settings/network/interfaces',
            //     method: 'POST',
            //     params: Ext.JSON.encode(original),
            //     success: function(response, opts) {
            //         var obj = Ext.decode(response.responseText);
            //         console.dir(obj);
            //     },

            //     failure: function(response, opts) {
            //         console.log('server-side failure with status code ' + response.status);
            //     }
            // });

            me.getView().getStore().sync();
        },

        onAdd: function () {
            var me = this, store = me.getView().getStore();
            var rec = Ext.create('Mfw.model.Interface', {
                name: 'new interface',
                // interfaceId: 0
            });
            store.add(rec);
        }
    }

});
