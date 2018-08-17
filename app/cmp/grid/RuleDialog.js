Ext.define('Mfw.cmp.grid.RuleDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.rule-dialog',
    // title: 'Rule'.t(),

    // closable: true,
    // closeAction: 'hide',
    draggable: false,
    // maskTapHandler: 'onDialogCancel',
    layout: 'fit',
    alwaysOnTop: true, // important

    showAnimation: null,
    hideAnimation: null,
    maximized: false,
    maximizeAnimation: null,

    width: 300,
    // minHeight: 600,

    viewModel: {
        data: {
            activeCard: 0,
            condition: null,
            action: null
        }
    },

    bind: {
        maximized: '{smallScreen}',
        minHeight: '{smallScreen ? null : 550}'
    },

    bodyPadding: '0',

    config: {
        addAction: false // if condition is added or edited
    },

    items: [{
        xtype: 'container',
        layout: {
            type: 'card',
            // deferRender: false, // important so the validation works if card not yet visible
            animation: {
                duration: 150,
                type: 'slide',
                direction: 'horizontal'
            },
        },
        bind: {
            activeItem: '{activeCard}'
        },
        scrollable: 'y',
        padding: 0,
        margin: 0,

        // defaults: {
        //     margin: '8 0'
        // },

        items: [{
            xtype: 'panel',
            layout: 'vbox',
            scrollable: true,
            bodyPadding: '0 0 20 0',
            tbar: [{
                xtype: 'component',
                html: 'Edit Rule'.t()
            }, '->', {
                xtype: 'togglefield',
                labelAlign: 'left',
                labelTextAlign: 'right',
                bind: {
                    value: '{record.enabled}',
                    label: '{record.enabled ? "Enabled" : "Disabled"}'
                }
            }],
            items: [{
                xtype: 'textfield',
                margin: 16,
                label: 'Description'.t(),
                // labelAlign: 'left',
                bind: '{record.description}'
            }, {
                xtype: 'toolbar',
                shadow: false,
                // padding: 0,
                items: [{
                    xtype: 'component',
                    html: 'Conditions'.t()
                }, '->', {
                    iconCls: 'x-fa fa-plus',
                    itemId: 'conditionAddBtn',
                    handler: 'onCondition'
                }]
            }, {
                xtype: 'list',
                margin: '0 5 16 5',
                reference: 'conditions',
                emptyText: 'No Conditions...',
                minHeight: 44,
                // itemTpl: '',
                itemTpl: new Ext.XTemplate('{[this.condName(values.conditionType)]} <span style="text-decoration: padding: 0 2px;"><tpl if="invert">IS NOT<tpl else>IS</tpl></span> <strong>{value}</strong>',  {
                    condName: function (conditionType) {
                        var r = Ext.getStore('ruleconditions').findRecord('value', conditionType);
                        return r.get('name');
                    }}),
                bind: {
                    store: {
                        data: '{record.conditions}'
                    }
                },
                onItemDisclosure: function () {},
                listeners: {
                    select: 'onCondition'
                }
            }, {
                xtype: 'toolbar',
                shadow: false,
                // padding: 0,
                items: [{
                    xtype: 'component',
                    html: 'Actions'.t()
                }]
            }, {
                xtype: 'textfield',
                margin: '0 16',
                required: true,
                label: 'New Destination'.t(),
                // labelAlign: 'left',
                // labelTextAlign: 'right',
                bind: '{record.newDestination}'
            }, {
                xtype: 'numberfield',
                margin: '0 16',
                required: true,
                label: 'New Port'.t(),
                // labelAlign: 'left',
                // labelTextAlign: 'right',
                bind: '{record.newPort}'
            }],
            bbar: ['->', {
                text: 'Cancel'.t(),
                handler: 'onDialogCancel'
            }, {
                text: 'OK'.t(),
                handler: 'onDialogOk'
            }]
            // buttons: {
            //     cancel: 'onDialogCancel',
            //     ok: 'onDialogOk'
            // }
        }, {
            xtype: 'rule-condition',
            itemId: 'condition'
        }],
    }],

    controller: {
        // onCondition: function () {
        //     var me = this;
        //     // me.getViewModel().set('activeCard', 1);
        //     me.getView().down('formpanel').setActiveItem(1);
        // },
        // onActiveItemChange: function (cmp, newcard, oldcard) {
        //     var me = this;
        //     me.getViewModel().set('activeCard', newcard.getItemId() === 'condition' ? 1 : 0);
        //     // this.getViewModel()
        // },

        onCondition: function (cmp, record) {
            // console.log(cmp);
            var me = this, vm = me.getViewModel();
            me.getView().down('container').setActiveItem(1);
            if (cmp.getItemId() === 'conditionAddBtn') {
                vm.set({
                    action: 'add',
                    condition: {
                        conditionType: '',
                        invert: false,
                        value: ''
                    }
                });
            } else {
                vm.set({
                    action: 'edit',
                    condition: record
                });
            }
        },


        onDeleteCondition: function () {
            var me = this,
            rec = me.lookup('conditions').getSelection();

            if (rec) {
                rec.drop();
            }
            me.getView().down('container').setActiveItem(0);
        },

        onDialogOk: function () {
            var me = this;
            // console.log(me.getViewModel().get('record'));
            me.getViewModel().get('record').set('conditions', Ext.Array.pluck(me.getView().down('list').getStore().getRange(), 'data'))
            me.getView().hide();
        },
        onDialogCancel: function () {
            var me = this;
            me.getView().hide();
        },


        onConditionCancel: function () {
            var me = this, rec = me.getViewModel().get('condition'), list = me.getView().down('list');

            if (rec && Ext.isFunction(rec.reject)) {
                rec.reject();
            }
            list.setSelection(null);
            me.getViewModel().set({
                condition: null,
                action: null
            })
            me.getView().down('container').setActiveItem(0);
        },


        onConditionDone: function (btn) {
            var me = this, vm = me.getViewModel(), list = me.getView().down('list');
            if (!btn.up('formpanel').validate()) {
                return;
            }

            if (vm.get('action') === 'add') {
                list.getStore().add(vm.get('condition'));
            }
            list.setSelection(null);
            vm.set({
                condition: null,
                action: null
            })
            // console.log(vm.get('conditions.selection'));
            me.getView().down('container').setActiveItem(0);
        },
    }

});
