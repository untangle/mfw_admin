Ext.define('Mfw.setup.cmp.Wifi', {
    extend: 'Ext.form.Panel',
    alias: 'widget.wifiform',

    layout: {
        type: 'vbox'
    },

    viewModel: {
        formulas: {
            /**
             * helper formula to deal with interface configType
             * if enabled the configType will be BRIDGED, DISABLED otherwise
             */
            configType: {
                get: function (get) {
                    return get('intf.configType') !== 'DISABLED';
                },
                set: function (value) {
                    this.set('intf.configType', value ? 'BRIDGED' : 'DISABLED');
                }
            }
        }
    },

    items: [{
        xtype: 'container',
        width: 300,
        layout: {
            type: 'vbox'
        },
        defaults: {
            clearable: false,
            labelAlign: 'left',
            // labelTextAlign: 'right'
        },
        items: [{
            xtype: 'component',
            style: 'font-size: 24px;',
            margin: '0 0 32 0',
            bind: {
                html: '{intf.name}'
            }
        }, {
            xtype: 'checkbox',
            boxLabel: 'Enabled',
            bodyAlign: 'start',
            margin: '0 0 16 0',
            bind: {
                checked: '{configType}'
            }
        }, {
            xtype: 'selectfield',
            userCls: 'x-custom-field',
            label: 'Mode',
            required: true,
            autoSelect: true,
            options: [
                { text: 'Access Point', value: 'AP' },
                { text: 'Client', value: 'CLIENT' }
            ],
            disabled: true,
            bind: {
                value: '{intf.wirelessMode}',
                disabled: '{intf.configType === "DISABLED"}'
            }
        }, {
            xtype: 'numberfield',
            userCls: 'x-custom-field',
            label: 'Channel',
            required: true,
            disabled: true,
            bind: {
                value: '{intf.wirelessChannel}',
                disabled: '{intf.configType === "DISABLED"}'
            }
        }, {
            xtype: 'selectfield',
            userCls: 'x-custom-field',
            label: 'Encryption',
            required: true,
            autoSelect: true,
            disabled: true,
            options: [
                { text: 'None', value: 'NONE' },
                { text: 'WPA1', value: 'WPA1' },
                { text: 'WPA12', value: 'WPA12' },
                { text: 'WPA2', value: 'WPA2' }
            ],
            bind: {
                value: '{intf.wirelessEncryption}',
                disabled: '{intf.configType === "DISABLED"}'
            }
        }, {
            xtype: 'textfield',
            userCls: 'x-custom-field',
            label: 'SSID',
            required: true,
            disabled: true,
            bind: {
                value: '{intf.wirelessSsid}',
                disabled: '{intf.configType === "DISABLED"}'
            }
        }, {
            xtype: 'passwordfield',
            userCls: 'x-custom-field',
            name: 'password',
            label: 'Password',
            required: true,
            disabled: true,
            bind: {
                value: '{intf.wirelessPassword}',
                disabled: '{intf.configType === "DISABLED"}'
            }
        }]
    }]
});


