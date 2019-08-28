Ext.define('Mfw.setup.cmp.Lte', {
    extend: 'Ext.form.Panel',
    alias: 'widget.lteform',

    layout: {
        type: 'vbox'
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
                checked: '{intf.enabled}'
            }
        }, {
            xtype: 'selectfield',
            userCls: 'x-custom-field',
            label: 'Network',
            required: true,
            autoSelect: true,
            options: [
                { text: 'T-Mobile', value: 'T-Mobile' },
                { text: 'Other', value: 'OTHER' }
            ],
            disabled: true,
            bind: {
                value: '{intf.simNetwork}',
                disabled: '{!intf.enabled}'
            }
        }, {
            xtype: 'textfield',
            userCls: 'x-custom-field',
            label: 'APN',
            required: true,
            disabled: true,
            bind: {
                value: '{intf.simApn}',
                disabled: '{intf.simNetwork !== "OTHER" || !intf.enabled}'
            }
        }, {
            xtype: 'numberfield',
            userCls: 'x-custom-field',
            label: 'PIN',
            required: false,
            hidden: true,
            disabled: true,
            bind: {
                value: '{intf.simPin}',
                required: '{intf.simNetwork === "OTHER"}',
                hidden: '{intf.simNetwork !== "OTHER"}',
                disabled: '{!intf.enabled}'
            },
            validators: [{
                type: 'length',
                min: 4,
                max: 4
            }]
        }, {
            xtype: 'textfield',
            userCls: 'x-custom-field',
            label: 'Username',
            required: false,
            hidden: true,
            disabled: true,
            bind: {
                value: '{intf.simUsername}',
                required: '{intf.simNetwork === "OTHER"}',
                hidden: '{intf.simNetwork !== "OTHER"}',
                disabled: '{!intf.enabled}'
            }
        }, {
            xtype: 'textfield',
            userCls: 'x-custom-field',
            label: 'Password',
            required: false,
            hidden: true,
            disabled: true,
            bind: {
                value: '{intf.simPassword}',
                required: '{intf.simNetwork === "OTHER"}',
                hidden: '{intf.simNetwork !== "OTHER"}',
                disabled: '{!intf.enabled}'
            }
        }]
    }]
});


