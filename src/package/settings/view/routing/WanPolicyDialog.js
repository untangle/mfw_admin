Ext.define('Mfw.settings.routing.WanPolicyDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.wan-policy-dialog',

    viewModel: {},

    title: 'Add/Edit WAN Policy'.t(),
    width: 1100,
    height: 600,
    maximizable: true,
    resizable: {
        edges: 'all',
        dynamic: true
    },
    showAnimation: {
        duration: 0
    },

    layout: 'fit',

    bodyPadding: 8,


    items: [{
        xtype: 'container',
        layout: 'vbox',
        items: [{
            xtype: 'containerfield',
            defaults: {
                margin: '0 8',
                labelAlign: 'top'
            },
            items: [{
                xtype: 'textfield',
                label: 'Description',
                name: 'description',
                required: true,
                bind: '{policy.description}',
                width: 400
            }, {
                xtype: 'checkbox',
                label: '&nbsp;',
                boxLabel: 'Enabled',
                bodyAlign: 'start',
                bind: '{policy.enabled}',
                flex: 1
            }]
        }, {
            xtype: 'containerfield',
            defaults: {
                margin: '0 8',
                labelAlign: 'top'
            },
            items: [{
                xtype: 'selectfield',
                reference: 'type',
                label: 'Type',
                name: 'type',
                required: true,
                bind: '{policy.type}',
                width: 250,
                options: [
                    { text: 'Specific WAN', value: 'SPECIFIC_WAN' },
                    { text: 'Best Of', value: 'BEST_OF' },
                    { text: 'Balance', value: 'BALANCE' }
                ]
            }, {
                xtype: 'selectfield',
                label: 'Best of Metric',
                placeholder: 'Please select ...',
                name: 'best_of_metric',
                flex: 1,
                hidden: true,
                required: true,
                bind: {
                    value: '{policy.best_of_metric}',
                    hidden: '{type.value !== "BEST_OF"}',
                    required: '{type.value === "BEST_OF"}',
                },
                options: [
                    { text: 'Lowest Latency', value: 'LOWEST_LATENCY' },
                    { text: 'Highest Available Bandwidth', value: 'HIGHEST_AVAILABLE_BANDWIDTH' },
                    { text: 'Lowest Jitter', value: 'LOWEST_JITTER' },
                    { text: 'Lowest Packet Loss', value: 'LOWEST_PACKET_LOSS' }
                ]
            }, {
                xtype: 'selectfield',
                label: 'Balance Algorithm',
                placeholder: 'Please select ...',
                name: 'balance_algorithm',
                flex: 1,
                hidden: true,
                required: true,
                bind: {
                    value: '{policy.balance_algorithm}',
                    hidden: '{type.value !== "BALANCE"}',
                    required: '{type.value === "BALANCE"}',
                },
                options: [
                    { text: 'Weighted', value: 'WEIGHTED' },
                    { text: 'Latency', value: 'LATENCY' },
                    { text: 'Available Bandwidth', value: 'AVAILABLE_BANDWIDTH' },
                    { text: 'Bandwidth', value: 'BANDWIDTH' }
                ]
            }]
        }, {
            xtype: 'container',
            margin: '16 0 0 0',
            flex: 1,
            layout: 'hbox',
            defaults: {
                margin: '0 8',
            },
            items: [{
                xtype: 'grid',
                itemId: 'wanInterfaces',
                store: {
                    type: 'interfaces',
                    filters: [{
                        property: 'wan',
                        value: true
                    }],
                    // fields: [
                    //     { name: 'checked', type: 'boolean', defaultValue: true }
                    // ]
                },
                width: 350,
                items: [{
                    xtype: 'toolbar',
                    docked: 'top',
                    shadow: false,
                    items: [{
                        xtype: 'component',
                        html: 'WANs'
                    },
                    // '->', {
                    //     xtype: 'checkbox',
                    //     reference: 'allWans',
                    //     boxLabel: 'All WANs'
                    // }
                ]
                }],
                // bind: '{record.interfaces}',
                columns: [{
                    xtype: 'checkcolumn',
                    dataIndex: 'checked',
                    width: 40,
                    checked: true
                }, {
                    text: 'Interface',
                    dataIndex: 'interfaceId',
                    flex: 1,
                    cell: { encodeHtml: false },
                    renderer: Renderer.interface
                }, {
                    text: 'Weight'
                }]
            }, {
                xtype: 'grid',
                flex: 1,
                plugins: {
                    // grideditable: true,
                    gridcellediting: {
                        triggerEvent: 'tap'
                    }
                },
                selectable: false,
                items: [{
                    xtype: 'toolbar',
                    docked: 'top',
                    shadow: false,
                    items: [{
                        xtype: 'component',
                        html: 'Criterias'
                    }, '->', {
                        text: 'Add',
                        iconCls: 'md-icon-add',
                        arrow: false,
                        menuAlign: 'tr-br?',
                        menu: {
                            items: [{
                                text: 'Interface is VPN',
                                handler: 'isVpnCriteria'
                            }, '-', {
                                xtype: 'container',
                                items: [{
                                    xtype: 'component',
                                    html: 'Interface Name contains',
                                    style: 'font-size: 13px'
                                }, {
                                    xtype: 'textfield',
                                    placeholder: 'Type name ...',
                                    autoComplete: false,
                                    keyMapEnabled: true,
                                    keyMap: {
                                        enter: {
                                            key: Ext.event.Event.ENTER,
                                            handler: 'onNameContains'
                                        }
                                    }
                                }]
                            }, '-', {
                                text: 'Define metric ...',
                                handler: 'metricDialog'
                            }]
                        },
                        handler: 'addCriteria'
                    }]
                }],
                bind: '{policy.criteria}',

                columns: [{
                    text: 'Definition',
                    flex: 1,
                    cell: { encodeHtml: false },
                    renderer: function (value, record) {
                        var output = [], text;
                        if (record.get('type') === 'ATTRIBUTE') {
                            if (record.get('attribute') === 'VPN') {
                                output.push('Interface is VPN');
                            }
                            if (record.get('attribute') === 'NAME') {
                                output.push('Interface Name contains "<b>' + record.get('name_contains') + '</b>"');
                            }
                        }
                        if (record.get('type') === 'METRIC') {
                            text = 'Interface ';
                            switch (record.get('metric')) {
                                case 'LATENCY': text += 'Latency'; break;
                                case 'AVAILABLE_BANDWIDTH': text += 'Available bandwidth'; break;
                                case 'JITTER': text += 'Jitter'; break;
                                case 'PACKET_LOSS': text += 'Packet loss'; break;
                                default: text += 'n/a';
                            }

                            text += ' ' + record.get('metric_op');
                            text += ' ' + record.get('metric_value') + '';
                            output.push(text);
                        }

                        return output.join('<br/>');
                    }
                }, {
                    width: 40,
                    align: 'center',
                    sortable: false,
                    hideable: false,
                    menuDisabled: true,
                    cell: {
                        tools: {
                            remove: {
                                iconCls: 'md-icon-delete',
                                tooltip: 'Remove',
                                // zone: 'end',
                                handler: 'removeCriteria'
                            },
                        }
                    }
                }]
            }]
        }]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        items: ['->', {
            text: 'Cancel',
            margin: '0 8 0 0',
            handler: function () {  // standard button (see below)
                this.up('dialog').destroy();
            }
        }, {
            text: 'Add',
            ui: 'action',
            handler: 'onSubmit'
        }]
    }],

    controller: {
        init: function (view) {
            var availableWans = [],
                interfacesGrid = view.down('#wanInterfaces'),
                newRec = Ext.create('Mfw.model.WanPolicy');
            view.getViewModel().set('policy', newRec);
            interfacesGrid.getStore().load();
        },

        isVpnCriteria: function (item) {
            var me = this;
            me.getViewModel().get('policy').criteria().add({
                type: 'ATTRIBUTE',
                attribute: 'VPN'
            });
            item.up('menu').hide();
        },

        onNameContains: function (event, field) {
            var me = this, name = field.getValue();
            if (!name) { return; }
            me.getViewModel().get('policy').criteria().add({
                type: 'ATTRIBUTE',
                attribute: 'NAME',
                name_contains: name
            });
            field.setValue('');
            field.blur();
            field.up('button').getMenu().hide();
            // console.log();

            // .hide();
        },

        metricDialog: function (item) {
            var me = this,
                metricDialog = me.getView().add({ xtype: 'wan-metric-dialog'} );
            metricDialog.show();
            metricDialog.on('close', function () {
                metricDialog.destroy();
            });
            item.up('menu').hide();
        },


        addCriteria: function () {
            var me = this, vm = me.getViewModel(),
                newCriteria = Ext.create('Mfw.model.WanCriterion'),
                policy = vm.get('policy');

            policy.criteria().add(newCriteria);
        },

        removeCriteria: function (grid, info) {
            grid.getStore().remove(info.record);
        },

        onSubmit: function () {
            var me = this,
                vm = me.getViewModel(),
                policy = vm.get('policy'),
                dialog = me.getView();

            dialog.down('#wanInterfaces').getStore().each(function (intf) {
                if (intf.get('checked')) {
                    policy.interfaces().add({
                        id: intf.get('interfaceId'),
                        weight: 100
                    });
                }
            });

            dialog.ownerCmp.getStore().add(policy);
            dialog.close();
        }

    }

});
