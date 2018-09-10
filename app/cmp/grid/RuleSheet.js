Ext.define('Mfw.cmp.grid.RuleSheet', {
    extend: 'Ext.ActionSheet',
    alias: 'widget.rulesheet',

    // controller: 'sheet-editor',

    // title: 'Edit Rule'.t(),

    // viewModel: {
    //     data: {
    //         record: null
    //     },
    //     formulas: {

    //     }
    // },

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

    // scrollable: 'y',
    // isViewportMenu: true,

    side: 'right',
    exit: 'right',

    width: 350,
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
            xtype: 'togglefield',
            name: 'enabled',
            boxLabel: 'Enabled'.t()
        }, {
            xtype: 'textareafield',
            name: 'description',
            label: 'Description'.t(),
            maxRows: 2,
            required: true
        }, {
            xtype: 'grid',
            userCls: 'c-noheaders',
            margin: '0 0 16 0',
            minHeight: 90,
            emptyText: 'No Conditions!'.t(),
            selectable: {
                columns: false,
                rows: false
            },
            items: [{
                xtype: 'toolbar',
                docked: 'top',
                padding: '0 8 0 16',
                shadow: false,
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
                    encodeHtml: false
                },
                renderer: function (value, record) {
                    var typeName = Ext.getStore('ruleconditions').findRecord('type', record.get('type')).get('name');
                    return '<strong>' + typeName + '</strong> ' + (record.get('op') === 'IS' ? ' = ' : ' &ne; ') + ' ' + record.get('value');
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
            shadow: false,
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
        }, {
            xtype: 'combobox',
            name: 'op',
            label: 'Operation'.t(),
            editable: false,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            store: [
                { name: 'IS', value: 'IS'},
                { name: 'IS NOT', value: 'IS_NOT'}
            ],
            required: true
        }, {
            xtype: 'textfield',
            name: 'value',
            label: 'Value'.t(),
            required: true
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
            show: 'onShowCondition',
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

        onHide: function (sheet) {
            var me = this;
            if (me.ruleform.getRecord()) {
                me.ruleform.setRecord(null);
            }
            me.ruleform.down('grid').setStore(null);
            me.ruleform.reset(true);
        },

        onCancel: function () {
            var me = this;
            me.getView().hide();
        },

        onEditCondition: function (grid, info) {
            var me = this;
            if (info.columnIndex === 1) { return; }
            me.getView().setActiveItem(me.conditionform);
            me.conditionform.setRecord(info.record);
            me.getViewModel().set('record', info.record);
        },

        onNewCondition: function () {
            var me = this;
            me.getView().setActiveItem(me.conditionform);
            me.getViewModel().set('record', null);
            // me.conditionform.setRecord(info.record);
        },

        onApplyCondition: function () {
            var me = this, data;
            if (!me.conditionform.validate()) {
                return;
            }

            if (!me.conditionform.getRecord()) {
                data = me.conditionform.getValues();
                console.log(data);
                me.ruleform.down('grid').getStore().add(data);
            } else {
                me.conditionform.getRecord().set(me.conditionform.getValues());
            }
            me.getView().setActiveItem(me.ruleform);
        },

        onBackToRule: function () {
            var me = this;
            me.getView().setActiveItem(me.ruleform);
        },

        onShowCondition: function () {

        },

        onHideCondition: function () {
            var me = this;
            if (me.conditionform) {
                me.conditionform.setRecord(null);
                me.conditionform.reset(true);
            }
        },


        onApplyRule: function () {
            var me = this, data, sheet = me.getView();
            if (!me.ruleform.validate()) {
                return;
            }

            if (!me.ruleform.getRecord()) {
                data = me.ruleform.getValues();
                console.log(data);
                sheet.grid.getStore().add(data);
                // me.ruleform.down('grid').getStore().add(data);
            } else {
                me.ruleform.getRecord().set(me.ruleform.getValues());
                me.ruleform.getRecord().commit();
            }
            me.getView().hide();
        }
    }

});
