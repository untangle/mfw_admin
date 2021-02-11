Ext.define('Mfw.settings.firewall.PortForwardAdd', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-firewall-port-forward-add',

    title: 'Port Forward'.t(),

    layout: 'vbox',

    viewModel: {
        data: {
            protocol: false,
            destination_address: false,
            source_address: false,

            values: {
                destination_port: null,
                protocol: null,
                destination_address: null,
                source_address: null,

                new_destination: null
            }
        },
        formulas: {
            // percent value of progress
            summary: function(get) {
                var str = '<strong>If</strong>', cond_set = false, str_arr = [];


                if (get('values.destination_port')) {
                    str_arr.push('Destination Port is ' + get('values.destination_port'));
                    cond_set = true;
                }

                if (get('values.protocol')) {
                    str_arr.push('Protocol is ' + get('values.protocol'));
                    cond_set = true;
                }

                if (get('values.destination_address')) {
                    str_arr.push('Destination IP Address is ' + get('values.destination_address'));
                    cond_set = true;
                }

                if (get('values.source_address')) {
                    str_arr.push('Source IP Address is ' + get('values.source_address'))
                    cond_set = true;
                }

                if (!cond_set) {
                    str += ' <em style="color: #999;">no condition</em> '
                }

                str += ' ' + str_arr.join(' <strong>and</strong> ') + ' ';

                str += '<br /><strong>then</strong> '

                if (get('values.new_destination')) {
                    str += 'New Destination is ' + get('values.new_destination');
                } else {
                    str += 'New Destination is <em style="color: #999;">no destination</em>';
                }

                return str
            },
        }
    },

    items: [{
        xtype: 'component',
        margin: '16 16 0 16',
        html: '<h1>Add Port Forward Rule</h1>',
    }, {
        xtype: 'panel',
        layout: 'hbox',
        margin: '16 0 0 0',
        items: [{
            xtype: 'panel',
            padding: '0 16',
            width: 400,
            items: [{
                xtype: 'textfield',
                label: 'Description',
                labelAlign: 'top',
                placeholder: 'enter description ...',
            }, {
                xtype: 'container',
                margin: '32 0 0 0',
                html: '<h2>Conditions</h2><h2 style="font-weight: 400;">If all the following conditions are met</h3>'
            }, {
                xtype: 'textfield',
                label: 'Destination Port',
                labelAlign: 'top',
                required: true,
                placeholder: 'e.g. 80, 433',
                bind: '{values.destination_port}'
            }, {
                xtype: 'container',
                margin: '16 0',
                layout: {
                    type: 'hbox',
                    align: 'bottom'
                },
                items: [{
                    xtype: 'selectfield',
                    flex: 1,
                    name: 'port_protocol',
                    label: 'Protocol',
                    labelAlign: 'top',
                    placeholder: 'Select port protocol(s)...',
                    autoSelect: false,
                    multiSelect: true,
                    editable: false,
                    displayTpl: '{text} [ {value} ]',
                    itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
                    options: Map.options.portProtocols,
                    bind: '{values.protocol}'
                }, {
                    xtype: 'button',
                    ui: 'rounded',
                    iconCls: 'x-fa fa-times',
                    cType: 'protocol',
                    handler: 'removeCondition'
                }],
                hidden: true,
                bind: {
                    hidden: '{!protocol}'
                }
            }, {
                xtype: 'container',
                margin: '16 0',
                layout: {
                    type: 'hbox',
                    align: 'bottom'
                },
                items: [{
                    xtype: 'textfield',
                    label: 'Destination IP Address',
                    labelAlign: 'top',
                    flex: 1,
                    placeholder: 'e.g. 192.168.10.0/24',
                    bind: '{values.destination_address}',
                    clearable: false,
                }, {
                    xtype: 'button',
                    ui: 'rounded',
                    iconCls: 'x-fa fa-times',
                    cType: 'destination_address',
                    handler: 'removeCondition'
                }],
                hidden: true,
                bind: {
                    hidden: '{!destination_address}'
                }
            }, {
                xtype: 'container',
                margin: '16 0',
                layout: {
                    type: 'hbox',
                    align: 'bottom'
                },
                items: [{
                    xtype: 'textfield',
                    label: 'Source IP Address',
                    labelAlign: 'left',
                    flex: 1,
                    placeholder: 'e.g. 192.168.11.2/32',
                    bind: '{values.source_address}',
                    clearable: false,
                }, {
                    xtype: 'button',
                    ui: 'rounded',
                    iconCls: 'x-fa fa-times',
                    cType: 'source_address',
                    handler: 'removeCondition'
                }],
                hidden: true,
                bind: {
                    hidden: '{!source_address}'
                }
            }, {
                xtype: 'button',
                text: 'Add more conditions',
                style: 'font-weight: 400; background: #EEE;',
                margin: '16 0 0 0',
                arrow: false,
                iconCls: 'x-fa fa-angle-right',
                iconAlign: 'right',
                // ui: 'raised',
                menuAlign: 'tr',
                menu: {
                    border: false,
                    items: [{
                        text: 'Protocol',
                        cType: 'protocol',
                        handler: 'addCondition',
                        disabled: true,
                        bind: {
                            disabled: '{protocol}'
                        }
                    },
                    {
                        text: 'Destination IP Address',
                        cType: 'destination_address',
                        handler: 'addCondition',
                        disabled: true,
                        bind: {
                            disabled: '{destination_address}'
                        }
                    }, {
                        text: 'Source IP Address',
                        cType: 'source_address',
                        handler: 'addCondition',
                        disabled: true,
                        bind: {
                            disabled: '{source_address}'
                        }
                    }, {
                        xtype: 'menuseparator'
                    }, {
                        text: 'Other condition ...',
                        handler: 'onOtherCondition'
                    }]
                }
            },
            {
                xtype: 'container',
                margin: '32 0 0 0',
                html: '<h2>Action</h2><h2 style="font-weight: 400;">Forward to the following address</h3>'
            }, {
                xtype: 'textfield',
                label: 'Address',
                labelAlign: 'top',
                placeholder: 'e.g. 192.168.100.10',
                required: true,
                bind: '{values.new_destination}'
            }, {
                xtype: 'panel',
                margin: '32 0 0 0',
                items: [{
                    xtype: 'component',
                    html: '<h2>Summary</h2>'
                }, {
                    xtype: 'component',
                    style: 'font-size: 14px; margin-top: 24px;',
                    bind: {
                        html: '{summary}'
                    }
                }]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '32 0 0 0',
                items: [{
                    xtype: 'button',
                    text: 'Cancel',
                    margin: '0 16 0 0'
                }, {
                    xtype: 'button',
                    text: 'Add Rule',
                    ui: 'action',
                }]
            }]
        }]
    }],

    controller: {
        init: function () {
            this.extraConditions = []
            this.dialog = null
        },
        addCondition: function(btn) {
            var me = this,
                vm = me.getViewModel();

            vm.set(btn.cType, true);
        },

        removeCondition: function (btn) {
            var me = this,
                vm = me.getViewModel();

            vm.set(btn.cType, false);
            vm.set('values.' + btn.cType, null);

        },

        onOtherCondition: function (grid, info) {
            var me = this;
            // if (!me.dialog) (
                me.dialog = Ext.Viewport.add({
                    xtype: 'all-conditions-dialog',
                    ownerCmp: me.getView(),
                    // rule: info.record
                })

            // )
            me.dialog.show();

            me.dialog.on('close', function () {
                var selection = me.dialog.getViewModel().get('selection');
                if (!selection) return;
                console.log(Conditions.map[selection.get('type')])
            })
        },
    }
});
