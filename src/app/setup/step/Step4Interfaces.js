Ext.define('Mfw.setup.step.Interfaces', {
    extend: 'Ext.Panel',
    alias: 'widget.step-interfaces',

    viewModel: {
        formulas: {
            infoInterface: function (get) {
                var intf = get('interfaces.selection'), str = [], v4 = '';
                if (!intf) {
                    return '<i class="x-fa fa-info-circle" style="color: #777;"></i>&nbsp; Select an Interface to see more information!';
                }

                str.push(intf.get('type'));
                str.push(intf.get('configType'));

                v4 = intf.get('v4ConfigType');
                if (intf.get('v4StaticAddress')) {
                    v4 += ', ' + intf.get('v4StaticAddress') + '/' + intf.get('v4StaticPrefix');
                }
                str.push(v4);
                return str.join(' &nbsp;|&nbsp; ');
            },
            infoDevice: function (get) {
                var intf = get('interfaces.selection'), device;
                if (!intf) {
                    return;
                }
                device = Mfw.app.getStore('devices').findRecord('name', intf.get('device'));
                if (!device) {
                    return;
                }
                return 'duplex: ' + device.get('duplex') + ' | mtu: ' + (device.get('mtu') || '-');
            }
        }
    },

    style: 'color: #555;',

    layout: 'vbox',

    items: [{
        xtype: 'component',
        padding: '0 0 24 0',
        html: '<h1 style="text-align: center;">Interfaces</h1><hr/>'
    }, {
        xtype: 'grid',
        reference: 'interfaces',
        flex: 1,
        store: 'interfaces',
        rowLines: false,
        selectable: false,
        columns: [
        // {
        //     dataIndex: 'status',
        //     width: 40,
        //     cell: {
        //         encodeHtml: false,
        //     },
        //     renderer: function (v) {
        //         if (v === 'CONNECTED') {
        //             return '<i class="x-fa fa-circle" style="color: green;"></i>'
        //         }
        //         if (v === 'DISCONNECTED') {
        //             return '<i class="x-fa fa-circle" style="color: #999;"></i>'
        //         }
        //         return '<i class="x-fa fa-exclamation-circle" style="color: orange;"></i>'
        //     }
        // },
        {
            text: 'Id'.t(),
            dataIndex: 'interfaceId',
            align: 'right',
            width: 40,
            resizable: false,
            sortable: false,
            menuDisabled: true
        }, {
            text: 'Name'.t(),
            dataIndex: 'name',
            flex: 1,
            minWidth: 150,
            cell: { encodeHtml: false },
            renderer: function (value, record) {
                if (record.get('wan')) {
                    return '<strong>' + value + ' (WAN) </strong>';
                }
                return '<strong>' + value + '</strong>';
            }
            // responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
        }, {
            text: 'Type'.t(),
            dataIndex: 'type',
            width: 70
            // responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
        }, {
            text: 'Device'.t(),
            dataIndex: 'device',
            menuDisabled: true,
            width: 70
            // responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
        }, {
            text: 'Config Type'.t(),
            dataIndex: 'configType',
            menuDisabled: true,
            minWidth: 150,
            cell: {
                encodeHtml: false,
            },
            renderer: 'configTypeRenderer'
            // responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
        }, {
            text: 'IPv4'.t(),
            width: 180,
            dataIndex: 'v4ConfigType',
            menuDisabled: true,
            renderer: function (value, record) {
                if (value === 'DHCP' || value === 'PPPOE') {
                    return value;
                }
                if (value === 'STATIC') {
                    return 'STATIC, ' + record.get('v4StaticAddress');
                }
                return '-';
            }
            // responsiveConfig: { large: { hidden: false }, small: { hidden: true } }
        }, {
            text: 'IPv6'.t(),
            width: 180,
            dataIndex: 'v6ConfigType',
            menuDisabled: true,
            renderer: function (value) {
                if (value) {
                    return value;
                }
                return '-';
            }
            // responsiveConfig: { large: { hidden: false }, small: { hidden: true } }
        }, {
            text: 'MAC',
            dataIndex: 'macaddr',
            minWidth: 140,
            menuDisabled: true
        }, {
            // align: 'center',
            width: 80,
            cell: {
                tools: {
                    up: {
                        iconCls: 'x-fa fa-arrow-circle-up',
                        tooltip: 'Move Up',
                        handler: function (grid, info) {
                            var store = grid.getStore(), rec = info.record;
                            var oldIdx = store.indexOf(rec);
                            store.removeAt(oldIdx);
                            store.insert(oldIdx - 1 , rec);
                        }
                    }
                }
            }
        }]
    }, {
        xtype: 'container',
        flex: 1,
        layout: { type: 'hbox', align: 'top', pack: 'right' },
        items: [{
            xtype: 'button',
            margin: '0 16 0 0',
            text: 'Refresh Interfaces'
        }, {
            xtype: 'button',
            width: 150,
            text: 'Continue',
            ui: 'action',
            handler: 'onContinue'
        }]
    }],
    listeners: {
        activate: 'onActivate'
    },

    controller: {
        onActivate: function (view) {
            Ext.getStore('interfaces').load();

            // Mfw.app.getStore('devices').load();

            // console.log(store.getData());
            // view.lookup('interfaces').getStore().load();
            // console.log('activate');
        },

        configTypeRenderer: function (value, record) {
            if (value === 'ADDRESSED') {
                return 'Addressed';
            }
            if (value === 'DISABLED') {
                return 'Disabled';
            }
            if (value === 'BRIDGED') {
                return 'Bridged to <strong>' + Ext.getStore('interfaces').findRecord('interfaceId', record.get('bridgedTo')).get('name') + '</strong>';
            }
        },

        onContinue: function (cb) {
            var me = this,
                wizard = me.getView().up('#wizard'),
                layout = wizard.getLayout();

            layout.next();
        }
    }

});
