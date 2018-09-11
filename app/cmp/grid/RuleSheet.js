Ext.define('Mfw.cmp.grid.RuleSheet', {
    extend: 'Ext.ActionSheet',
    alias: 'widget.rulesheet',

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
        xtype: 'formpanel',
        itemId: 'ruleform',
        title: 'Edit Rule'.t(),
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
                    if (record.get('op') === "IS") {
                        op = ' &nbsp;<i class="x-fa fa-hand-o-right" style="font-weight: normal;"></i>&nbsp; '
                    } else {
                        op = ' &nbsp;<i class="x-fa fa-hand-stop-o" style="color: red; font-weight: normal;"></i>&nbsp; '
                    }
                    return '<div class="condition"><span class="eee">' + Ext.getStore('ruleconditions').findRecord('type', record.get('type')).get('name') + '</span>' +
                            op + '<strong>' + record.get('value') + '</strong></div>'
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
        }, {
            xtype: 'toolbar',
            margin: 0,
            // shadow: false,
            items: [{
                xtype: 'component',
                html: 'Action'.t()
            }]
        }, {
            xtype: 'combobox',
            label: 'Choose Action'.t(),
            labelAlign: 'left',
            editable: false,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            store: [
                { value: 'JUMP', name: 'Jump ...' },
                { value: 'GOTO', name: 'Go To ...' },
                { value: 'REJECT', name: 'Reject' },
                { value: 'ACCEPT', name: 'Accept' }
            ]
        }, {
            xtype: 'combobox',
            label: 'Choose Chain'.t(),
            labelAlign: 'left'
        }, {
            xtype: 'toolbar',
            docked: 'bottom',
            shadow: false,
            margin: 0,
            padding: '0 8',
            items: ['->', {
                text: 'Cancel',
                margin: '0 8',
                handler: 'onCancel'
            }, {
                text: 'Update',
                ui: 'action',
                handler: 'onApplyRule'
            }]
        }]
    }, {
        xtype: 'formpanel',
        itemId: 'conditionform',
        bind: {
            title: '{record ? "Edit Condition" : "New Condition"}'
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
            xtype: 'fieldcontainer',
            margin: '16 0 0 0',
            defaults: {
                xtype: 'radiofield',
                name: 'op'
            },
            items: [{
                boxLabel: '<i class="x-fa fa-hand-o-right fa-lg"></i> ' + 'Is'.t(),
                value: 'IS',
                checked: true,
                margin: '0 16 0 0'
            }, {
                boxLabel: '<i class="x-fa fa-hand-stop-o fa-lg" style="color: red;"></i> ' + 'Is Not'.t(),
                value: 'IS_NOT'
            }]
            // xtype: 'combobox',
            // name: 'op',
            // label: 'Operation'.t(),
            // editable: false,
            // queryMode: 'local',
            // displayField: 'name',
            // valueField: 'value',
            // value: 'IS',
            // store: [
            //     { name: 'IS', value: 'IS'},
            //     { name: 'IS NOT', value: 'IS_NOT'}
            // ],
            // required: true
        }, {
            xtype: 'toolbar',
            docked: 'bottom',
            shadow: false,
            margin: 0,
            padding: '0 8',
            items: [{
                text: 'Back to rule'.t(),
                iconCls: 'md-icon-arrow-back',
                handler: 'onBackToRule'
            }, '->', {
                bind: {
                    text: '{record ? "Update" : "Create"}'
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
        hide: 'onHide'
    },

    controller: {
        onInitialize: function (sheet) {
            var me = this;
            me.ruleform = sheet.down('#ruleform');
            me.conditionform = sheet.down('#conditionform');

            me.ruleform.down('grid').on('storechange', function (view, store) {
                if (!store) { return; }
                view.setHeight(store.count() * 42 + 48);
                store.on('datachanged', function () {
                    view.setHeight(store.count() * 42 + 48);
                });
            });
        },

        /**
         * resets forms and grids
         */
        onHide: function () {
            var me = this;
            if (me.ruleform.getRecord()) {
                me.ruleform.setRecord(null);
            }
            me.ruleform.down('grid').getStore().rejectChanges();
            me.ruleform.down('grid').setStore({});
            me.ruleform.reset(true);

            if (me.conditionform.getRecord()) {
                me.conditionform.setRecord(null);
            }
            me.conditionform.reset(true);
            me.getView().setActiveItem(me.ruleform);
        },

        onCancel: function () {
            var me = this;
            me.getView().hide();
        },

        onEditCondition: function (grid, info) {
            var me = this;
            if (info.columnIndex === 1) { return; }
            me.getView().setActiveItem(me.conditionform);
            me.getViewModel().set('record', info.record); // ???
            me.setValueField(info.record.get('type'));
            // now set record on the form
            me.conditionform.setRecord(info.record);
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
                valueField;
            if (condition && condition.get('field')) {
                // get the condition field
                valueField = condition.get('field');
            } else {
                // use a textfield as fallback
                valueField = { xtype: 'textfield' }
                console.warn(conditionType + ' condition definition missing!')
            }

            // add exptra props to the value field
            Ext.apply(valueField, {
                type: conditionType, // use too identify the type of the value field
                name: 'value',
                label: 'Value'.t(),
                placeholder: 'Choose Value'.t(),
                required: true
            });

            // insert value field into the form as the third field
            me.conditionform.insert(2, valueField);
        },

        onNewCondition: function () {
            var me = this;
            me.getView().setActiveItem(me.conditionform);
            me.getViewModel().set('record', null);
        },

        onApplyCondition: function () {
            var me = this;
            if (!me.conditionform.validate()) { return; }

            if (!me.conditionform.getRecord()) {
                me.ruleform.down('grid').getStore().add(me.conditionform.getValues());
            } else {
                me.conditionform.getRecord().set(me.conditionform.getValues());
            }
            me.getView().setActiveItem(me.ruleform);
        },

        onBackToRule: function () {
            var me = this;
            if (me.conditionform.getRecord()) {
                me.conditionform.setRecord(null);
            }
            me.conditionform.reset(true);
            me.getView().setActiveItem(me.ruleform);
        },

        onHideCondition: function () {
            var me = this;
            if (me.conditionform) {
                me.conditionform.setRecord(null);
                me.conditionform.reset(true);
                me.conditionform.removeAt(2); // remove value field
            }
        },

        onApplyRule: function () {
            var me = this, sheet = me.getView(), record;
            if (!me.ruleform.validate()) {
                return;
            }
            record = me.ruleform.getRecord();

            if (record.phantom) {
                console.log(me.ruleform.getRecord());
                record.set(me.ruleform.getValues());
                record.commit();
                me.ruleform.down('grid').getStore().commitChanges();
                sheet.grid.getStore().add(record);
            } else {
                record.set(me.ruleform.getValues());
                record.commit(); // commit record
                me.ruleform.down('grid').getStore().commitChanges(); // commit store
            }
            me.getView().hide();
        }
    }

});
