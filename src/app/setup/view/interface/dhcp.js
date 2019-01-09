Ext.define('Mfw.setup.interface.Dhcp', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-dhcp',

    title: 'DHCP'.t(),

    layout: 'fit',

    scrollable: 'y',


    items: [{
        xtype: 'panel',
        flex: 1,
        bodyPadding: 16,
        // border: true,
        bodyBorder: false,
        style: 'border-right: 1px #EEE solid;',

        defaults: {
            labelAlign: 'left',
            labelWidth: 130,
            disabled: true
        },

        tbar: {
            shadow: false,
            items: [{
                xtype: 'checkbox',
                bodyAlign: 'start',
                boxLabel: '<span style="font-size: 14px;">DHCP Enabled</span>',
                flex: 1,
                bind: {
                    checked: '{intf.dhcpEnabled}',
                }
            }]
        },
        defaultType: 'textfield',

        items: [{
            label: 'Range Start'.t(),
            bind: {
                value: '{intf.dhcpRangeStart}',
                disabled: '{!intf.dhcpEnabled}'
            }
        }, {
            label: 'Range End'.t(),
            bind: {
                value: '{intf.dhcpRangeEnd}',
                disabled: '{!intf.dhcpEnabled}'
            }
        }, {
            xtype: 'numberfield',
            label: 'Lease Duration'.t(),
            bind: {
                value: '{intf.dhcpLeaseDuration}',
                disabled: '{!intf.dhcpEnabled}'
            }
        }, {
            label: 'Gateway Override'.t(),
            bind: {
                value: '{intf.dhcpGatewayOverride}',
                disabled: '{!intf.dhcpEnabled}'
            }
        }, {
            xtype: 'combobox',
            label: 'Netmask Override'.t(),
            bind: {
                value: '{intf.dhcpPrefixOverride}',
                disabled: '{!intf.dhcpEnabled}',
            }
        }, {
            label: 'DNS Override'.t(),
            bind: {
                value: '{intf.dhcpDNSOverride}',
                disabled: '{!intf.dhcpEnabled}'
            }
        }]
    }]
});
