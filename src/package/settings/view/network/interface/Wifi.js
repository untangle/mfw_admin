Ext.define('Mfw.settings.network.interface.Wifi', {
    extend: 'Ext.Container',
    alias: 'widget.interface-wifi',
    itemId: 'wifi',

    headerTitle: 'WiFi'.t(),

    scrollable: 'y',

    padding: 8,
    layout: {
        type: 'form',
        itemSpacing: 8
    },

    defaults: {
        labelTextAlign: 'right',
        labelWidth: 100
    },

    items: [{
        xtype: 'textfield',
        name: 'wirelessSsid',
        label: 'Wireless SSID'.t(),
        required: true,
        bind: '{record.wirelessSsid}'
    }, {
        xtype: 'selectfield',
        name: 'wirelessEncryption',
        label: 'Wireless Encryption'.t(),
        bind: '{record.wirelessEncryption}',
        options: [
            { text: 'None'.t(), value: 'NONE' },
            { text: 'WPA1'.t(), value: 'WPA1' },
            { text: 'WPA12'.t(), value: 'WPA12' },
            { text: 'WPA2'.t(), value: 'WPA2' }
        ]
    }, {
        xtype: 'selectfield',
        name: 'wirelessMode',
        label: 'Wireless Mode'.t(),
        bind: '{record.wirelessMode}',
        options: [
            { text: 'AP'.t(), value: 'AP' },
            { text: 'Client'.t(), value: 'CLIENT' }
        ]
    }, {
        xtype: 'passwordfield',
        name: 'wirelessPassword',
        label: 'Wireless Password'.t(),
        required: true,
        bind: '{record.wirelessPassword}'
    }, {
        xtype: 'numberfield',
        name: 'wirelessChannel',
        label: 'Wireless Channel'.t(),
        required: true,
        bind: '{intf.wirelessChannel}'
    }]
});
