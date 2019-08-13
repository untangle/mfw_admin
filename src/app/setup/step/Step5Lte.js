Ext.define('Mfw.setup.step.Lte', {
    extend: 'Ext.Panel',
    alias: 'widget.step-lte',

    style: 'color: #555;',

    layout: {
        type: 'vbox',
        align: 'middle'
    },

    items: [{
        xtype: 'component',
        width: 500,
        padding: '0 0 24 0',
        html: '<h1 style="text-align: center;">Cellular Connection</h1><hr/>'
    }, {
        xtype: 'formpanel',
        padding: 0,
        keyMapEnabled: true,
        keyMap: {
            enter: {
                key: Ext.event.Event.ENTER,
                handler: 'onContinue'
            }
        },
        layout: {
            type: 'vbox',
            align: 'center'
        },
        items: [{
            xtype: 'container',
            width: 400,
            layout: {
                type: 'vbox'
            },
            defaults: {
                clearable: false,
                labelAlign: 'left'
            },
            items: [{
                xtype: 'checkbox',
                name: 'enabled',
                boxLabel: 'Enable cellular data connection',
                bodyAlign: 'start',
                margin: '0 0 16 0'
            }, {
                xtype: 'selectfield',
                reference: 'network',
                userCls: 'x-custom-field',
                name: 'network',
                label: 'Network',
                required: true,
                autoSelect: true,
                options: [
                    { text: 'T-Mobile', value: 'T-Mobile' },
                    { text: 'Other', value: 'OTHER' }
                ],
                listeners: {
                    painted: function (f) { f.focus(); }
                }
            }, {
                xtype: 'textfield',
                userCls: 'x-custom-field',
                name: 'apn',
                label: 'APN',
                required: true
            }, {
                xtype: 'numberfield',
                userCls: 'x-custom-field',
                name: 'pin',
                label: 'PIN',
                required: false,
                hidden: true,
                bind: {
                    required: '{network.value === "OTHER"}',
                    hidden: '{network.value !== "OTHER"}'
                }
            }, {
                xtype: 'textfield',
                userCls: 'x-custom-field',
                name: 'username',
                label: 'Username',
                required: false,
                hidden: true,
                bind: {
                    required: '{network.value === "OTHER"}',
                    hidden: '{network.value !== "OTHER"}'
                }
            }, {
                xtype: 'passwordfield',
                userCls: 'x-custom-field',
                name: 'password',
                label: 'Password',
                required: false,
                hidden: true,
                bind: {
                    required: '{network.value === "OTHER"}',
                    hidden: '{network.value !== "OTHER"}'
                }
            }]
        }]
    }, {
        xtype: 'container',
        width: 450,
        margin: '36 0 0 0',
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
            // TODO: check for LTE interface
        },

        onContinue: function () {
            var me = this,
                vm = me.getViewModel(),
                form = me.getView().down('formpanel'),
                wzCtrl = me.getView().up('setup-wizard').getController();

            if (form.getValues().enabled && !form.validate()) {
                return;
            }

            vm.set('processing', true);
            wzCtrl.update();
        }
    }


});
