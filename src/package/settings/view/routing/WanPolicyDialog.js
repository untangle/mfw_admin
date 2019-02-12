Ext.define('Mfw.settings.routing.WanPolicyDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.wan-policy-dialog',

    viewModel: {
        data: {
            wans: []
        },
        stores: {
            availableWans: {
                data: '{wans}'
            }
        }
    },

    config: {
        policy: null
    },

    bind: {
        title: '{action === "ADD" ? "Create" : "Edit"} WAN Policy',
    },
    width: 900,
    height: 600,
    draggable: false,
    // maximizable: true,
    // resizable: {
    //     edges: 'all',
    //     dynamic: true
    // },
    showAnimation: {
        duration: 0
    },

    layout: 'fit',

    bodyPadding: 8,


    items: [{
        xtype: 'formpanel',
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
                placeholder: 'Enter description ...',
                autoComplete: false,
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
                label: 'Type',
                name: 'type',
                required: true,
                bind: '{policy.type}',
                width: 250,
                options: [
                    { text: 'Specific WAN', value: 'SPECIFIC_WAN' },
                    { text: 'Best WANs', value: 'BEST_OF' },
                    { text: 'Balance', value: 'BALANCE' }
                ]
            }, {
                xtype: 'selectfield',
                itemId: 'specificWanSelection',
                label: 'Select WAN',
                placeholder: 'Please select ...',
                flex: 1,
                hidden: true,
                required: true,
                displayTpl: '{name} [ {interfaceId} ]',
                itemTpl: '{name} <span style="color: #999">[ {interfaceId} ]</span>',
                valueField: 'interfaceId',
                displayField: 'name',
                bind: {
                    // value: '{policy.balance_algorithm}',
                    hidden: '{policy.type !== "SPECIFIC_WAN"}',
                    required: '{policy.type === "SPECIFIC_WAN"}',
                    options: '{wans}'
                }
            }, {
                xtype: 'selectfield',
                label: 'Select Metric',
                placeholder: 'Please select ...',
                name: 'best_of_metric',
                flex: 1,
                hidden: true,
                required: true,
                bind: {
                    value: '{policy.best_of_metric}',
                    hidden: '{policy.type !== "BEST_OF"}',
                    required: '{policy.type === "BEST_OF"}',
                },
                options: [
                    { text: 'Lowest Latency', value: 'LOWEST_LATENCY' },
                    { text: 'Highest Available Bandwidth', value: 'HIGHEST_AVAILABLE_BANDWIDTH' },
                    { text: 'Lowest Jitter', value: 'LOWEST_JITTER' },
                    { text: 'Lowest Packet Loss', value: 'LOWEST_PACKET_LOSS' }
                ]
            }, {
                xtype: 'selectfield',
                label: 'Select Algorithm',
                placeholder: 'Please select ...',
                name: 'balance_algorithm',
                flex: 1,
                hidden: true,
                required: true,
                bind: {
                    value: '{policy.balance_algorithm}',
                    hidden: '{policy.type !== "BALANCE"}',
                    required: '{policy.type === "BALANCE"}',
                },
                options: [
                    { text: 'Weighted', value: 'WEIGHTED' },
                    { text: 'Latency', value: 'LATENCY' },
                    { text: 'Available Bandwidth', value: 'AVAILABLE_BANDWIDTH' },
                    { text: 'Bandwidth', value: 'BANDWIDTH' }
                ]
            }, {
                xtype: 'selectfield',
                reference: 'wanSelection',
                label: 'Select WANs',
                placeholder: 'Please select ...',
                value: 'ALL',
                flex: 1,
                hidden: true,
                required: true,
                bind: {
                    hidden: '{policy.type === "SPECIFIC_WAN"}',
                    required: '{policy.type !== "SPECIFIC_WAN"}',
                },
                options: [
                    { text: 'All WANs', value: 'ALL' },
                    { text: 'Specific WANs', value: 'SPECIFIC' },
                    { text: 'Criteria', value: 'CRITERIA' }
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
                itemId: 'wans',
                plugins: {
                    gridcellediting: {
                        triggerEvent: 'tap'
                    }
                },
                width: 300,
                selectable: false,
                hidden: true,
                bind: {
                    hidden: '{policy.type === "SPECIFIC_WAN"}',
                    store: '{availableWans}'
                },
                scrollable: 'y',
                items: [{
                    xtype: 'toolbar',
                    docked: 'top',
                    shadow: false,
                    items: [{
                        xtype: 'component',
                        html: 'Select WANs',
                        style: 'font-weight: 100'
                    }]
                }],
                columns: [{
                    xtype: 'checkcolumn',
                    dataIndex: 'checked',
                    width: 40,
                    hidden: true,
                    sortable: false,
                    hideable: false,
                    menuDisabled: true,
                    bind: {
                        hidden: '{wanSelection.value === "ALL"}'
                    }
                }, {
                    text: 'Interface',
                    dataIndex: 'interfaceId',
                    flex: 1,
                    sortable: false,
                    hideable: false,
                    menuDisabled: true,
                    cell: { encodeHtml: false },
                    renderer: Renderer.interface
                }, {
                    text: 'Weight (click to edit)',
                    dataIndex: 'weight',
                    width: 150,
                    sortable: false,
                    hideable: false,
                    menuDisabled: true,
                    hidden: true,
                    bind: {
                        hidden: '{policy.balance_algorithm !== "WEIGHTED"}'
                    },
                    // renderer: 'weightRenderer',
                    editable: true,
                    editor: {
                        xtype: 'numberfield',
                        required: true,
                        defaultValue: 100,
                        minValue: 0,
                        maxValue: 100
                    }
                }]
                // listeners: {
                //     // hack to not display column headers
                //     show: function (grid) {
                //         grid.setHideHeaders(true);
                //     }
                // }
            }, {
                xtype: 'grid',
                flex: 1,
                plugins: {
                    gridcellediting: {
                        triggerEvent: 'tap'
                    }
                },
                selectable: false,
                hidden: true,
                bind: {
                    store: '{policy.criteria}',
                    hidden: '{policy.type === "SPECIFIC_WAN"}'
                },
                items: [{
                    xtype: 'toolbar',
                    docked: 'top',
                    shadow: false,
                    items: [{
                        xtype: 'component',
                        html: 'Criterias',
                        style: 'font-weight: 100'
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
                                layout: 'vbox',
                                items: [{
                                    xtype: 'component',
                                    html: 'Interface Name contains',
                                    style: 'font-size: 13px'
                                }, {
                                    xtype: 'textfield',
                                    placeholder: 'Type name ...',
                                    margin: '16 0 0 0',
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
                columns: [{
                    text: 'Definition',
                    flex: 1,
                    cell: { encodeHtml: false },
                    sortable: false,
                    hideable: false,
                    menuDisabled: true,
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
                }],
                deferEmptyText: false,
                emptyText: true
            }]
        }]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        items: ['->', {
            text: 'Cancel',
            margin: '0 8 0 0',
            handler: 'onCancel'
        }, {
            bind: {
                text: '{action === "ADD" ? "Create" : "Update"}'
            },
            ui: 'action',
            handler: 'onSubmit'
        }]
    }],

    controller: {
        init: function (view) {
            var wans = [],
                policy,
                vm = view.getViewModel();

            if (view.getPolicy()) {
                vm.set({
                    policy: view.getPolicy(),
                    action: 'EDIT'
                });
            } else {
                vm.set({
                    policy: Ext.create('Mfw.model.WanPolicy'),
                    action: 'ADD'
                });
            }

            Ext.getStore('interfaces').load(function (records) {
                Ext.Array.each(records, function (record) {
                    if (record.get('wan')) {
                        wans.push({
                            checked: true,
                            name: record.get('name'),
                            interfaceId: record.get('interfaceId'),
                            weight: 100
                        });
                    }
                });

                vm.set('wans', wans);
            });

            policy = vm.get('policy');


            // FIXME: some all, specific wan selection when editing policy

            if (vm.get('action') === 'EDIT') {
                var firstInterfaceId = vm.get('policy').interfaces().first().get('id');
                if (policy.get('type') === 'SPECIFIC_WAN') {
                    view.down('#specificWanSelection').setValue(firstInterfaceId);
                } else {
                    if (firstInterfaceId === 0) {
                        view.lookup('wanSelection').setValue('ALL');
                    } else {
                        view.lookup('wanSelection').setValue('SPECIFIC');
                    }
                }
            }
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


        weightRenderer: function (value) {
            var me = this, vm = me.getViewModel();
            if (vm.get('wanSelection').value === 'ALL') {
                return 'evenly';
            } else {
                return value;
            }
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

        onCancel: function () {
            var me = this;
            me.getViewModel().get('policy').reject();
            me.getView().destroy();
        },

        onSubmit: function () {
            var me = this,
                vm = me.getViewModel(),
                policy = vm.get('policy'),
                dialog = me.getView(),
                form = dialog.down('formpanel');

            if (!form.validate()) { return; }

            policy.interfaces().removeAll();
            if (policy.get('type') !== 'SPECIFIC_WAN') {
                if (vm.get('wanSelection').value === "ALL") {
                    policy.interfaces().add({
                        id: 0
                    });
                } else {
                    dialog.down('#wans').getStore().each(function (intf) {
                        if (intf.get('checked')) {
                            policy.interfaces().add({
                                id: intf.get('interfaceId'),
                                weight: (policy.get('balance_algorithm') === 'WEIGHTED') ? intf.get('weight') : null
                            });
                        }
                    });
                }
            } else {
                policy.interfaces().add({
                    id: dialog.down('#specificWanSelection').getValue(),
                    weight: null
                });
            }

            if (vm.get('action') === 'ADD') {
                dialog.ownerCmp.getStore().add(policy);
            } else {
                policy.commit();
                // dialog.ownerCmp.getStore().add(policy);
            }


            dialog.close();
        }

    }

});
