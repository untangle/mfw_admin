Ext.define('Mfw.setup.step.Interfaces', {
    extend: 'Ext.Panel',
    alias: 'widget.step-interfaces',

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

        columns: [{
            text: 'Name [ id ] / Type / Device',
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
                        // bind: {
                        //     hidden: '{record.configType !== "ADDRESSED" && record.type !== "WIFI"}'
                        // },
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
            handler: 'refresh',
            width: 120
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
            handler: 'onContinue',
            hidden: true,
            bind: { hidden: '{processing}' }
        }, {
            flex: 1,
            margin: '0 120 0 0'
        }]
    }],
    listeners: {
        activate: 'onActivate'
    },

    controller: {
        onActivate: function () {
            var store = Ext.getStore('interfaces');
            store.load();
            store.clearFilter(true);
            store.setFilters([
                { property: 'hidden', value: false }
            ]);
        },

        configTypeRenderer: function (value, record) {
            if (value === 'ADDRESSED') {
                return 'Addressed';
            }
            if (value === 'DISABLED') {
                return 'Disabled';
            }
            if (value === 'BRIDGED') {
                var bridged = Ext.getStore('interfaces').findRecord('interfaceId', record.get('bridgedTo'));
                return 'Bridged to <strong>' + (bridged ? bridged.get('name') : 'undefined') + '</strong>';
            }
        },

        onContinue: function () {
            var me = this,
                wzCtrl = me.getView().up('setup-wizard').getController();

            me.getViewModel().set('processing', true);
            wzCtrl.update();
            // interfaces are updated on each editing instance

            // Ext.getStore('interfaces').each(function (record) {
            //     record.dirty = true;
            //     record.phantom = false;
            // });

            // Ext.getStore('interfaces').sync({
            //     success: function () {
            //         wzCtrl.update();
            //     }
            // });
        },

        onEdit: function (grid, info) {
            var me = this;
            Ext.Viewport.add({
                xtype: 'interface-dialog',
                ownerCmp: me.getView(),
                viewModel: {
                    data: {
                        interface: info.record,
                        action: 'EDIT'
                    }
                }
            }).show();
        },

        refresh: function () {
            Ext.getStore('interfaces').load();
        }
    }

});
