Ext.define('Mfw.setup.step.Interface', {
    extend: 'Ext.form.Panel',
    alias: 'widget.step-interface',

    style: 'color: #555;',

    bodyPadding: 0,
    layout: 'fit',

    viewModel: {
        formulas: {
            bridgedOptions: function (get) {
                var interfaces = [];
                Ext.getStore('interfaces').each(function (interface) {
                    // interface should be ADDRESSED
                    if (interface.get('interfaceId') === get('intf.interfaceId') ||
                        interface.get('configType') !== 'ADDRESSED') {
                            return;
                        }

                    interfaces.push({
                        text: interface.get('name'),
                        value: interface.get('interfaceId')
                    });
                });
                return interfaces;
            },

            ipv6Configs: function (get) {
                var options;
                if (get('intf.wan')) {
                    options = [
                        { text: 'Disabled'.t(),  value: 'DISABLED' },
                        { text: 'Static'.t(),   value: 'STATIC' },
                        { text: 'SLAAC'.t(), value: 'SLAAC' },
                        { text: 'DHCP'.t(), value: 'DHCP' }
                    ];
                } else {
                    options = [
                        { text: 'Disabled'.t(),  value: 'DISABLED' },
                        { text: 'Static'.t(),   value: 'STATIC' },
                        { text: 'Assign'.t(), value: 'ASSIGN' }
                    ];
                }
                return options;
            }
        }
    },

    items: [{
        xtype: 'toolbar',
        width: '250',
        docked: 'left',
        // shadow: false,
        style: 'background: #f5f5f5',
        zIndex: 10,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'component',
            // padding: '0',
            bind: {
                html: '<h1 style="line-height: 1;"><strong>{intf.name}</strong> <br/><span style="font-size: 14px;">Interface #{intf.interfaceId} ({intf.device})</span></h1>'
            }
        }, {
            xtype: 'component',
            html: '<hr/>'
        }, {
            xtype: 'textfield',
            name: 'name',
            label: 'Name',
            required: true,
            maxLength: 9,
            clearable: false,
            bind: '{intf.name}',
        }, {
            xtype: 'selectfield',
            name: 'configType',
            label: 'Configuration Type',
            required: true,
            bind: '{intf.configType}',
            options: [
                { text: 'Addressed'.t(), value: 'ADDRESSED' },
                { text: 'Bridged'.t(),   value: 'BRIDGED' },
                { text: 'Disabled'.t(),  value: 'DISABLED' }
            ]
        }, {
            xtype: 'selectfield',
            name: 'bridgedTo',
            label: 'Bridged To'.t(),
            editable: false,
            required: false,
            autoSelect: true,
            forceSelection: true,
            hidden: true,
            bind: {
                value: '{intf.bridgedTo}',
                hidden: '{intf.configType !== "BRIDGED"}',
                required: '{intf.configType === "BRIDGED"}',
                options: '{bridgedOptions}'
            }
        }, {
            xtype: 'checkboxfield',
            name: 'wan',
            boxLabel: 'is WAN interface'.t(),
            bodyAlign: 'start',
            bind: {
                checked: '{intf.wan}',
                hidden: '{intf.configType !== "ADDRESSED"}'
            },
            listeners: {
                // uncheck: function (ck) {
                //     ck.up('formpanel').down('[name=v4ConfigType]').setValue('STATIC');
                // }
            }
        }, {
            xtype: 'displayfield',
            label: 'Type',
            bind: {
                value: '{intf.type}'
            }
        },
        // {
        //     xtype: 'displayfield',
        //     label: 'Mac',
        //     bind: {
        //         value: '{intf.macaddr}'
        //     }
        // }
        ]
    }, {
        xtype: 'container',
        layout: 'fit',
        items: [{
            xtype: 'segmentedbutton',
            docked: 'top',
            userCls: 'button-tabs',
            margin: 16,
            allowMultiple: false,
            reference: 'viewSelection',
            defaults: {
                ripple: false,
                hidden: true,
                bind: {
                    hidden: '{intf.configType !== "ADDRESSED"}'
                },
            },
            items: [
                { text: 'IPv4', value: '#ipv4', pressed: true },
                { text: 'IPv6', value: '#ipv6' },
                { text: 'DHCP', value: '#dhcp' },
                { text: 'VRRP', value: '#vrrp' },
                {
                    text: 'WiFi',
                    value: '#wifi',
                    hidden: true,
                    bind: {
                        hidden: '{intf.type !== "WIFI" && intf.configType !== "DISABLED"}'
                    }
                }
            ]
        }, {
            xtype: 'panel',
            itemId: 'cardPanel',
            layout: {
                type: 'card',
                deferRender: false
                // animation: {
                //     duration: 150,
                //     type: 'slide',
                //     direction: 'horizontal'
                // },
            },
            flex: 1,
            margin: '0 16 16 16',
            // defaults: {
            //     hidden: true,
            // },
            activeItem: 1,
            // hidden: true,
            bind: {
                activeItem: '{viewSelection.value}',
                // hidden: '{intf.configType !== "ADDRESSED" || (intf.type === "WIFI" && intf.configType === "DISABLED")}'
            },
            items: [
                { xtype: 'interface-ipv4', itemId: 'ipv4', hidden: true, bind: { hidden: '{intf.configType !== "ADDRESSED"}' } },
                { xtype: 'interface-ipv6', itemId: 'ipv6' },
                { xtype: 'interface-dhcp', itemId: 'dhcp' },
                { xtype: 'interface-vrrp', itemId: 'vrrp' },
                { xtype: 'interface-wifi', itemId: 'wifi' }
            ]
        }]
    }],
    listeners: {
        activate: 'onActivate'
    },
    controller: {
        onActivate: function (view) {
            var intf = view.getViewModel().get('intf');
            if (intf.get('type') === 'WIFI') {
                view.down('segmentedbutton').setValue('#wifi');
            }
        },

        continue: function (cb) {
            var me = this,
                store = Mfw.app.getStore('interfaces'),
                form = me.getView(),
                wizard = form.up('setup-wizard');

            if (!form.validate()) {
                Ext.toast('Please check and correct invalid fields!', 3000);
                return;
            }

            wizard.mask({xtype: 'loadmask' });
            wizard.lookup('bbar').mask();

            // Important! Mark all records as dirty so whole array is pushed back to server
            store.each(function (record) {
                record.dirty = true;
            });

            // me.getView().mask();
            store.sync({
                success: function () {
                    cb(); // move to the next step
                },
                failure: function () {
                    console.log('failure');
                },
                callback: function () {
                    wizard.unmask(); wizard.lookup('bbar').unmask();
                    // me.getView().unmask();
                }
            });
            // cb();
        },
    }
});
