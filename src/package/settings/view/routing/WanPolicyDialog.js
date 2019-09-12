Ext.define('Mfw.settings.routing.WanPolicyDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.wan-policy-dialog',

    viewModel: {
        data: {
            allWans: [],
            selectedWansCount: null
        },
        formulas: {
            singleWanValue: function (get) {
                var policy = get('policy');
                if (policy.get('type') === 'SPECIFIC_WAN') {
                    if (policy.interfaces().count() > 0) {
                        return policy.interfaces().first().get('interfaceId');
                    }
                }
            },

            multipleWansValue: function (get) {
                var policy = get('policy');
                if (policy.get('type') !== 'SPECIFIC_WAN') {
                    if (policy.interfaces().count() === 1 && policy.interfaces().first().get('interfaceId') === 0) {
                        return 'ALL';
                    } else {
                        return 'SPECIFIC';
                    }
                } else {
                    return 'ALL';
                }

            }
        }
    },

    config: {
        policy: null
    },

    width: 800,

    // bind: {
    //     width: '{policy.type === "SPECIFIC_WAN" ? 300 : 800}'
    // },

    height: 700,
    draggable: false,
    showAnimation: {
        duration: 0
    },

    layout: 'fit',

    bodyPadding: 0,
    // bodyStyle: 'background: #EEE',

    items: [{
        xtype: 'formpanel',
        itemId: 'mainform',

        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        docked: 'left',
        shadow: true,
        width: 300,
        zIndex: 10,
        padding: 16,
        // style: 'background: #FFF',

        defaults: {
            labelAlign: 'top'
        },

        items: [{
            xtype: 'component',
            style: 'font-size: 24px; font-weight: 100',
            margin: '8 0',
            bind: {
                html: '{action === "ADD" ? "Create" : "Edit"} WAN Policy',
            }
        }, {
            xtype: 'togglefield',
            bind: {
                boxLabel: '<strong>{policy.enabled ? "Enabled" : "Disabled"}</strong>',
                value: '{policy.enabled}'
            }
        }, {
            xtype: 'textfield',
            label: 'Description',
            placeholder: 'enter description ...',
            bind: '{policy.description}',
            required: true,
            clearable: false
        }, {
            xtype: 'selectfield',
            label: 'Type',
            required: true,
            bind: '{policy.type}',
            options: [
                { text: 'Specific WAN', value: 'SPECIFIC_WAN' },
                { text: 'Best WAN', value: 'BEST_OF' },
                { text: 'Balance', value: 'BALANCE' }
            ]
        }, {
            xtype: 'selectfield',
            itemId: 'singleWanValue',
            label: 'WAN',
            placeholder: 'Please select ...',
            hidden: true,
            required: true,
            autoSelect: true,
            displayTpl: '{name}',
            itemTpl: '{name}',
            valueField: 'interfaceId',
            displayField: 'name',
            bind: {
                value: '{singleWanValue}',
                hidden: '{policy.type !== "SPECIFIC_WAN"}',
                required: '{policy.type === "SPECIFIC_WAN"}',
                options: '{allWans}'
            }
        }, {
            xtype: 'selectfield',
            label: 'Metric',
            placeholder: 'select a metric ...',
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
            label: 'Algorithm',
            placeholder: 'select an algorithm ...',
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
            label: 'WANs',
            placeholder: 'Please select ...',
            value: 'ALL',
            hidden: true,
            required: true,
            bind: {
                value: '{multipleWansValue}',
                hidden: '{policy.type === "SPECIFIC_WAN"}',
                required: '{policy.type !== "SPECIFIC_WAN"}',
            },
            options: [
                { text: 'All WANs', value: 'ALL' },
                { text: 'Pick specific WANs', value: 'SPECIFIC' }
            ]
        }, {
            xtype: 'component',
            margin: '16 0 0 0',
            style: 'color: #777;',
            html: 'Set weight for each WAN (1 to 10000)',
            hidden: true,
            bind: {
                hidden: '{!(policy.type === "BALANCE" && policy.balance_algorithm === "WEIGHTED" && wanSelection.value === "SPECIFIC")}',
            }
        }, {
            xtype: 'grid',
            cls: 'c-noheaders',
            // hideHeaders: true,
            itemId: 'allWansGrid',
            flex: 1,
            margin: '8 0 0 0',
            plugins: {
                gridcellediting: {
                    triggerEvent: 'tap'
                }
            },
            rowLines: false,
            selectable: false,
            hideMode: 'visibility',
            hidden: true,
            bind: {
                hidden: '{policy.type === "SPECIFIC_WAN" || wanSelection.value === "ALL"}'
            },
            columns: [{
                xtype: 'checkcolumn',
                dataIndex: 'checked',
                width: 40,
                sortable: false,
                resizable: false,
                menuDisabled: true
            }, {
                text: 'Interface',
                dataIndex: 'name',
                width: 100,
                sortable: false,
                hideable: false,
                resizable: false,
                menuDisabled: true,
                cell: { encodeHtml: false }
                // renderer: Renderer.interface
            }, {
                dataIndex: 'weight',
                sortable: false,
                flex: 1,
                menuDisabled: true,
                cell: {
                    encodeHtml: false,
                    tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit' }]
                },
                hideMode: 'visibility', // !important so the weight column is shown properly
                hidden: false,
                bind: {
                    hidden: '{!(policy.type === "BALANCE" && policy.balance_algorithm === "WEIGHTED")}'
                },
                editable: true,
                editor: {
                    xtype: 'numberfield',
                    placeholder: '1 to 10000',
                    clearable: false,
                    required: true,
                    defaultValue: 100,
                    maxLength: 5,
                    decimals: 0,
                    minValue: 1,
                    maxValue: 10000
                },
                renderer: function (value) {
                    return value || '<em>< set weight ></em>';
                }
            }],
            listeners: {
                show: function (grid) {
                    grid.refresh();
                }
            }
        },
        // {
        //     xtype: 'component',
        //     hidden: true,
        //     style: 'background: #ffeb99; border-radius: 3px; padding: 8px;',
        //     bind: {
        //         html: '<i class="x-fa fa-exclamation-triangle"></i> <strong>{policy.type === "BEST_OF" ? "Best WAN" : "Balance"}</strong> policy type requires more than a single wan to be selected!',
        //         hidden: '{!multipleWanWarning || policy.type ==="SPECIFIC_WAN"}'
        //     }
        // },
        {
            xtype: 'toolbar',
            docked: 'bottom',
            items: [
                '->', {
                text: 'Cancel',
                margin: '0 8 0 0',
                handler: 'onCancel'
            }, {

                bind: {
                    text: '{action === "ADD" ? "Add" : "Update"}',
                },
                ui: 'action',
                handler: 'onSubmit'
            }]
        }]
    }, {
        xtype: 'container',
        layout: 'center',
        hidden: true,
        bind: {
            hidden: '{policy.type !== "SPECIFIC_WAN"}'
        },
        items: [{
            html: 'No extra options!'
        }]
    }, {
        xtype: 'container',
        margin: '16 0 0 0',
        layout: 'vbox',
        defaults: {
            // margin: '0 8',
        },

        hidden: true,
        bind: {
            hidden: '{policy.type === "SPECIFIC_WAN"}',
        },
        items: [{
            xtype: 'container',
            padding: '0 16',
            margin: '0 0 8 0',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [{
                xtype: 'component',
                style: 'font-size: 16px;',
                html: 'WAN Criteria'
            }, {
                flex: 1
            }, {
                xtype: 'button',
                text: 'New',
                ui: 'action',
                handler: 'newWanCriterion'
            }]
        }, {
            xtype: 'grid',
            itemId: 'wanCriterionsGrid',
            cls: 'c-noheaders',
            flex: 1,
            margin: '0 4',
            rowLines: false,
            plugins: {
                gridcellediting: {
                    triggerEvent: 'tap'
                }
            },
            // style: 'background: #EEE',
            selectable: {
                mode: 'single',
                cells: false
            },

            hidden: true,
            bind: {
                store: '{policy.criteria}',
                hidden: '{policy.type === "SPECIFIC_WAN"}',
            },
            columns: [{
                // text: 'Definition',
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

                    if (record.get('type') === 'CONNECTIVITY') {
                        text = record.get('connectivityTestType') + ' test ' +
                               '<b>' + record.get('connectivityTestTarget') + '</b> at ' +
                               record.get('connectivityTestInterval') + ' seconds interval, ' +
                               ' with max ' + record.get('connectivityTestFailureThreshold') + ' failures';
                        output.push(text);
                    }

                    return output.join('<br/>');
                }
            }, {
                width: 44,
                align: 'center',
                sortable: false,
                hideable: false,
                menuDisabled: true,
                cell: {
                    tools: {
                        remove: {
                            iconCls: 'md-icon-close',
                            handler: 'removeCriterion'
                        },
                    }
                }
            }],
            deferEmptyText: false,
            emptyText: 'No Criteria!',
            listeners: {
                select: 'onWanCriterionSelect'
            }
        }, {
            xtype: 'container',
            layout: 'vbox',
            docked: 'bottom',
            shadow: true,

            padding: 16,

            hidden: true,
            bind: {
                hidden: '{!wanCriterion}',
            },

            // style: 'background: #f3f3f3; position: absolute; bottom: 0; left: 0; right: 0',

            style: 'background: #f3f3f3;',

            items: [{
                xtype: 'component',
                style: 'font-size: 16px;',
                html: 'Add/Edit Criterion',
                margin: '0 0 8 0'
            }, {
                xtype: 'formpanel',
                itemId: 'criterionForm',
                padding: 0,
                bodyStyle: 'background: transparent',
                flex: 1,
                // bind: {
                //     record: '{wanCriterion}'
                // },

                defaults: {
                    labelAlign: 'top',
                    clearable: false,
                    autoComplete: false
                },

                items: [{
                    xtype: 'containerfield',
                    layout: {
                        type: 'hbox',
                        align: 'bottom'
                    },
                    bodyPadding: 0,
                    defaults: {
                        margin: '0',
                        labelAlign: 'top'
                    },
                    items: [{
                        xtype: 'selectfield',
                        label: 'Criteria Type',
                        required: true,
                        width: 150,
                        options: [
                            { text: 'Attribute', value: 'ATTRIBUTE' },
                            { text: 'Metric', value: 'METRIC' },
                            { text: 'Connectivity Test', value: 'CONNECTIVITY' }
                        ],
                        bind: '{wanCriterion.type}'
                    }, {
                        xtype: 'selectfield',
                        label: 'Attribute',
                        required: false,
                        hidden: true,
                        width: 120,
                        margin: '0 16',
                        value: 'VPN',
                        options: [
                            { text: 'Is VPN', value: 'VPN' },
                            { text: 'Name', value: 'NAME' }
                        ],
                        bind: {
                            required: '{wanCriterion.type === "ATTRIBUTE"}',
                            hidden: '{wanCriterion.type !== "ATTRIBUTE"}',
                            value: '{wanCriterion.attribute}'
                        }
                    }, {
                        xtype: 'textfield',
                        label: 'Name contains',
                        placeholder: 'enter name',
                        flex: 1,
                        required: false,
                        hidden: true,
                        bind: {
                            value: '{wanCriterion.name_contains}',
                            required: '{wanCriterion.type === "ATTRIBUTE" && wanCriterion.attribute === "NAME"}',
                            hidden: '{wanCriterion.type !== "ATTRIBUTE" || wanCriterion.attribute !== "NAME"}'
                        }
                    }]
                }, {
                    xtype: 'containerfield',
                    layout: {
                        type: 'hbox',
                        align: 'bottom'
                    },
                    bodyPadding: 0,
                    hidden: true,
                    bind: {
                        hidden: '{wanCriterion.type !== "METRIC"}'
                    },
                    defaults: {
                        margin: '0',
                        labelAlign: 'top'
                    },
                    items: [{
                        xtype: 'selectfield',
                        label: 'Metric',
                        options: Map.options.wanMetrics,
                        required: false,
                        bind: {
                            value: '{wanCriterion.metric}',
                            required: '{wanCriterion.type === "METRIC"}'
                        }
                    }, {
                        xtype: 'selectfield',
                        margin: '0 16',
                        options: [
                            { text: 'Less Than [ < ]', value: '<' },
                            { text: 'More Than [ > ]', value: '>' },
                            { text: 'Less Than or Equal [ <= ]', value: '<=' },
                            { text: 'More Than or Equal [ >= ]', value: '>=' },
                        ],
                        required: false,
                        bind: {
                            value: '{wanCriterion.metric_op}',
                            required: '{wanCriterion.type === "METRIC"}'
                        }
                    }, {
                        xtype: 'numberfield',
                        placeholder: 'enter value',
                        required: false,
                        autoComplete: false,
                        bind: {
                            value: '{wanCriterion.metric_value}',
                            required: '{wanCriterion.type === "METRIC"}'
                        }
                    }]
                }, {
                    xtype: 'containerfield',
                    layout: {
                        type: 'hbox',
                        align: 'bottom'
                    },
                    bodyPadding: 0,
                    hidden: true,
                    bind: {
                        hidden: '{wanCriterion.type !== "CONNECTIVITY"}'
                    },
                    defaults: {
                        margin: '0',
                        labelAlign: 'top',
                        clearable: false
                    },
                    items: [{
                        xtype: 'selectfield',
                        label: 'Type',
                        width: 150,
                        required: false,
                        options: [
                            { text: 'PING', value: 'PING' },
                            { text: 'ARP', value: 'ARP' },
                            { text: 'DNS', value: 'DNS' },
                            { text: 'HTTP', value: 'HTTP' }
                        ],
                        bind: {
                            value: '{wanCriterion.connectivityTestType}',
                            required: '{wanCriterion.type === "CONNECTIVITY"}'
                        }
                    }, {
                        xtype: 'numberfield',
                        label: 'Interval',
                        placeholder: 'seconds',
                        flex: 1,
                        margin: '0 32',
                        required: false,
                        autoComplete: false,
                        bind: {
                            value: '{wanCriterion.connectivityTestInterval}',
                            required: '{wanCriterion.type === "CONNECTIVITY"}'
                        }
                    }, {
                        xtype: 'numberfield',
                        label: 'Timeout',
                        placeholder: 'seconds',
                        flex: 1,
                        required: false,
                        autoComplete: false,
                        bind: {
                            value: '{wanCriterion.connectivityTestTimeout}',
                            required: '{wanCriterion.type === "CONNECTIVITY"}'
                        }
                    }]
                }, {
                    xtype: 'containerfield',
                    layout: {
                        type: 'hbox',
                        align: 'bottom'
                    },
                    bodyPadding: 0,
                    hidden: true,
                    bind: {
                        hidden: '{wanCriterion.type !== "CONNECTIVITY"}'
                    },
                    defaults: {
                        margin: '0',
                        labelAlign: 'top'
                    },
                    items: [{
                        xtype: 'selectfield',
                        label: 'Failure Threshold',
                        placeholder: '1-10 failures',
                        width: 150,
                        margin: '0 32 0 0',
                        required: false,
                        autoComplete: false,
                        options: [
                            { text: '1 failure', value: 1 },
                            { text: '2 failures', value: 2 },
                            { text: '3 failures', value: 3 },
                            { text: '4 failures', value: 4 },
                            { text: '5 failures', value: 5 },
                            { text: '6 failures', value: 6 },
                            { text: '7 failures', value: 7 },
                            { text: '8 failures', value: 8 },
                            { text: '9 failures', value: 9 },
                            { text: '10 failures', value: 10 }

                        ],
                        bind: {
                            value: '{wanCriterion.connectivityTestFailureThreshold}',
                            required: '{wanCriterion.type === "CONNECTIVITY"}'
                        }
                    }, {
                        xtype: 'textfield',
                        label: 'Target',
                        placeholder: 'IP/host address to test',
                        flex: 1,
                        required: false,
                        bind: {
                            value: '{wanCriterion.connectivityTestTarget}',
                            required: '{wanCriterion.type === "CONNECTIVITY"}'
                        }
                    }]
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    margin: '16 0 0 0',
                    items: [{
                        flex: 1
                    }, {
                        xtype: 'button',
                        text: 'Cancel',
                        margin: '0 16 0 0',
                        handler: 'cancelWanCriterion'
                    }, {
                        xtype: 'button',
                        text: 'Done',
                        ui: 'action',
                        handler: 'setWanCriterion'
                    }]
                }]
            }]
        }]
    }],

    controller: {
        init: function (view) {
            var me = this,
                policy = view.getPolicy() || Ext.create('Mfw.model.WanPolicy'),
                interfacesStore = Ext.getStore('interfaces'),
                vm = view.getViewModel();

            vm.set({
                policy: policy,
                action: view.getPolicy() ? 'EDIT' : 'ADD'
            });

            if (!interfacesStore.isLoaded()) {
                interfacesStore.load(function () {
                    me.setWans();
                });
            } else {
                me.setWans();
            }
        },

        setWans: function () {
            var me = this,
                vm = me.getViewModel(),
                policy = vm.get('policy'),
                policyWans = policy.interfaces(), wan,
                interfacesStore = Ext.getStore('interfaces'), allWans = [];

            interfacesStore.each(function (intf) {
                if (intf.get('wan')) {
                    wan = policyWans.findRecord('interfaceId', intf.get('interfaceId')),
                    allWans.push({
                        // check interfaces which are used in this policy
                        checked: wan ? true : false,
                        name: intf.get('name'),
                        interfaceId: intf.get('interfaceId'),
                        weight: wan ? wan.get('weight') : 100
                    });
                }
            });

            vm.set('allWans', allWans);
            me.getView().down('#allWansGrid').setStore({
                data: allWans
            });
        },


        setWanCriterion: function (btn) {
            var me = this,
                vm = me.getViewModel(),
                grid = me.getView().down('#wanCriterionsGrid'),
                form = btn.up('formpanel');

            if (!form.validate()) { return; }

            vm.get('policy.criteria').add(vm.get('wanCriterion'));

            // grid.getStore().commitChanges();
            grid.getSelectable().deselectAll();
            vm.set('wanCriterion', null);
        },


        newWanCriterion: function () {
            var grid = this.getView().down('#wanCriterionsGrid');
            grid.getSelectable().deselectAll();
            this.getViewModel().set('wanCriterion', Ext.create('Mfw.model.WanCriterion'));
        },

        cancelWanCriterion: function () {
            var grid = this.getView().down('#wanCriterionsGrid');
            grid.getSelectable().deselectAll();

            grid.getStore().rejectChanges();
            // this.getViewModel().get('wanCriterion').reject(true);
            this.getViewModel().set('wanCriterion', null);
        },

        onWanCriterionSelect: function (grid, selection) {
            this.getViewModel().set('wanCriterion', selection);
        },

        removeCriterion: function (grid, info) {
            grid.getStore().remove(info.record);
            this.getViewModel().set('wanCriterion', null);
        },



        onCancel: function () {
            var me = this,
                policy = me.getViewModel().get('policy');

            policy.interfaces().rejectChanges();
            policy.criteria().rejectChanges();
            policy.reject();

            me.getView().destroy();
        },

        onSubmit: function () {
            var me = this,
                vm = me.getViewModel(),
                policy = vm.get('policy'),
                dialog = me.getView(),
                mainForm = dialog.down('#mainform');

            if (!mainForm.validate()) { return; }

            /**
             * set policy interfaces based on policy type, algorithm etc ...
             */
            policy.interfaces().removeAll();
            if (policy.get('type') !== 'SPECIFIC_WAN') {
                if (vm.get('wanSelection').value === "ALL") {
                    policy.interfaces().add({
                        interfaceId: 0
                    });
                } else {
                    dialog.down('#allWansGrid').getStore().each(function (wan) {
                        if (wan.get('checked')) {
                            policy.interfaces().add({
                                interfaceId: wan.get('interfaceId'),
                                weight: (policy.get('balance_algorithm') === 'WEIGHTED') ? wan.get('weight') : null
                            });
                        }
                    });
                }
            } else {
                policy.interfaces().add({
                    interfaceId: dialog.down('#singleWanValue').getValue(),
                    weight: null
                });
            }


            if (vm.get('action') === 'ADD') {
                dialog.ownerCmp.getStore().add(policy);
            } else {
                policy.interfaces().commitChanges();
                policy.criteria().commitChanges();
                policy.commit();
            }

            me.getView().destroy();
        }
    }
});
