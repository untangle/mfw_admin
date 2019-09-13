/**
 * LTE options
 * shown only if interface type is WWAN
 */
Ext.define('Mfw.settings.interface.Lte', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-lte',

    layout: 'fit',

    viewModel: {
        formulas: {
            /**
             * formula to set simNetwork null
             * selectfield does not support null value options
             */
            _simNetwork: {
                get: function (get) {
                    return get('intf.simNetwork') || 'OTHER';
                },
                set: function (value) {
                    this.set('intf.simNetwork', value !== "OTHER" ? value : null);
                }
            }
        }
    },

    items: [{
        xtype: 'container',
        scrollable: true,
        layout: 'hbox',
        items: [{
            xtype: 'formpanel',
            padding: '8 16 16 16',
            width: 400,
            bind: {
                flex: '{isDialog ? 1 : "auto"}'
            },
            items: [{
                xtype: 'component',
                style: 'font-size: 20px; font-weight: 100;',
                margin: '16 0',
                html: 'LTE Configuration'
            }, {
                xtype: 'containerfield',
                layout: 'hbox',
                defaults: {
                    flex: 1,
                    required: false,
                    clearable: false
                },
                items: [{
                    xtype: 'selectfield',
                    label: 'Network',
                    autoSelect: 'true',
                    margin: '0 16 0 0',
                    options: [
                        { text: 'T-Mobile', value: 'T-Mobile' },
                        { text: 'Other', value: 'OTHER' }
                    ],
                    bind: {
                        value: '{_simNetwork}',
                        required: '{intf.type === "WWAN"}'
                    }
                }, {
                    xtype: 'textfield',
                    label: 'APN',
                    margin: '0 0 0 16',
                    editable: false,
                    bind: {
                        value: '{intf.simApn}',
                        required: '{intf.type === "WWAN"}',
                        disabled: '{intf.simNetwork}'
                    }
                }]
            }, {
                xtype: 'numberfield',
                label: 'PIN',
                width: 100,
                hidden: true,
                clearable: false,
                autoComplete: false,
                bind: {
                    value: '{intf.simPin}',
                    required: '{intf.type === "WWAN" && !intf.simNetwork}',
                    hidden: '{intf.simNetwork}'
                },
                validators: [{
                    type: 'length',
                    min: 4,
                    max: 4
                }]
            }, {
                xtype: 'containerfield',
                layout: 'hbox',
                defaults: {
                    xtype: 'textfield',
                    flex: 1,
                    required: false,
                    clearable: false
                },
                items: [{
                    label: 'Username',
                    margin: '0 16 0 0',
                    bind: {
                        value: '{intf.simUsername}',
                        required: '{intf.type === "WWAN" && !intf.simNetwork}',
                        hidden: '{intf.simNetwork}'
                    }
                }, {
                    label: 'Password',
                    inputType: 'password',
                    margin: '0 0 0 16',
                    triggers: {
                        reveal: {
                            type: 'trigger',
                            iconCls: 'x-fa fa-eye',
                            hidden: true,
                            bind: {
                                hidden: '{intf.simPassword.length === 0}',
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
                    bind: {
                        value: '{intf.simPassword}',
                        required: '{intf.type === "WWAN" && !intf.simNetwork}',
                        hidden: '{intf.simNetwork}'
                    },
                    validators: [{
                        type: 'length',
                        min: 8
                    }]
                }]
            }]
        }]
    }]
});
