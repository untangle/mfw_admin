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
                width: '25%',
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
                        // menu: {
                        //     items: [{
                        //         text: 'Attribute',
                        //         menu: {
                        //             items: [{
                        //                 text: 'VPN'
                        //             }, {
                        //                 text: 'Name',
                        //                 menu: {
                        //                     items: [{
                        //                         xtype: 'textfield',
                        //                         label: 'Contains',
                        //                         labelAlign: 'top'
                        //                     }]
                        //                 }
                        //             }]
                        //         }
                        //     }, {
                        //         text: 'Metric',
                        //         menu: {
                        //             items: [{
                        //                 text: 'Latency'
                        //             }, {
                        //                 text: 'Available Bandwidth'
                        //             }, {
                        //                 text: 'Jitter'
                        //             }, {
                        //                 text: 'Packet Loss'
                        //             }]
                        //         }
                        //     }]
                        // },
                        handler: 'addCriteria'
                    }]
                }],
                bind: '{policy.criteria}',

                itemConfig: {
                    viewModel: true,
                },

                columns: [{
                    text: 'Type',
                    dataIndex: 'type',
                    width: 120,
                    renderer: function (value) {
                        if (value === 'ATTRIBUTE') { return 'Attribute'; }
                        if (value === 'METRIC') { return 'Metric'; }
                    },
                    editor: {
                        xtype: 'selectfield',
                        options: [
                            { text: 'Attribute', value: 'ATTRIBUTE' },
                            { text: 'Metric', value: 'METRIC' }
                        ]
                    }
                }, {
                    text: 'Attribute',
                    dataIndex: 'attribute',
                    flex: 1,
                    cell: {
                        bind: {
                            style: '{record.type !== "ATTRIBUTE" ? "text-decoration: line-through" : "text-decoration: none"}',
                            disabled: '{record.type !== "ATTRIBUTE"}'
                        }
                    },
                    renderer: function (value) {
                        if (value === 'VPN') { return 'VPN'; }
                        if (value === 'NAME') { return 'Name'; }
                    },
                    editor: {
                        xtype: 'selectfield',
                        bind: {
                            disabled: '{record.type !== "ATTRIBUTE"}'
                        },
                        options: [
                            { text: 'VPN', value: 'VPN' },
                            { text: 'Name', value: 'NAME' }
                        ]
                    }
                }, {
                    text: 'Name Contains',
                    dataIndex: 'name_contains',
                    width: 160,
                    cell: {
                        encodeHtml: false,
                        bind: {
                            style: '{record.type !== "ATTRIBUTE" || record.attribute !== "NAME" ? "text-decoration: line-through" : "text-decoration: none"}',
                            disabled: '{record.type !== "ATTRIBUTE" || record.attribute !== "NAME"}'
                        }
                    },
                    renderer: function (value) {
                        if (!value) { return '<em>not set</em>'; }
                        return value;
                    },
                    editor: {
                        xtype: 'textfield',
                        placeholder: 'Name ...',
                        bind: {
                            disabled: '{record.type !== "ATTRIBUTE" || record.attribute !== "NAME"}'
                        }
                    }
                }, {
                    text: 'Metric',
                    dataIndex: 'metric',
                    width: 150,
                    cell: {
                        bind: {
                            style: '{record.type !== "METRIC" ? "text-decoration: line-through" : "text-decoration: none"}',
                            disabled: '{record.type !== "METRIC"}'
                        }
                    },
                    renderer: function (value) {
                        var text;
                        switch (value) {
                            case 'LATENCY': text = 'Latency'; break;
                            case 'AVAILABLE_BANDWIDTH': text = 'Available Bandwidth'; break;
                            case 'JITTER': text = 'Jitter'; break;
                            case 'PACKET_LOSS': text = 'Packet Loss'; break;
                            default: text = 'Metric ...';
                        }
                        return text;
                    },
                    editor: {
                        xtype: 'selectfield',
                        placeholder: 'Metric ...',
                        bind: {
                            disabled: '{record.type !== "METRIC"}'
                        },
                        options: [
                            { text: 'Latency', value: 'LATENCY' },
                            { text: 'Available Bandwidth', value: 'AVAILABLE_BANDWIDTH' },
                            { text: 'Jitter', value: 'JITTER' },
                            { text: 'Packet Loss', value: 'PACKET_LOSS' }
                        ]
                    }
                }, {
                    text: 'Operator',
                    dataIndex: 'metric_op',
                    width: 100,
                    cell: {
                        bind: {
                            style: '{record.type !== "METRIC" ? "text-decoration: line-through" : "text-decoration: none"}',
                            disabled: '{record.type !== "METRIC"}'
                        }
                    },
                    renderer: function (value) {
                        return value || 'Operator ...';
                    },
                    editor: {
                        xtype: 'selectfield',
                        placeholder: 'Operator ...',
                        bind: {
                            disabled: '{record.type !== "METRIC"}'
                        },
                        options: [
                            { text: '<', value: '<' },
                            { text: '>', value: '>' },
                            { text: '<=', value: '<=' },
                            { text: '>=', value: '>=' },
                        ]
                    }
                }, {
                    text: 'Value',
                    dataIndex: 'metric_value',
                    width: 100,
                    cell: {
                        bind: {
                            style: '{record.type !== "METRIC" ? "text-decoration: line-through" : "text-decoration: none"}',
                            disabled: '{record.type !== "METRIC"}'
                        }
                    },
                    editor: {
                        xtype: 'numberfield',
                        bind: {
                            disabled: '{record.type !== "METRIC"}'
                        }
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

            console.log(policy.getData(true));

            dialog.ownerCmp.getStore().add(policy);
            dialog.close();
        }

    }

});
