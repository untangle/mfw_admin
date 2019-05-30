Ext.define('Mfw.cmp.grid.table.RuleDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.rule-dialog',

    viewModel: {},

    config: {
        rule: null
    },

    width: '80%',
    height: '80%',
    minWidth: 500,
    // maximized: true,

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
                html: '<h1 style="margin: 0; font-weight: 400;">{action === "ADD" ? "Create New" : "Edit"} <span style="color: #777;">{ruleType}</span> Rule</h1>'
            }
        }, {
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
            html: '<h2 style="font-weight: 400;">If All the following Conditions are met</h2>'
        }, {
            xtype: 'grid',
            // userCls: 'c-noheaders',
            height: 300,
            emptyText: 'No Conditions!'.t(),
            deferEmptyText: false,
            rowLines: false,
            sortable: false,
            selectable: {
                columns: false,
                rows: false
            },
            margin: '0 16 0 0',
            padding: 0,
            bind: '{rule.conditions}',
            plugins: {
                gridcellediting: {
                    triggerEvent: 'tap'
                }
            },
            itemConfig: {
                viewModel: true
            },
            columns: [{
                text: 'Type',
                dataIndex: 'type',
                width: 250,
                menuDisabled: true,
                cell: {
                    encodeHtml: false
                },
                renderer: 'typeRenderer'
            }, {
                text: 'Operator',
                dataIndex: 'op',
                width: 200,
                menuDisabled: true,
                cell: {
                    encodeHtml: false,
                    tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
                },
                renderer: 'operatorRenderer'
            }, {
                text: 'Value',
                dataIndex: 'value',
                flex: 1,
                menuDisabled: true,
                cell: {
                    encodeHtml: false,
                    tools: [{ cls: 'cell-edit-icon', iconCls: 'md-icon-edit', zone: 'end' }]
                },
                renderer: Renderer.conditionValue
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
                childmouseenter: 'mouseEnter'
            }
        }, {
            xtype: 'component',
            html: '<hr style="margin: 32px 0;"/><h2 style="font-weight: 400;">Apply the following Action</h2>'
        }, {
            xtype: 'formpanel',
            itemId: 'actionform',
            margin: 0,
            padding: 0,
            width: 300,
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
        }]
    }, {
        xtype: 'container',
        style: 'background: #F3F3F3;',
        layout: 'fit',
        items: [{
            xtype: 'component',
            docked: 'top',
            padding: '0 16 16 16',
            html: '<h2 style="font-weight: 100;">Available Condition Types</h2>' +
                  '<p>Select and set one or more Conditions to add to the Rule</p>'
        }, {
            xtype: 'panel',
            docked: 'left',
            width: 250,
            layout: 'vbox',
            bodyStyle: 'background: #F3F3F3;',
            items: [{
                xtype: 'searchfield',
                margin: '0 0 16 8',
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
            }]
        }, {
            xtype: 'formpanel',
            itemId: 'conditionform',
            padding: '0 32',
            layout: 'vbox',
            hidden: true,
            bind: {
                hidden: '{!tree.selection.type}'
            },
            bodyStyle: 'background: #F3F3F3;',
            items: [{
                xtype: 'component',
                bind: {
                    html: '<h2 style="font-weight: 400; margin: 0;">{tree.selection.text}</h2>' +
                          '<span style="color: #777; font-size: 12px;">[ {tree.selection.type} ]</span>'
                }
            }, {
                xtype: 'component',
                bind: {
                    html: '<p>{tree.selection.description}</p>'
                }
            }, {
                xtype: 'hiddenfield',
                name: 'type',
                bind: {
                    value: '{tree.selection.type}'
                }
            }, {
                xtype: 'selectfield',
                placeholder: 'Select ...',
                name: 'op',
                label: 'Operator'.t(),
                labelAlign: 'top',
                editable: false,
                required: true,
                displayTpl: '{text} [ {value} ]',
                itemTpl: '<tpl>{text} <span style="color: #999;">[ {value} ]</span></tpl>',
                options: [
                    { value: '==', text: 'Equals'.t(), sign: '[ = ]' },
                    { value: '!=', text: 'Not Equals'.t(), sign: '[ != ]' },
                    { value: '>', text: 'Greater Than'.t(), sign: '[ > ]' },
                    { value: '<', text: 'Less Than'.t(), sign: '[ < ]' },
                    { value: '>=', text: 'Greater Than or Equal'.t(), sign:'[ >= ]' },
                    { value: '<=', text: 'Less Than or Equal'.t(), sign: '[ <= ]' }
                ]
            }, {
                xtype: 'button',
                text: 'Add',
                ui: 'action',
                margin: '32 0 0 0',
                width: 100,
                handler: 'addCondition'
            }]
        }, {
            xtype: 'component',
            style: 'text-align: center;',
            html: 'No Selection!',
            margin: '120 0 0 0',
            hidden: true,
            bind: {
                hidden: '{tree.selection}'
            }
        }]
    }],
    controller: {
        init: function (dialog) {
            var tableGrid = dialog.ownerCmp,
                actions = tableGrid.getActions(),
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

            vm.set({
                action: !rule ? 'ADD' : 'EDIT',
                ruleType: dialog.ownerCmp.ruleTitle || dialog.ownerCmp.getTitle()
            });

            if (!rule) {
                rule = new Mfw.model.table.Rule({
                    enabled: true
                });
            }

            rule.conditions().commitChanges(); // needed
            vm.set('rule', rule);
        },

        onConditionSelect: function (el, selection) {
            var me = this,
                form = me.getView().down('#conditionform'),
                valueField,
                unitField = selection.get('unitField'),
                groupField = selection.get('groupField'),
                operators = [];

            if (!selection.get('field')) {
                selection.set('field', {
                    xtype: 'textfield'
                });
            }

            valueField = selection.get('field');

            // remove all fields except operator
            Ext.Object.each(form.getFields(), function (key, field) {
                if (field.getName() !== 'op') {
                    form.remove(field);
                }
            });

            // set available operators for selected condition type, and preselect first operator
            if (selection.get('operators')) {
                Ext.Object.each(selection.get('operators'), function (key, op) {
                    operators.push(Util.operatorsMap[op]);
                });
            } else {
                operators = Util.operators;
            }
            form.getFields('op').setOptions(operators).setValue(operators[0].value);

            Ext.apply(selection.get('field'), {
                name: 'value',
                label: 'Value',
                labelAlign: 'top',

                clearable: false,
                autoComplete: false,
                placeholder: 'Set value ...'.t(),
                required: true,
                errorTarget: 'under'
                // listeners: {
                //     painted: function (el) {
                //         el.focus();
                //     },
                //     destroy: function (el) {
                //         console.log('destroy');
                //         el.clearListeners();
                //     }
                // }
            });

            // if values are from a collection (selectfield), preselect first value
            if (valueField.xtype === 'selectfield') {
                valueField.value = valueField.options[0].value;
            }

            // insert value field into the form
            form.insertBefore(valueField, form.down('button'));

            // used for LIMIT_RATE
            if (unitField) {
                unitField.value = unitField.options[0].value;
                form.insertBefore(unitField, form.down('button'));
            }

            // used for LIMIT_RATE
            if (groupField) {
                groupField.value = groupField.options[0].value;
                form.insertBefore(groupField, form.down('button'));
            }
        },

        onActionTypeChange: function (combo, value) {
            var me = this,
                rule = me.getViewModel().get('rule'),
                action = rule.getAction(),
                grid = me.getView().ownerCmp,
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
                        store: '{chainNames}'
                    }
                });
                return;
            }

            if (value === 'DNAT') {
                if (!action) {rule.getAction().set('dnat_address', ''); }
                // if (!action) { rule.setAction(Ext.create('Mfw.model.table.Action', { type: value, dnat_address: '' })); }
                actionform.add({
                    xtype: 'textfield',
                    itemId: 'actionValue',
                    name: 'dnat_address',
                    label: 'Destination Address'.t(),
                    required: true,
                    bind: '{rule.action.dnat_address}',
                    // value: rule.get('action').dnat_address || undefined,
                    validators: 'ipany'
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
                    options: [
                        { text: 'Priority 1', value: 1 },
                        { text: 'Priority 2', value: 2 },
                        { text: 'Priority 3', value: 3 },
                        { text: 'Priority 4', value: 4 }
                    ]
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
                    options: grid.policies,
                    bind: '{rule.action.policy}'
                });
                return;
            }

            if (value === 'NEW_PORT') {
                if (!action) { rule.getAction().set('port', null); }
                actionform.add({
                    xtype: 'numberfield',
                    itemId: 'actionValue',
                    name: 'port',
                    label: 'Value'.t(),
                    placeholder: 'Set value ...',
                    required: true,
                    bind: '{rule.action.port}',
                    validators: {
                        type: 'format',
                        message: 'Invalid port number',
                        matcher: new RegExp('^()([1-9]|[1-5]?[0-9]{2,4}|6[1-4][0-9]{3}|65[1-4][0-9]{2}|655[1-2][0-9]|6553[1-5])$')
                    }
                });
                return;
            }

        },

        addCondition: function () {
            var me = this,
                vm = me.getViewModel(),
                rule = vm.get('rule'),
                form = me.getView().down('#conditionform'),
                valueField = form.getFields('value');

            if (!form.validate()) { return; }
            rule.conditions().add(form.getValues());
            valueField.reset();
            valueField.setError(null);
            valueField.focus();
            // form.reset(true);
        },

        typeRenderer: function (value) {
            if (!Conditions.map[value]) {
                console.warn('Condition ' + value + ' not defined!');
                return '';
            }
            return '<strong>' + Conditions.map[value].text + '</strong>';
        },

        operatorRenderer: function (value) {
            return Util.operatorsMap[value].text + ' <span style="color: #999;">[ ' + value + ' ]</span>';
        },

        filterConditionType: function (field, value) {
            var me = this,
                tree = me.getView().down('tree'),
                store = tree.getStore(),
                root = store.getRoot();
                // expandedNode = null;

            store.clearFilter();

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


        /**
         * Used to update column editor based on condition type
         */
        mouseEnter: function (el, location) {
            var condition = Conditions.map[location.record.get('type')],
                operators = [];

            if (location.column.getText() === 'Operator') {
                if (condition.operators) {
                    Ext.Object.each(condition.operators, function (key, op) {
                        operators.push(Util.operatorsMap[op]);
                    });
                } else {
                    operators = Util.operators;
                }
                location.column.setEditor({
                    xtype: 'selectfield',
                    editable: false,
                    clearable: false,
                    displayTpl: '{text} [ {value} ]',
                    itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
                    options: operators
                });
            }

            if (location.column.getText() === 'Value') {
                if (condition.field) {
                    location.column.setEditor(condition.field);
                } else {
                    location.column.setEditor({
                        xtype: 'textfield',
                        clearable: false,
                        required: true
                    });
                }
            }

            // console.log(condition);
        },

        onCancel: function () {
            var me = this,
                vm = me.getViewModel(),
                rule = vm.get('rule');

            rule.reject();
            rule.conditions().rejectChanges();
            if (rule.getAction()) { rule.getAction().reject(); }
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
            } else {
                rule.commit();
            }
            me.getView().destroy();
        }
    }
});
