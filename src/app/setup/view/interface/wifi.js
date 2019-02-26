Ext.define('Mfw.setup.interface.Wifi', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-wifi',

    // title: 'WiFi Settings'.t(),
    bodyPadding: 16,
    layout: 'vbox',
    scrollable: 'y',

    defaults: {
        labelAlign: 'left',
        labelWidth: 130,
        disabled: true
    },


    items: [{
        xtype: 'textfield',
        label: 'Wireless SSID'.t(),
        required: true,
        bind: {
            value: '{intf.wirelessSsid}',
            disabled: '{intf.type !== "WIFI"}'
        }
    }, {
        xtype: 'selectfield',
        label: 'Wireless Encryption'.t(),
        bind: {
            value: '{intf.wirelessEncryption}',
            disabled: '{intf.type !== "WIFI"}'
        },
        options: [
            { text: 'None'.t(), value: 'NONE' },
            { text: 'WPA1'.t(), value: 'WPA1' },
            { text: 'WPA12'.t(), value: 'WPA12' },
            { text: 'WPA2'.t(), value: 'WPA2' }
        ]
    }, {
        xtype: 'selectfield',
        label: 'Wireless Mode'.t(),
        bind: {
            value: '{intf.wirelessMode}',
            disabled: '{intf.type !== "WIFI"}'
        },
        options: [
            { text: 'AP'.t(), value: 'AP' },
            { text: 'Client'.t(), value: 'CLIENT' }
        ]
    }, {
        xtype: 'passwordfield',
        label: 'Wireless Password'.t(),
        required: true,
        bind: {
            value: '{intf.wirelessPassword}',
            disabled: '{intf.type !== "WIFI"}'
        },
        validators: [{
            type: 'length',
            min: 8
        }]
    }, {
        xtype: 'numberfield',
        label: 'Wireless Channel'.t(),
        required: true,
        bind: {
            value: '{intf.wirelessChannel}',
            disabled: '{intf.type !== "WIFI"}'
        }
    }]
});
