Ext.define('Mfw.cmp.grid.table.RuleSheet', {
    extend: 'Ext.ActionSheet',
    alias: 'widget.rulesheet',

    viewModel: {
        data: {
            ruleOperation: null,
            conditionOperation: null
        }
    },

    config: {
        rule: null
    },

    layout: {
        type: 'card',
        deferRender: false, // important so the validation works if card not yet visible
        animation: {
            duration: 150,
            type: 'slide',
            direction: 'horizontal'
        },
    },
    activeItem: 0,
    side: 'right',
    exit: 'right',

    width: 400,
    // hideOnMaskTap: false,
    padding: 0,

    items: [{
        xtype: 'panel',
        bind: {
            title: '{ruleOperation === "EDIT" ? "Edit Rule" : "New Rule"}'
        },
        scrollable: true,
        items: [{
            xtype: 'formpanel',
            itemId: 'ruleform',
            padding: 0,
            defaults: {
                margin: '8 16'
            },
            items: [{
                xtype: 'textareafield',
                name: 'description',
                label: 'Description'.t(),
                maxRows: 2,
                required: true
            }, {
                xtype: 'togglefield',
                name: 'enabled',
                boxLabel: 'Enabled'.t()
            }, {
                xtype: 'grid',
                userCls: 'c-noheaders',
                margin: '0 0 16 0',
                minHeight: 120,
                scrollable: false,
                emptyText: 'No Conditions!'.t(),
                selectable: {
                    columns: false,
                    rows: false
                },
                items: [{
                    xtype: 'toolbar',
                    docked: 'top',
                    padding: '0 8 0 16',
                    // shadow: false,
                    items: [{
                        xtype: 'component',
                        html: 'Conditions'.t()
                    }, '->', {
                        iconCls: 'md-icon-add',
                        text: 'New'.t(),
                        handler: 'onNewCondition'
                    }]
                }],
                columns: [{
                    dataIndex: 'type',
                    flex: 1,
                    cell: {
                        bodyStyle: {
                            padding: 0
                        },
                        encodeHtml: false
                    },
                    renderer: function (value, record) {
                        var op;
                        switch (record.get('op')) {
                            case '==': op = '='; break;
                            case '!=': op = '&ne;'; break;
                            case '>': op = '&gt;'; break;
                            case '<': op = '&lt;'; break;
                            case '>=': op = '&ge;'; break;
                            case '<=': op = '&le;'; break;
                            default: op = '?'; break;
                        }
                        return '<div class="condition"><span>' + Ext.getStore('ruleconditions').findRecord('type', record.get('type')).get('name') + '</span> ' +
                                '<em style="font-weight: bold; font-style: normal; color: #000; padding: 3px;">' + op + '</em> <strong>' + record.get('value') + '</strong></div>'
                    }
                }, {
                    width: 70,
                    align: 'center',
                    sortable: false,
                    hideable: false,
                    menuDisabled: true,
                    cell: {
                        tools: {
                            edit: {
                                iconCls: 'md-icon-edit',
                                handler: 'onEditCondition'
                            },
                            delete: {
                                iconCls: 'md-icon-delete',
                                handler: function (grid, info) {
                                    info.record.drop();
                                }
                            }
                        }
                    }
                }],
                listeners: {
                    childtap: 'onEditCondition'
                }
            }]
        }, {
            xtype: 'toolbar',
            margin: 0,
            // shadow: false,
            items: [{
                xtype: 'component',
                html: 'Action'.t()
            }]
        }, {
            xtype: 'formpanel',
            itemId: 'actionform',
            margin: 0
        }, {
            xtype: 'toolbar',
            docked: 'bottom',
            shadow: false,
            margin: 0,
            padding: '0 8',
            items: ['->', {
                text: 'Cancel'.t(),
                margin: '0 8',
                handler: 'onCancel'
            }, {
                bind: {
                    text: '{ruleOperation === "EDIT" ? "Update" : "Create"}'
                },
                ui: 'action',
                handler: 'onApplyRule'
            }]
        }]
    }, {
        xtype: 'formpanel',
        itemId: 'conditionform',
        padding: 0,
        bind: {
            title: '{conditionOperation === "EDIT" ? "Edit Condition" : "New Condition"}'
        },
        defaults: {
            margin: 16
        },
        items: [{
            xtype: 'combobox',
            name: 'type',
            label: 'Type'.t(),
            editable: false,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'type',
            store: 'ruleconditions',
            required: true,
            listeners: {
                change: 'onConditionTypeChange'
            }
        }, {
            xtype: 'selectfield',
            itemId: 'operation',
            name: 'op',
            label: 'Operation'.t(),
            editable: false,
            required: true,
            itemTpl: '<tpl>{text}{sign}</tpl>',
            value: '==',
            options: [
                { value: '==', text: 'Equals'.t(), sign: ' [ = ]' },
                { value: '!=', text: 'Not Equals'.t(), sign: ' [ &ne; ]' },
                { value: '>', text: 'Greater Than'.t(), sign: ' [ &gt; ]' },
                { value: '<', text: 'Less Than'.t(), sign: ' [ &lt; ]' },
                { value: '>=', text: 'Greater Than or Equal'.t(), sign:' [ &ge; ]' },
                { value: '<=', text: 'Less Than or Equal'.t(), sign: ' [ &le; ]' }
            ] // defined in Util.ops
        }, {
            xtype: 'toolbar',
            // docked: 'bottom',
            shadow: false,
            margin: '16 0',
            padding: '0 8',
            items: ['->', {
                text: 'Cancel'.t(),
                margin: '0 8',
                handler: 'onCancelCondition'
            }, {
                bind: {
                    text: '{conditionOperation === "EDIT" ? "Update" : "Create"}'
                },
                ui: 'action',
                handler: 'onApplyCondition'
            }]

        }],
        listeners: {
            // show: 'onShowCondition',
            hide: 'onHideCondition'
        }
    }],

    listeners: {
        initialize: 'onInitialize',
        show: 'onShow',
        hide: 'onHide'
    },

    controller: {
        onInitialize: function (sheet) {
            var me = this;
            me.ruleform = sheet.down('#ruleform');
            me.conditionform = sheet.down('#conditionform');
            me.conditionsgrid = me.ruleform.down('grid');
            me.actionform = sheet.down('#actionform');

            // add action fields
            me.actionform.add(sheet.table.getActionFields());

            // calculate conditions grid height based on number of conditions
            me.conditionsgrid.on('storechange', function (view, store) {
                if (!store) { return; }
                view.setHeight(store.count() * 42 + 48);
                store.on('datachanged', function () {
                    view.setHeight(store.count() * 42 + 48);
                });
            });
        },

        /**
         * Set the rule record on form
         */
        onShow: function (sheet) {
            var me = this, rule = sheet.getRule();

            me.ruleform.setRecord(rule);
            me.conditionsgrid.setStore(rule.conditions());

            me.actionform.setValues(rule.get('action'));
        },

        /**
         * Clean up forms and grids
         */
        onHide: function (sheet) {
            var me = this;
            sheet.setRule(null);

            me.conditionsgrid.getStore().rejectChanges();
            me.conditionsgrid.setStore({});

            me.ruleform.setRecord(null);
            me.ruleform.reset(true);

            me.conditionform.setRecord(null);
            me.conditionform.reset(true);

            me.actionform.reset(true);

            sheet.setActiveItem(0);
        },

        onCancel: function () {
            var me = this;
            me.getView().hide();
        },


        onEditCondition: function (grid, info) {
            var me = this, record = info.record;
            if (info.columnIndex === 1) { return; }
            me.getView().setActiveItem(1);
            me.getViewModel().set('conditionOperation', 'EDIT');
            me.setValueField(record.get('type'));
            // now set record on the form
            me.conditionform.setRecord(record);
        },

        onNewCondition: function () {
            var me = this,
                newCondition = new Mfw.model.table.Condition({
                    op: '=='
                });
            me.getView().setActiveItem(1);
            me.getViewModel().set('conditionOperation', 'NEW');
            me.conditionform.setRecord(newCondition);
            // me.getViewModel().set('record', null);
        },

        onConditionTypeChange: function (combo, newValue) {
            var me = this,
                existingField = me.conditionform.getFields('value', false);

            if (!newValue) { return; } // in some cases is an empty string, just skip

            // if existing field matches combo condition type it's fine
            if (existingField) {
                if (existingField.type === newValue) { // keep the field
                    return;
                } else { // remove the field
                    me.conditionform.remove(existingField);
                }
            }
            me.setValueField(newValue);
        },

        setValueField: function (conditionType) {
            /**
             * !!! before setting the record on the form it is needed to
             * add the proper value field to the form based on condition type
             */
            var me = this, condition = Ext.getStore('ruleconditions').findRecord('type', conditionType),
                valueField, ops = [];
            if (condition && condition.get('field')) {
                // get the condition field
                valueField = condition.get('field');
            } else {
                // use a textfield as fallback
                valueField = { xtype: 'textfield' }
                console.warn(conditionType + ' condition definition missing!')
            }

            if (condition && condition.get('operations')) {
                Ext.Object.each(condition.get('operations'), function (key, op) {
                    ops.push(Util.ops[op]);
                });
            } else {
                Ext.Object.each(Util.ops, function (key, op) {
                    ops.push(op);
                });
            }
            me.conditionform.down('#operation').setOptions(ops);

            // add exptra props to the value field
            Ext.apply(valueField, {
                type: conditionType, // use too identify the type of the value field
                itemId: 'valueField',
                name: 'value',
                label: 'Value'.t(),
                placeholder: 'Choose Value'.t(),
                required: true
            });

            // insert value field into the form as the third field
            me.conditionform.insert(2, valueField);
        },


        onApplyCondition: function () {
            var me = this, operation = me.getViewModel().get('conditionOperation');
            if (!me.conditionform.validate()) { return; }

            if (operation === 'NEW') {
                me.conditionsgrid.getStore().add(me.conditionform.getValues());
            } else {
                me.conditionform.getRecord().set(me.conditionform.getValues());
            }
            me.getView().setActiveItem(0);
        },

        onCancelCondition: function () {
            var me = this;
            me.getView().setActiveItem(0);
        },

        onHideCondition: function () {
            var me = this;
            if (!me.conditionform) { return; }
            me.conditionform.setRecord(null);
            me.conditionform.reset(true);
            if (me.conditionform.down('#valueField')) {
                me.conditionform.remove('valueField');
            }
        },

        onApplyRule: function () {
            var me = this, sheet = me.getView(), record,
                operation = me.getViewModel().get('ruleOperation');
            if (!me.ruleform.validate()) {
                return;
            }
            record = me.ruleform.getRecord();

            record.set(me.ruleform.getValues());
            record.set('action', me.actionform.getValues());
            record.commit();
            me.conditionsgrid.getStore().commitChanges();

            if (operation === 'NEW') {
                sheet.table.getStore().add(record);
            }

            sheet.hide();
        }
    }

});
