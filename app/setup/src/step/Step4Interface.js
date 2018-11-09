Ext.define('Mfw.setup.step.Interface', {
    extend: 'Ext.form.Panel',
    alias: 'widget.step-interface',

    style: 'color: #555;',

    bodyPadding: 0,
    layout: 'fit',
    // layout: {
    //     type: 'hbox',
    //     layout: 'stretch'
    // },

    items: [{
        xtype: 'toolbar',
        width: 250,
        docked: 'left',
        shadow: false,
        style: 'background: #f5f5f5',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'component',
            // padding: '0',
            bind: {
                html: '<h1 style="line-height: 1.2;">Interface #{intf.interfaceId}<br/> <strong>{intf.name}</strong> ({intf.device})</h1>'
            }
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
            label: 'Type',
            bind: '{intf.configType}',
            options: [
                { text: 'Addressed'.t(), value: 'ADDRESSED' },
                { text: 'Bridged'.t(),   value: 'BRIDGED' },
                { text: 'Disabled'.t(),  value: 'DISABLED' }
            ]
        }, {
            xtype: 'togglefield',
            name: 'wan',
            // margin: '0 16',
            boxLabel: 'Is WAN'.t(),
            // labelAlign: 'left',
            required: true,
            hidden: true,
            bind: {
                value: '{intf.wan}',
                hidden: '{intf.configType !== "ADDRESSED"}'
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
        defaults: {
            bodyPadding: 24
        },
        items: [{
                title: 'IPv4',
                xtype: 'interface-ipv4'
            }, {
                title: 'IPv6',
                html: 'ipv6'
            }, {
                title: 'DHCP',
                html: 'dhcp'
            }, {
                title: 'VRRP',
                html: 'vrrp'
            }
        ]
    }]




});
