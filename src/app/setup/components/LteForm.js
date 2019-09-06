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
            xtype: 'container',
            margin: '0 0 16 0',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [{
                xtype: 'component',
                style: 'font-size: 24px;',
                html: 'LTE' // hardcode the LTE name
                // bind: {
                //     html: '{intf.name}'
                // }
            }, {
                flex: 1
            }, {
                xtype: 'togglefield',
                bind: {
                    userCls: '{intf.enabled ? "on" : "off"}', // custom styling class
                    boxLabel: '<strong>{intf.enabled ? "Enabled" : "Disabled"}</strong>',
                    value: '{intf.enabled}'
                }
            }]
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
            inputType: 'password',
            name: 'password',
            label: 'Password',
            triggers: {
                reveal: {
                    type: 'trigger',
                    iconCls: 'x-fa fa-eye',
                    hidden: true,
                    bind: {
                        hidden: '{!intf.enabled || intf.simPassword.length === 0}',
                    },
                    handler: function (field, trigger) {
                        if (field.getDisabled()) {
                            return;
                        }
                        var inputType = field.getInputType();
                        if (inputType === 'password') {
                            field.setInputType('text');
                            trigger.setIconCls('x-fa fa-eye-slash');
                        } else {
                            field.setInputType('password');
                            trigger.setIconCls('x-fa fa-eye');
                        }
                    }
                }
            },
            required: false,
            hidden: true,
            disabled: true,
            bind: {
                value: '{intf.simPassword}',
                required: '{intf.simNetwork === "OTHER"}',
                hidden: '{intf.simNetwork !== "OTHER"}',
                disabled: '{!intf.enabled}'
            },
            validators: [{
                type: 'length',
                min: 8
            }]
        }, {
            // sim info
            xtype: 'component',
            style: 'color: #555; border: 1px #CCC solid; border-radius: 5px; padding: 5px 15px;',
            margin: '32 0 0 0',
            html: '<p style="font-size: 14px; font-weight: 600;">SIM Details</p>' +
                '<ul>' +
                    '<li>IMEI: 7436489793242340504605</li>' +
                    '<li>IMSI: 63474234025335409</li>' +
                    '<li>ICCID: 152313039478439450454455</li>' +
                '</ul>'
        }]
    }]
});


