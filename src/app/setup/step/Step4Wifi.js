Ext.define('Mfw.setup.step.WiFi', {
    extend: 'Ext.Panel',
    alias: 'widget.step-wifi',

    style: 'color: #555;',

    layout: {
        type: 'vbox',
        align: 'middle'
    },

    items: [{
        xtype: 'component',
        width: 500,
        padding: '0 0 24 0',
        html: '<h1 style="text-align: center;">WiFi Connection</h1><hr/>'
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
                boxLabel: 'Enable WiFi Connection',
                bodyAlign: 'start',
                margin: '0 0 16 0'
            }, {
                xtype: 'selectfield',
                userCls: 'x-custom-field',
                name: 'mode',
                label: 'Mode',
                required: true,
                autoSelect: true,
                options: [
                    { text: 'Access Point', value: 'AP' },
                    { text: 'Client', value: 'CLIENT' }
                ],
                listeners: {
                    painted: function (f) { f.focus(); }
                }
            }, {
                xtype: 'numberfield',
                userCls: 'x-custom-field',
                name: 'channel',
                label: 'Channel',
                required: true
            }, {
                xtype: 'selectfield',
                userCls: 'x-custom-field',
                name: 'encryption',
                label: 'Encryption',
                required: true,
                autoSelect: true,
                options: [
                    { text: 'None', value: 'NONE' },
                    { text: 'WPA1', value: 'WPA1' },
                    { text: 'WPA12', value: 'WPA12' },
                    { text: 'WPA2', value: 'WPA2' }
                ]
            }, {
                xtype: 'textfield',
                userCls: 'x-custom-field',
                name: 'ssid',
                label: 'SSID',
                required: true
            }, {
                xtype: 'passwordfield',
                userCls: 'x-custom-field',
                name: 'password',
                label: 'Password',
                required: true
            }]
        }, {
            xtype: 'component',
            margin: '32 0 0 0',
            html: '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>',
            hidden: true,
            bind: { hidden: '{!processing}' }
        }, {
            xtype: 'button',
            margin: '32 0 0 0',
            width: 120,
            text: 'Continue',
            ui: 'action',
            handler: 'onContinue',
            bind: { hidden: '{processing}' }
        }]
    }],

    listeners: {
        activate: 'onActivate'
    },

    controller: {
        onActivate: function () {
            // TODO: check for wifi interface
        },

        onContinue: function () {
            var me = this,
                vm = me.getViewModel(),
                form = me.getView().down('formpanel'),
                wzCtrl = me.getView().up('setup-wizard').getController();

            console.log('on continue');


            if (!form.validate()) { return; }

            vm.set('processing', true);
            wzCtrl.update();
        }
    }


});
