Ext.define('Mfw.setup.step.Interface', {
    extend: 'Ext.form.Panel',
    alias: 'widget.step-interface',

    style: 'color: #555;',

    bodyPadding: 0,
    layout: 'fit',

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
            bind: {
                checked: '{intf.wan}',
                hidden: '{intf.configType !== "ADDRESSED"}'
            },
            listeners: {
                uncheck: function (ck) {
                    ck.up('formpanel').down('[name=v4ConfigType]').setValue('STATIC')
                }
            }
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
        items: [
            { xtype: 'interface-ipv4' },
            { xtype: 'interface-ipv6' },
            { xtype: 'interface-dhcp' },
            { xtype: 'interface-vrrp' }
        ]
    }],

    controller: {
        continue: function (cb) {
            var me = this,
                store = Mfw.app.getStore('interfaces'),
                form = me.getView()
                wizard = form.up('setup-wizard');

            if (!form.validate()) {
                Ext.toast('Please check and correct invalid fields!', 3000);
                return;
            }

            wizard.mask(); wizard.lookup('bbar').mask();

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
