Ext.define('Mfw.setup.step.Interface', {
    extend: 'Ext.form.Panel',
    alias: 'widget.step-interface',

    style: 'color: #555;',

    bodyPadding: 0,
    layout: 'fit',
    // layout: {
    //     type: 'hbox',
    //     layout: 'stretch'
    // },

    // viewModel: {
    //     formulas: {
    //         isStatic: function (get) {
    //             return get('intf.v4ConfigType')
    //         }
    //     }
    // }

    items: [{
        xtype: 'toolbar',
        width: '250',
        docked: 'left',
        // shadow: false,
        style: 'background: #f5f5f5',
        zIndex: 888,
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
            xtype: 'checkboxfield',
            name: 'wan',
            boxLabel: 'is WAN interface'.t(),
            bodyAlign: 'start',
            // checked: true,
            bind: {
                checked: '{intf.wan}',
                // checked: '{intf.wan}',
                hidden: '{intf.configType !== "ADDRESSED"}'
            },
            listeners: {
                initialize: function (ck) {
                    console.log('ck init');
                    ck.setValue(false);
                    console.log(ck.up('formpanel').getValues());
                },
                uncheck: function (ck) {
                    console.log('uncheck')
                    ck.up('formpanel').down('[name=v4ConfigType]').setValue('STATIC')
                    // console.log(val);
                }
            }

            // xtype: 'togglefield',
            // name: 'wan',
            // // margin: '0 16',
            // boxLabel: 'Is WAN'.t(),
            // // labelAlign: 'left',
            // required: true,
            // hidden: true,
            // bind: {
            //     value: '{intf.wan}',
            //     hidden: '{intf.configType !== "ADDRESSED"}'
            // }
        }, {
            xtype: 'displayfield',
            label: 'Type',
            bind: {
                value: '{intf.type}'
            }
        }, {
            xtype: 'displayfield',
            label: 'Mac',
            bind: {
                value: '{intf.macaddr}'
            }
        }]
    }, {
        xtype: 'tabpanel',
        activeItem: 0,
        tabBar: {
            shadow: false
        },
        layout: {
            type: 'card',
            animation: {
                type: 'fade',
                duration: 150,
                direction: 'horizontal'
            }
        },
        // defaults: {
        //     bodyPadding: 16
        // },
        items: [{
                title: 'IPv4',
                xtype: 'interface-ipv4'
            }, {
                title: 'IPv6',
                html: 'ipv6'
            }, {
                title: 'DHCP',
                html: 'dhcp'
            }, {
                title: 'VRRP',
                html: 'vrrp'
            }
        ]
    }],

    controller: {
        next: function (cb) {
            var me = this, form = me.getView();

            // Ext.Object.each(form.getValues(), function (key, val) {
            //     console.log(key, val);
            // });

            // console.log(form.getFields());
            // console.log(form.getViewModel().get('intf'));

            if (!form.validate()) { return; }

            // console.log(form.getViewModel().get('intf'));

            // form.getViewModel().get('intf').save();

            // to do update password and relogin
            cb();
        },
    }




});
