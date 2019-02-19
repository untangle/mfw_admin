Ext.define('Mfw.cmp.grid.table.RuleDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.rule-dialog',

    viewModel: {},

    config: {
        rule: null
    },

    bind: {
        title: '{action === "ADD" ? "Create New" : "Edit"} Rule',
    },
    width: 900,
    height: 600,

    bodyPadding: '0 16',

    showAnimation: {
        duration: 0
    },

    layout: 'fit',

    items: [{
        xtype: 'container',
        padding: 0,
        layout: 'vbox',
        // relative: true,
        items: [{
            xtype: 'formpanel',
            padding: 0,
            layout: 'hbox',
            defaults: {
                labelAlign: 'top'
            },
            items: [{
                xtype: 'textfield',
                name: 'description',
                label: 'Description'.t(),
                flex: 1,
                autoComplete: false,
                clearable: false,
                required: true,
                bind: '{rule.description}'
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
            xtype: 'panel',
            layout: 'hbox',
            flex: 1,
            margin: '16 0 0 0',
            padding: 0,
            items: [{
                xtype: 'container',
                flex: 1,
                layout: 'fit',
                padding: '16 0 0 0',
                items: [{
                    xtype: 'toolbar',
                    docked: 'top',
                    shadow: false,
                    padding: '0 8',
                    zIndex: 2,
                    items: [{
                        xtype: 'component',
                        html: 'Conditions',
                        style: 'font-weight: 100;'
                    }]
                }, {
                    xtype: 'formpanel',
                    itemId: 'conditionform',
                    docked: 'top',
                    shadow: true,
                    padding: '0 16 16 16',
                    zIndex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'bottom'
                    },
                    // hidden: true,
                    defaults: {
                        labelAlign: 'top'
                    },
                    items: [{
                        xtype: 'selectfield',
                        reference: 'conditionType',
                        name: 'type',
                        width: 200,
                        label: 'Add Condition'.t(),
                        placeholder: 'Select type ...',
                        // flex: 1,
                        matchFieldWidth: false,
                        editable: false,
                        displayField: 'name',
                        valueField: 'type',
                        // displayTpl: '{name} [ {type} ]',
                        itemTpl: '<div>{name} <br/><span style="color: #999; font-size: 10px;">[ {type} ]</span></div>',
                        options: Util.conditions,
                        required: true,
                        alignTarget: 'el',
                        listeners: {
                            change: 'onConditionTypeChange'
                        }
                    }, {
                        xtype: 'selectfield',
                        itemId: 'operation',
                        name: 'op',
                        width: 90,
                        matchFieldWidth: false,
                        textAlign: 'center',
                        margin: '0 16',
                        label: 'Operation'.t(),
                        editable: false,
                        required: true,
                        displayTpl: '{sign}',
                        itemTpl: '<tpl>{text} {sign}</tpl>',
                        value: '==',
                        hidden: true,
                        bind: {
                            hidden: '{!conditionType.value}'
                        },
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
                        margin: '0 0 0 16',
                        handler: 'addCondition',
                        hidden: true,
                        bind: {
                            hidden: '{!conditionType.value}'
                        }
                    }]
                }, {
                    xtype: 'grid',
                    userCls: 'c-noheaders',
                    emptyText: 'No Conditions!'.t(),
                    deferEmptyText: false,
                    rowLines: false,
                    selectable: {
                        columns: false,
                        rows: false
                    },
                    margin: 0,
                    padding: 0,
                    bind: '{rule.conditions}',
                    columns: [{
                        text: 'some text',
                        dataIndex: 'type',
                        flex: 1,
                        cell: {
                            bodyStyle: {
                                padding: 0
                            },
                            encodeHtml: false
                        },
                        renderer: 'conditionRenderer'
                    }, {
                        width: 70,
                        align: 'center',
                        sortable: false,
                        hideable: false,
                        menuDisabled: true,
                        cell: {
                            tools: {
                                // edit: {
                                //     iconCls: 'md-icon-edit',
                                //     handler: 'onEditCondition'
                                // },
                                delete: {
                                    iconCls: 'md-icon-delete',
                                    handler: function (grid, info) {
                                        info.record.drop();
                                    }
                                }
                            }
                        }
                    }]
                }]
            }, {
                xtype: 'formpanel',
                itemId: 'actionform',
                margin: 0,
                layout: 'vbox',
                width: '30%',
                docked: 'right',
                resizable: {
                    split: true,
                    edges: 'west'
                },
                defaults: {
                    labelAlign: 'top'
                },
                items: [{
                    xtype: 'toolbar',
                    docked: 'top',
                    shadow: false,
                    padding: '0 8',
                    items: [{
                        xtype: 'component',
                        html: 'Action',
                        style: 'font-weight: 100;'
                    }]
                }, {
                    xtype: 'selectfield',
                    reference: 'actiontype',
                    itemId: 'actiontype',
                    name: 'type',
                    label: 'Action'.t(),
                    placeholder: 'Choose action ...',
                    editable: false,
                    required: true,
                    itemTpl: '<tpl>{text}</tpl>',
                    bind: '{rule.action.type}',
                    listeners: {
                        change: 'onActionTypeChange'
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
        init: function (dialog) {
            var grid = dialog.ownerCmp,
                actions = grid.getActions(),
                vm = dialog.getViewModel(),
                rule = dialog.getRule(),
                actionOptions = [];

            if (actions) {
                // if subset of actions defined
                Ext.Array.each(actions, function (action) {
                    actionOptions.push(grid.actionsMap[action]);
                });
                dialog.down('#actionform').getFields('type').setOptions(actionOptions);
            }

            vm.set('action', !rule ? "ADD" : "EDIT");

            if (!rule) {
                rule = new Mfw.model.table.Rule({
                    enabled: true
                });
                rule.conditions().loadData([]);
            }
            vm.set('rule', rule);
        },

        onConditionTypeChange: function (combo, newValue) {
            var me = this,
                form = me.getView().down('#conditionform'),
                existingField = form.getFields('value', true);

            if (!newValue) {
                // if (existingField) {
                //     form.remove(existingField);
                // }
                return;
            }

            // if existing field matches combo condition type it's fine
            if (existingField) {
                if (existingField.type === newValue) { // keep the field
                    return;
                } else { // remove the field
                    form.remove(existingField);
                }
            }
            me.setValueField(newValue);
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
                    validators: ['ipaddress']
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
                    validators: ['ipaddress']
                });
                return;
            }

            if (value === 'SET_PRIORITY') {
                if (!action) { rule.getAction().set('priority', null); }
                // if (!action) { rule.setAction(Ext.create('Mfw.model.table.Action', { type: value, priority: null })); }
                actionform.add({
                    xtype: 'numberfield',
                    itemId: 'actionValue',
                    name: 'priority',
                    label: 'Priority'.t(),
                    bind: '{rule.action.priority}',
                    required: true
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

        },




        setValueField: function (conditionType) {
            /**
             * !!! before setting the record on the form it is needed to
             * add the proper value field to the form based on condition type
             */
            var me = this, condition = Ext.Array.findBy(Util.conditions, function (c) { return c.type === conditionType; }),
                valueField, ops = [], form = me.getView().down('#conditionform');
            if (condition && condition.field) {
                // get the condition field
                valueField = condition.field;
            } else {
                // use a textfield as fallback
                valueField = { xtype: 'textfield' };
                console.warn(conditionType + ' condition definition missing!');
            }

            if (condition && condition.operators) {
                Ext.Object.each(condition.operators, function (key, op) {
                    ops.push(Util.ruleOperatorsMap[op]);
                });
            } else {
                ops = Util.ruleOperators;
            }
            form.down('#operation').setOptions(ops);

            // add exptra props to the value field
            Ext.apply(valueField, {
                type: conditionType, // use too identify the type of the value field
                itemId: 'valueField',
                name: 'value',
                label: 'Value',
                flex: 1,
                clearable: false,
                autoComplete: false,
                placeholder: 'Choose value ...'.t(),
                required: true,
                hidden: true,
                bind: {
                    hidden: '{!conditionType.value}'
                },
            });

            // insert value field into the form as the third field
            form.insert(2, valueField);
        },

        addCondition: function () {
            var me = this,
                vm = me.getViewModel(),
                rule = vm.get('rule'),
                form = me.getView().down('#conditionform');

            if (!form.validate()) { return; }
            rule.conditions().add(form.getValues());
            form.reset(true);
        },

        conditionRenderer: function (value, record) {
            var op, ruleCondition, valueRender;
            switch (record.get('op')) {
                case '==': op = '='; break;
                case '!=': op = '&ne;'; break;
                case '>': op = '&gt;'; break;
                case '<': op = '&lt;'; break;
                case '>=': op = '&ge;'; break;
                case '<=': op = '&le;'; break;
                default: op = '?'; break;
            }

            ruleCondition = Util.ruleConditionsMap[record.get('type')];
            valueRender = record.get('value');
            // todo different value render based on condition type
            if (ruleCondition.type === 'IP_PROTOCOL') {
                if (!Globals.protocolsMap[record.get('value')]) {
                    console.warn('Invalid IP Protocol defined as string, expected integer!');
                    return;
                }
                valueRender = Globals.protocolsMap[record.get('value')].text + ' <em style="color: #999; font-style: normal;">[' + valueRender + ']</em>';
            }

            return '<div class="condition"><span>' + ruleCondition.name + '</span> ' +
                    '<em style="font-weight: bold; font-style: normal; color: #000; padding: 3px;">' + op + '</em> <strong>' + valueRender + '</strong></div>';
        },


        onCancel: function () {
            var me = this,
                vm = me.getViewModel(),
                rule = vm.get('rule');

            // FIX reject conditions on cancel
            rule.reject(true);
            // rule.conditions().each(function (c) {
            //     console.log(c);
            // });
            rule.getAction().reject(true);
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
