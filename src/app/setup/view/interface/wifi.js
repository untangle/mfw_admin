Ext.define('Mfw.setup.interface.Wifi', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-wifi',

    title: 'WiFi Settings'.t(),
    bodyPadding: 16,
    layout: 'vbox',
    scrollable: 'y',

    defaults: {
        labelAlign: 'left',
        labelWidth: 130
    },

    items: [{
        xtype: 'textfield',
        label: 'Wireless SSID'.t(),
        required: true,
        bind: {
            value: '{intf.wirelessSsid}',
        }
    }, {
        xtype: 'selectfield',
        label: 'Wireless Encryption'.t(),
        bind: {
            value: '{intf.wirelessEncryption}',
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
        }
    }, {
        xtype: 'numberfield',
        label: 'Wireless Channel'.t(),
        required: true,
        bind: {
            value: '{intf.wirelessChannel}',
        }
    }]
});
