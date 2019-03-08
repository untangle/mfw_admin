Ext.define('Mfw.setup.step.Interfaces', {
    extend: 'Ext.Panel',
    alias: 'widget.step-interfaces',

    viewModel: {},

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
        itemConfig: {
            viewModel: true,
        },

        columns: [
        // {
        //     width: 5,
        //     minWidth: 5,
        //     sortable: false,
        //     hideable: false,
        //     resizable: false,
        //     menuDisabled: true,
        //     cell: {
        //         userCls: 'x-statuscolumn'
        //     },
        //     renderer: function (value, record, dataIndex, cell) {
        //         cell.setUserCls('');
        //         if (record.isDirty()) {
        //             cell.setUserCls('status-dirty');
        //         }
        //         if (record.get('_deleteSchedule')) {
        //             cell.setUserCls('status-delete');
        //         }
        //         if (record.phantom) {
        //             cell.setUserCls('status-phantom');
        //         }
        //     }
        // }, {
        //     text: 'Id'.t(),
        //     dataIndex: 'interfaceId',
        //     align: 'right',
        //     width: 40,
        //     resizable: false,
        //     sortable: false,
        //     menuDisabled: true
        // },
        {
            text: 'Name [id] / Type / Device',
            dataIndex: 'name',
            flex: 1,
            minWidth: 150,
            menuDisabled: true,
            sortable: false,
            cell: { encodeHtml: false },
            renderer: function (value, record) {
                return '<b>' + record.get('name') + ' [ ' + record.get('interfaceId') + ' ]</b> / ' + record.get('type') + ' / ' + record.get('device');
                // if (record.get('wan')) {
                //     return '<strong>' + value + ' (WAN) </strong>';
                // }
                // return '<strong>' + value + '</strong>';
            }
            // responsiveConfig: { large: { hidden: false }, small: { hidden: true } },
        }, {
            text: 'Config'.t(),
            dataIndex: 'configType',
            menuDisabled: true,
            sortable: false,
            minWidth: 150,
            cell: {
                encodeHtml: false,
            },
            renderer: 'configTypeRenderer'
        }, {
            text: 'IPv4'.t(),
            width: 180,
            dataIndex: 'v4ConfigType',
            sortable: false,
            menuDisabled: true,
            renderer: function (value, record) {
                if (value === 'DHCP' || value === 'PPPOE') {
                    return value;
                }
                if (value === 'STATIC') {
                    return 'STATIC, ' + record.get('v4StaticAddress') + '/' + record.get('v4StaticPrefix');
                }
                return '-';
            }
        }, {
            text: 'IPv6'.t(),
            width: 180,
            dataIndex: 'v6ConfigType',
            sortable: false,
            menuDisabled: true,
            renderer: function (value) {
                if (value) {
                    return value;
                }
                return '-';
            }
        }, {
            text: 'MAC',
            dataIndex: 'macaddr',
            minWidth: 140,
            sortable: false,
            menuDisabled: true
        }, {
            width: 44,
            sortable: false,
            resizable: false,
            menuDisabled: true,
            cell: {
                tools: {
                    edit: {
                        bind: {
                            hidden: '{record.configType !== "ADDRESSED" && record.type !== "WIFI"}'
                        },
                        handler: 'onEdit',
                    }
                }
            }
        }]
    }, {
        xtype: 'container',
        flex: 1,
        layout: { type: 'hbox', align: 'top', pack: 'center' },
        items: [{
            xtype: 'button',
            iconCls: 'md-icon-refresh',
            text: 'Refresh',
            handler: 'refresh'
        }, {
            flex: 1
        }, {
            xtype: 'component',
            html: '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>',
            hidden: true,
            bind: { hidden: '{!processing}' }
        }, {
            xtype: 'button',
            width: 150,
            text: 'Continue',
            ui: 'action',
            handler: 'onContinue'
        }, {
            flex: 1
        }]
    }],
    listeners: {
        activate: 'onActivate'
    },

    controller: {
        onActivate: function () {
            Ext.getStore('interfaces').load();
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
                wzCtrl = me.getView().up('setup-wizard').getController();

            // each interface is updated upon editing

            wzCtrl.update();

            // Ext.getStore('interfaces').sync({
            //     success: function () {
            //         console.log('OK');
            //     }
            // });
        },

        editv4: function (grid, info) {
            var me = this;
            Ext.Viewport.add({
                xtype: 'setup-interface-ipv4',
                ownerCmp: me.getView(),
                viewModel: {
                    data: {
                        interface: info.record
                    }
                }
            }).show();
        },

        onEdit: function (grid, info) {
            var me = this;
            Ext.Viewport.add({
                xtype: 'setup-interface-dialog',
                ownerCmp: me.getView(),
                viewModel: {
                    data: {
                        interface: info.record
                    }
                }
            }).show();
        },

        refresh: function () {
            Ext.getStore('interfaces').load();
        }
    }

});
