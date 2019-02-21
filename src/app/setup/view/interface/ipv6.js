Ext.define('Mfw.setup.interface.Ipv6', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-ipv6',

    // title: 'IPv6'.t(),

    layout: 'fit',

    scrollable: 'y',


    items: [{
        xtype: 'panel',
        bodyPadding: 16,
        // border: true,
        bodyBorder: false,
        style: 'border-right: 1px #EEE solid;',

        defaults: {
            labelAlign: 'left',
            labelWidth: 130
        },

        tbar: {
            shadow: false,
            items: [{
                xtype: 'selectfield',
                labelAlign: 'left',
                labelWidth: 130,
                flex: 1,
                // reference: 'v4Config',
                label: '<span style="font-size: 14px;">IPv6 Config Type</span>'.t(),
                editable: false,
                // margin: '0 16',
                bind: {
                    value: '{intf.v6ConfigType}',
                    options: '{ipv6Configs}' // defined in sheet formula
                }
            }]
        },
        items: [
            // WAN ASSIGN
            {
                xtype: 'textfield',
                label: 'Assign Hint'.t(),
                // errorLabel: 'IPv6 Assign Hint'.t(),
                required: false,
                hidden: true,
                bind: {
                    value: '{intf.v6AssignHint}',
                    hidden: '{intf.v6ConfigType !== "ASSIGN"}',
                    required: '{intf.v6ConfigType === "ASSIGN"}'
                }
            }, {
                xtype: 'numberfield',
                label: 'Assign Prefix'.t(),
                // errorLabel: 'IPv6 Assign Prefix'.t(),
                placeholder: 'Integer between 1 and 128',
                decimals: 0,
                minValue: 1,
                maxValue: 128,
                required: false,
                allowBlank: true,
                hidden: true,
                bind: {
                    value: '{intf.v6AssignPrefix}',
                    hidden: '{intf.v6ConfigType !== "ASSIGN"}',
                    required: '{intf.v6ConfigType === "ASSIGN"}'
                }
            },
            // STATIC
            {
                xtype: 'textfield',
                label: 'Address'.t(),
                hidden: true,
                bind: {
                    value: '{intf.v6StaticAddress}',
                    hidden: '{intf.v6ConfigType !== "STATIC"}'
                },
                validators: [ 'ipaddress' ]
            }, {
                xtype: 'numberfield',
                label: 'Prefix Length'.t(),
                hidden: true,
                bind: {
                    value: '{intf.v6StaticPrefix}',
                    hidden: '{intf.v6ConfigType !== "STATIC"}'
                }
            }, {
                xtype: 'textfield',
                label: 'Gateway'.t(),
                hidden: true,
                bind: {
                    value: '{intf.staticGateway}',
                    hidden: '{intf.v6ConfigType !== "STATIC"}'
                }
            }, {
                xtype: 'textfield',
                label: 'Primary DNS'.t(),
                hidden: true,
                bind: {
                    value: '{intf.v6StaticDNS1}',
                    hidden: '{intf.v6ConfigType !== "STATIC"}'
                }
            }, {
                xtype: 'textfield',
                label: 'Secondary DNS'.t(),
                hidden: true,
                bind: {
                    value: '{intf.v6StaticDNS2}',
                    hidden: '{intf.v6ConfigType !== "STATIC"}'
                }
            },

            {
                xtype: 'component',
                margin: 24,
                hidden: true,
                bind: {
                    hidden: '{intf.v6ConfigType !== "DISABLED"}'
                },
                html: '<h1 style="text-align: center; color: #777;"><i class="x-fa fa-exclamation-triangle"></i><br/><br/>IPv6 is disabled</h1>'
            }
        ]
    }]
});
