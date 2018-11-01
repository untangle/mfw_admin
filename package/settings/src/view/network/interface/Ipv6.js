Ext.define('Mfw.settings.network.interface.Ipv6', {
    extend: 'Ext.Container',
    alias: 'widget.interface-ipv6',
    itemId: 'ipv6',

    headerTitle: 'IPv6'.t(),

    layout: 'vbox',

    scrollable: 'y',

    items: [{
        xtype: 'combobox',
        name: 'v6ConfigType',
        reference: 'v4Config',
        label: 'Config Type'.t(),
        labelAlign: 'left',
        queryMode: 'local',
        displayField: 'name',
        valueField: 'value',
        editable: false,
        margin: '0 16',
        disabled: true,
        bind: {
            value: '{rec.v6ConfigType}',
            disabled: '{!rec.wan}'
        },
        store: [
            { name: 'Auto (DHCP)'.t(), value: 'DHCP' },
            { name: 'SLAAC'.t(), value: 'SLAAC' },
            { name: 'Assign'.t(), value: 'ASSIGN' },
            { name: 'Static'.t(),   value: 'STATIC' },
            { name: 'Disabled'.t(),  value: 'DISABLED' }
        ]
    }, {
        xtype: 'container',
        padding: 16,
        hidden: true,
        bind: { hidden: '{rec.v6ConfigType !== "DHCP"}' },
        html: 'DHCP conf'
    }, {
        xtype: 'container',
        padding: 16,
        hidden: true,
        bind: { hidden: '{rec.v6ConfigType !== "SLAAC"}' },
        html: 'SLAAC conf'
    }, {
        xtype: 'container',
        padding: 8,
        hidden: true,
        bind: { hidden: '{rec.v6ConfigType !== "ASSIGN"}' },
        layout: {
            type: 'form',
            itemSpacing: 8
        },
        defaults: {
            labelTextAlign: 'right',
            labelWidth: 100,
        },
        items: [{
            xtype: 'textfield',
            name: 'v6AssignHint',
            label: 'Assign Hint'.t(),
            errorLabel: 'IPv6 Assign Hint'.t(),
            required: false,
            bind: {
                value: '{rec.v6AssignHint}',
                required: '{rec.v6ConfigType === "ASSIGN"}'
            }
        }, {
            xtype: 'numberfield',
            name: 'v6AssignPrefix',
            label: 'Assign Prefix'.t(),
            errorLabel: 'IPv6 Assign Prefix'.t(),
            placeholder: 'Integer between 1 and 128',
            decimals: 0,
            minValue: 1,
            maxValue: 128,
            required: false,
            allowBlank: true,
            bind: {
                value: '{rec.v6AssignPrefix}',
                required: '{rec.v6ConfigType === "ASSIGN"}'
            }
        }]
    }, {
        xtype: 'container',
        padding: 8,
        hidden: true,
        bind: { hidden: '{rec.v6ConfigType !== "STATIC"}' },
        layout: {
            type: 'form',
            itemSpacing: 8
        },
        defaults: {
            labelTextAlign: 'right',
            labelWidth: 100,
        },
        defaultType: 'textfield',
        items: [{
            label: 'Address'.t(),
            name: 'v6StaticAddress',
            bind: '{rec.v6StaticAddress}'
        }, {
            xtype: 'numberfield',
            name: 'v6StaticPrefix',
            label: 'Prefix Length'.t(),
            bind: '{rec.v6StaticPrefix}',
        }, {
            label: 'Gateway'.t(),
            name: 'v6StaticGateway',
            hidden: true,
            bind: {
                value: '{rec.v6StaticGateway}',
                hidden: '{!rec.wan}'
            }
        }, {
            label: 'Primary DNS'.t(),
            name: 'v6StaticDNS1',
            hidden: true,
            bind: {
                value: '{rec.v6StaticDNS1}',
                hidden: '{!rec.wan}'
            }
        }, {
            label: 'Secondary DNS'.t(),
            name: 'v6StaticDNS2',
            hidden: true,
            bind: {
                value: '{rec.v6StaticDNS2}',
                hidden: '{!rec.wan}'
            }
        }]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        hidden: true,
        bind: { hidden: '{rec.v6ConfigType === "DISABLED"}' },
        items: ['->', {
            xtype: 'button',
            text: 'IPv6 Aliases',
            // textAlign: 'right',
            // iconCls: 'x-fa fa-arrow-right',
            // iconAlign: 'right',
            // flex: 1,
            handler: function(btn) {
                btn.up('formpanel').setActiveItem('#ipv6-aliases');
            }
        }]
    }]
});
