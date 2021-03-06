Ext.define('Mfw.cmp.grid.table.RuleDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.rule-dialog',

    viewModel: {
        data: {
            sentence: ''
        }
    },

    config: {
        rule: null
    },

    width: '80%',
    height: '80%',
    minWidth: 500,

    bodyPadding: 0,

    showAnimation: {
        duration: 0
    },

    layout: 'fit',

    items: [{
        xtype: 'panel',
        layout: 'vbox',
        padding: 16,
        docked: 'left',
        shadow: true,
        zIndex: 999,
        width: '55%',
        items: [{
            xtype: 'component',
            bind: {
                html: '<h1 style="margin: 0; font-weight: 400; font-size: 24px;">{action === "ADD" ? "Create New" : "Edit"} <span style="color: #519839;">{ruleType}</span> Rule</h1>'
            }
        }, {
            xtype: 'container',
            layout: 'vbox',
            flex: 1,
            scrollable: true,
            items: [{
                xtype: 'formpanel',
                padding: 0,
                layout: 'hbox',
                margin: '16 0',
                defaults: {
                    labelAlign: 'top'
                },
                items: [{
                    xtype: 'textfield',
                    name: 'description',
                    label: 'Description'.t(),
                    placeholder: 'Enter description ...',
                    width: 300,
                    autoComplete: false,
                    clearable: false,
                    required: true,
                    bind: '{rule.description}',
                    listeners: {
                        painted: function (field) {
                            field.focus();
                        }
                    }
                }, {
                    xtype: 'checkboxfield',
                    name: 'enabled',
                    label: '&nbsp;',
                    boxLabel: 'Enabled'.t(),
                    bodyAlign: 'left',
                    flex: 1,
                    margin: '0 0 0 16',
                    bind: {
                        checked: '{rule.enabled}',
                    }
                }]
            }, {
                xtype: 'component',
                html: '<h2 style="font-weight: 100;">If All the following Conditions are met</h2>'
            }, {
                xtype: 'grid',
                reference: 'grid',
                userCls: 'c-noheaders',
                flex: 1,
                minHeight: 120,
                emptyText: 'No Conditions!'.t(),
                deferEmptyText: false,
                rowLines: false,
                sortable: false,
                deselectOnContainerClick: true,
                selectable: {
                    mode: 'single',
                    cells: false
                },
                margin: '0 16 0 0',
                padding: 0,
                bind: '{rule.conditions}',
                itemConfig: {
                    viewModel: true
                },
                columns: [{
                    text: 'Type',
                    dataIndex: 'type',
                    menuDisabled: true,
                    flex: 1,
                    cell: {
                        encodeHtml: false,
                        bodyStyle: {
                            padding: '8px 16px'
                        }
                    },
                    renderer: Renderer.conditionText
                }, {
                    width: 44,
                    sortable: false,
                    hideable: false,
                    menuDisabled: true,
                    cell: {
                        tools: {
                            delete: {
                                iconCls: 'md-icon-close',
                                handler: function (grid, info) {
                                    info.record.drop();
                                }
                            }
                        }
                    }
                }],
                listeners: {
                    select: 'onConditionSelect'
                }
            }, {
                xtype: 'component',
                html: '<hr style="margin: 32px 0;"/><h2 style="font-weight: 100;">Apply the following Action</h2>'
            }, {
                xtype: 'formpanel',
                itemId: 'actionform',
                margin: 0,
                padding: 0,
                // flex: 1,
                width: '50%',
                minHeight: 100,
                defaults: {
                    labelAlign: 'top'
                },
                items: [{
                    xtype: 'selectfield',
                    reference: 'actiontype',
                    itemId: 'actiontype',
                    name: 'type',
                    // label: 'Action'.t(),
                    placeholder: 'Choose action ...',
                    editable: false,
                    required: true,
                    itemTpl: '<tpl>{text}</tpl>',
                    bind: '{rule.action.type}',
                    listeners: {
                        change: 'onActionTypeChange'
                    }
                }]
            }, {
                xtype: 'component',
                html: '<hr style="margin: 32px 0;"/><h2 style="font-weight: 100;">Summary</h2>'
            }, {
                xtype: 'component',
                style: 'font-size: 16px;',
                padding: '0 0 16 0',
                bind: {
                    html: '{sentence}'
                }
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
                    text: '{action === "ADD" ? "Create" : "Update"} Rule'
                },
                ui: 'action',
                handler: 'onSubmit'
            }]
        }]
    }, {
        xtype: 'container',
        style: 'background: #F3F3F3;',
        layout: 'fit',
        items: [{
            xtype: 'component',
            docked: 'top',
            padding: 16,
            bind: {
                html: '<h1 style="margin: 0; font-weight: 400; font-size: 24px; color: #111;">{!grid.selection ? "Add" : "Edit"} Condition</h1>'
            }
        }, {
            xtype: 'panel',
            docked: 'left',
            width: 250,
            layout: 'vbox',
            manageBorders: false,
            style: 'box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);',
            zIndex: 10,
            bodyStyle: 'background: #F3F3F3;',
            items: [{
                xtype: 'searchfield',
                margin: 16,
                placeholder: 'Find Condition Type ...'.t(),
                listeners: {
                    change: 'filterConditionType'
                }
            }, {
                xtype: 'tree',
                reference: 'tree',
                userCls: 'events-tree c-noheaders',
                singleExpand: true,
                expanderOnly: false,
                selectOnExpander: true,
                style: 'background: #F3F3F3;',
                flex: 1,
                selectable: {
                    mode: 'single'
                },
                columns: [{
                    xtype: 'treecolumn',
                    dataIndex: 'text',
                    flex: 1,
                    cell: {
                        // cellCls: 'event-key',
                        encodeHtml: false
                    }
                }],
                store: {
                    type: 'conditionsTree',
                    rootVisible: false,
                    filterer: 'bottomup'
                },
                listeners: {
                    select: 'onConditionSelect'
                },
            }],
            bind: {
                width: '{grid.selection ? 0 : 250}'
            }
        }, {
            xtype: 'formpanel',
            itemId: 'conditionform',
            padding: 16,
            layout: 'vbox',
            hidden: true,
            bind: {
                // record: '{record}',
                hidden: '{!tree.selection && !grid.selection}'
            },
            bodyStyle: 'background: #F3F3F3;',
            items: [{
                xtype: 'component',
                bind: {
                    html: '<h2 style="font-weight: 400; margin: 0;">{condition.text}</h2>'
                }
            }, {
                xtype: 'component',
                bind: {
                    html: '<p>{condition.description}</p>'
                }
            }, {
                xtype: 'hiddenfield',
                name: 'type',
            }, {
                xtype: 'selectfield',
                placeholder: 'Select ...',
                name: 'op',
                label: 'Operator'.t(),
                labelAlign: 'top',
                editable: false,
                maxWidth: 200,
                required: true,
                displayTpl: '{text} [ {value} ]',
                itemTpl: '<tpl>{text} <span style="color: #999;">[ {value} ]</span></tpl>'
            }, {
                xtype: 'container',
                itemId: 'actionBtns',
                margin: '32 0 0 0',
                layout: {
                    type: 'hbox',
                    pack: 'right'
                },
                items: [{
                    xtype: 'button',
                    text: 'Cancel',
                    margin: '0 8 0 0',
                    width: 100,
                    handler: 'cancelEditCondition',
                    hidden: true,
                    bind: {
                        hidden: '{!grid.selection}'
                    }
                }, {
                    xtype: 'button',
                    text: 'Add',
                    ui: 'action',
                    width: 150,
                    handler: 'addUpdateCondition',
                    bind: {
                        text: '{grid.selection ? "Update" : "Add"} Condition'
                    }
                }]
            }]
        }, {
            xtype: 'component',
            style: 'text-align: center; font-size: 16px;',
            html: '<i class="x-fa fa-info-circle fa-3x fa-gray"></i><br/><p>Select a Type to add new Condition<br>or select an existing one to edit!</p>',
            margin: '120 0 0 0',
            hidden: true,
            bind: {
                hidden: '{grid.selection || tree.selection}'
            }
        }]
    }],
    controller: {
        init: function (dialog) {
            var tableGrid = dialog.ownerCmp,
                actions = tableGrid.getActions(), // possible actions for this table
                defaultAction = tableGrid.getDefaultAction(), // the default action for this table
                conditions = tableGrid.getConditions(), // possible conditions for this table
                vm = dialog.getViewModel(),
                rule = dialog.getRule(),
                actionOptions = [];

            if (actions) {
                // if subset of actions defined
                Ext.Array.each(actions, function (action) {
                    actionOptions.push(tableGrid.actionsMap[action]);
                });
                dialog.down('#actionform').getFields('type').setOptions(actionOptions);
            }

            if (conditions) {
                // display only possible conditions provided for this table
                dialog.lookup('tree').getStore().filterBy(function (rec) {
                    return Ext.Array.contains(conditions, rec.get('type'));
                });
            }

            vm.set({
                action: !rule ? 'ADD' : 'EDIT',
                ruleType: dialog.ownerCmp.ruleTitle || dialog.ownerCmp.getTitle()
            });

            if (!rule) {
                rule = new Mfw.model.table.Rule({
                    enabled: true,
                    action: {
                        type: defaultAction
                    }
                });
            }

            // rule.conditions().commitChanges(); // needed

            // update the sentence on rule cdeep hange
            vm.bind('{rule}', function (r) {
                vm.set('sentence', Renderer.conditionsSentence(null, r));
            }, this, {
                deep: true
            });
            vm.set('rule', rule);
        },

        onConditionSelect: function (dataview, selection) {
            var me = this,
                form = me.getView().down('#conditionform'),
                tree = me.lookup('tree'),
                // if selection from tree create new condition, otherwise it's an editing of existing condition
                isNewCondition = dataview.isXType('tree'),
                vm = me.getViewModel(),
                // regardless of the new selection from tree or existing condition from grid ...
                conditionDef = Conditions.map[selection.get('type')], // condition as defined in Conditions global
                // set valuefield from condition definition or default to textfield
                valueField = {
                    xtype: 'textfield'
                },
                operators = [],
                selectedCondition;

            if (conditionDef == null) {
                return;
            }

            if(conditionDef.field != null) {
                valueField = conditionDef.field;
            }

            // deselect tree if selected
            if (!isNewCondition) {
                tree.setSelection(null);
                tree.getStore().getRoot().collapseChildren();
            }

            // add condition def to viewModel
            vm.set({
                condition: conditionDef
            });

            // remove all fields except type & operator
            Ext.Object.each(form.getFields(), function (key, field) {
                if (field.getName() !== 'op' && field.getName() !== 'type') {
                    form.remove(field);
                }
            });

            // set available operators for selected condition type, and preselect first operator
            if (conditionDef.operators) {
                Ext.Array.each(conditionDef.operators, function (op) {
                    Ext.Array.each(Map.options.ruleOps, function (option) {
                        if (option.value === op) {
                            operators.push(option);
                        }
                    });
                });
            } else {
                operators = Map.options.ruleOps;
            }

            form.getFields('op').setOptions(operators).setValue(operators[0].value);


            // apply extra properties on valueField
            Ext.apply(valueField, {
                name: 'value',
                label: 'Value',
                labelAlign: 'top',

                clearable: false,
                autoComplete: false,
                placeholder: valueField.placeholder || (!valueField.multiSelect ? 'Set value ...' : ''),
                required: true,
                errorTarget: 'under'
            });

            if (conditionDef.type === 'SOURCE_INTERFACE_ZONE' ||
                conditionDef.type === 'DESTINATION_INTERFACE_ZONE' ||
                conditionDef.type === 'CLIENT_INTERFACE_ZONE' ||
                conditionDef.type === 'SERVER_INTERFACE_ZONE') {
                var intfOptions = [];
                Ext.getStore('interfaces').each(function(intf) {
                    if (intf.get('configType') === 'ADDRESSED') {
                        intfOptions.push({ text: intf.get('name'), value: intf.get('interfaceId') });
                    }
                });
                valueField.options = intfOptions;
            }

            // insert value field into the form
            form.insertBefore(valueField, form.down('#actionBtns'));

            // insert any extra fields (e.g. for LIMIT_RATE)
            if (conditionDef.extraFields) {
                Ext.Array.each(conditionDef.extraFields, function (field) {
                    form.insertBefore(field, form.down('#actionBtns'));
                });
            }

            if (!isNewCondition) {
                // if editing set the values of the selected condition
                selectedCondition = selection.getData();
                // for multiselect select fields transform the comma separated string into array of values
                if (valueField.xtype === 'selectfield' && valueField.multiSelect) {
                    selectedCondition.value = selectedCondition.value.split(',');
                }
                form.setValues(selectedCondition);
            } else {
                // if new it's enough to set the type
                form.setValues({
                    type: selection.get('type')
                });
            }
        },

        onActionTypeChange: function (combo, value) {
            var me = this,
                rule = me.getViewModel().get('rule'),
                action = rule.getAction(),
                actionform = me.getView().down('#actionform'),
                actionValue = actionform.down('#actionValue');

            if (actionValue) { actionform.remove(actionValue); }

            if (!action) { rule.setAction(Ext.create('Mfw.model.table.Action', { type: value })); }

            if (value === 'JUMP' || value === 'GOTO') {
                if (!action) { rule.getAction().set('chain', null); }
                actionform.add({
                    xtype: 'selectfield',
                    itemId: 'actionValue',
                    name: 'chain',
                    label: 'Chain'.t(),
                    editable: false,
                    required: true,
                    placeholder: 'Choose chain ...',
                    itemTpl: '{name}',
                    displayTpl: '{name}',
                    valueField: 'name',
                    bind: {
                        value: '{rule.action.chain}',
                        options: '{chainsStore}'
                    }
                });
                return;
            }

            if (value === 'DNAT') {
                /**
                 * dnat_address is an IPv4/IPv6 address + port number (optional)
                 */
                actionform.add({
                    xtype: 'containerfield',
                    itemId: 'actionValue',
                    layout: {
                        type: 'hbox',
                        align: 'bottom'
                    },
                    defaults: {
                        labelAlign: 'top',
                        clearable: false
                    },
                    items: [{
                        xtype: 'textfield',
                        name: 'dnat_address',
                        label: 'Address'.t(),
                        flex: 1,
                        required: true,
                        bind: '{rule.action.dnat_address}',
                        validators: 'ipany'
                    }, {
                        xtype: 'component',
                        html: '<strong>:</strong>',
                        margin: '3 8'
                    }, {
                        xtype: 'numberfield',
                        name: 'dnat_port',
                        width: 100,
                        label: 'Port (optional)'.t(),
                        required: false,
                        bind: '{rule.action.dnat_port}',
                        validators: 'port',
                    }]
                });
                return;
            }

            if (value === 'SNAT') {
                if (!action) {rule.getAction().set('snat_address', ''); }
                // if (!action) { rule.setAction(Ext.create('Mfw.model.table.Action', { type: value, snat_address: '' })); }
                actionform.add({
                    xtype: 'textfield',
                    itemId: 'actionValue',
                    name: 'snat_address',
                    label: 'Source Address'.t(),
                    required: true,
                    bind: '{rule.action.snat_address}',
                    // value: rule.get('action').snat_address || undefined,
                    validators: 'ipany'
                });
                return;
            }

            if (value === 'SET_PRIORITY') {
                if (!action) { rule.getAction().set('priority', null); }
                // if (!action) { rule.setAction(Ext.create('Mfw.model.table.Action', { type: value, priority: null })); }
                actionform.add({
                    xtype: 'selectfield',
                    itemId: 'actionValue',
                    name: 'priority',
                    label: 'Priority'.t(),
                    bind: '{rule.action.priority}',
                    required: true,
                    options: Map.options.priorities
                });
                return;
            }

            if (value === 'WAN_POLICY') {
                if (!action) { rule.getAction().set('policy', null); }
                // if (!action) { rule.setAction(Ext.create('Mfw.model.table.Action', { type: value, policy: null })); }
                actionform.add({
                    xtype: 'selectfield',
                    itemId: 'actionValue',
                    name: 'policy',
                    label: 'Choose WAN Policy'.t(),
                    editable: false,
                    required: true,
                    displayTpl: '{text} [ {value} ]',
                    itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
                    options: Map.options.wanPolicies,
                    bind: '{rule.action.policy}'
                });
                return;
            }
        },

        addUpdateCondition: function () {
            var me = this,
                vm = me.getViewModel(),
                grid = me.lookup('grid'),
                tree = me.lookup('tree'),
                form = me.getView().down('#conditionform'),
                values = form.getValues();

            if (!form.validate()) { return; }

            // for multiselect select fields transform the array of values into a comma separated string
            if (Ext.isArray(values.value)) {
                values.value = values.value.join(',');
            }

            if (vm.get('grid.selection')) {
                vm.get('grid.selection').set(values);
            } else {
                grid.getStore().add(values);
            }

            me.lookup('grid').setSelection(null);
            tree.setSelection(null);
            tree.getStore().getRoot().collapseChildren();
        },

        typeRenderer: function (value) {
            if (!Conditions.map[value]) {
                console.warn('Condition ' + value + ' not defined!');
                return '';
            }
            return '<strong>' + Conditions.map[value].text + '</strong>';
        },

        operatorRenderer: function (value) {
            return Map.ruleOps[value] + ' <span style="color: #999;">[ ' + value + ' ]</span>';
        },

        filterConditionType: function (field, value) {
            var me = this,
                tree = me.lookup('tree'),
                store = tree.getStore(),
                root = store.getRoot(),
                conditions = me.getView().ownerCmp.getConditions();

            store.clearFilter();

            // the above store.clearFilter() removes the conditions we have filtered for this ruleDialog instance
            // we have to refilter based on the ownerCmp conditions, so that invalid conditions do not show up 
            if (conditions) {
                // display only possible conditions provided for this table
                store.filterBy(function (rec) {
                    return Ext.Array.contains(conditions, rec.get('type'));
                });
            }

            if (value) {
                tree.setSingleExpand(false);
                root.expandChildren(true);
                store.filterBy(function (node) {
                    var v = new RegExp(value, 'i');
                    return node.isLeaf() ? v.test(node.get('text')) : false;
                });
            } else {
                tree.setSingleExpand(true);
                root.collapseChildren(true);
            }
        },

        cancelEditCondition: function () {
            var me = this,
                tree = me.lookup('tree');

            me.lookup('grid').setSelection(null);
            tree.setSelection(null);
            tree.getStore().getRoot().collapseChildren();
        },

        onCancel: function () {
            var me = this,
                vm = me.getViewModel(),
                rule = vm.get('rule');

            rule.conditions().rejectChanges();
            rule.getAction().reject();
            rule.reject();

            me.getView().destroy();
        },

        onSubmit: function () {
            var me = this,
                grid = me.getView().ownerCmp,
                vm = me.getViewModel(),
                rule = vm.get('rule'),
                form = me.getView().down('formpanel'),
                actionform = me.getView().down('#actionform');

            // validate
            form.validate();
            actionform.validate();
            vm.set('visibleAdd', false);

            if (!form.isValid() || !actionform.isValid()) { return; }

            // add action
            // rule.set('action', actionform.getValues());

            // add rule
            if (vm.get('action') === 'ADD') {
                grid.getStore().add(rule);
            }
            grid.refresh();

            me.getView().destroy();
        }
    }
});
