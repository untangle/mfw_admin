Ext.define('Mfw.common.conditions.Dialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.conditions-dialog',

    viewModel: {
        data: {
            visibleAdd: false
        }
    },

    config: {
        condition: null
    },

    bind: {
        title: '{action === "ADD" ? "Add" : "Edit"} <span style="color: #777;"></span> Condition',
    },
    width: 500,
    height: 280,

    bodyPadding: '0 16',

    showAnimation: {
        duration: 0
    },

    layout: 'fit',

    items: [{
        xtype: 'formpanel',
        padding: 0,
        items: [{
            xtype: 'selectfield',
            name: 'column',
            label: 'Select field'.t(),
            labelAlign: 'top',
            placeholder: 'Choose field'.t(),
            editable: false,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            forceSelection: true,
            options: Table.allColumns,
            required: true,
            listeners: {
                change: 'onColumnChange'
            }
        }, {
            xtype: 'containerfield',
            layout: 'hbox',
            defaults: {
                required: true
            },
            items: [{
                xtype: 'selectfield',
                name: 'operator',
                label: 'Operator'.t(),
                labelAlign: 'top',
                placeholder: 'Choose operator'.t(),
                width: 180,
                margin: '0 16 0 0',
                editable: false,
                displayTpl: '{text} [ {value} ]',
                itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
                value: 'EQ',
                options: Globals.operators
            }, {
                xtype: 'textfield',
                itemId: 'valueTextField',
                flex: 1,
                name: 'value',
                label: 'Value'.t(),
                labelAlign: 'top',
                placeholder: 'Enter value ...'
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
                text: '{action === "ADD" ? "Add" : "Update"}'
            },
            ui: 'action',
            handler: 'onSubmit'
        }]
    }],

    controller: {
        init: function (dialog) {
            var grid = dialog.ownerCmp,
                vm = dialog.getViewModel(),
                condition = vm.get('condition'),
                actionOptions = [];

            if (!condition) {
                // condition = {
                //     field: '',
                //     operator: '',
                //     value: ''
                // };
                // if subset of actions defined
                // Ext.Array.each(actions, function (action) {
                //     actionOptions.push(grid.actionsMap[action]);
                // });
                // dialog.down('#actionform').getFields('type').setOptions(actionOptions);
            }
            vm.set({
                action: !condition ? "ADD" : "EDIT"
            });
            console.log(vm);
        },

        onColumnChange: function (field, value) {
            var me = this, form = me.getView().down('formpanel'),
                customEditor = form.down('containerfield').getAt(2),
                // conditionIdx = me.sheet.getViewModel().get('conditionIdx'),
                column = Ext.Array.findBy(Table.sessions.columns, function (item) {
                    return item.dataIndex === value;
                });

            console.log(me.getViewModel().get('route.conditions'));

            if (!column) {
                console.warn('Column ' + value + ' not defined!');
                return;
            }

            // remove an existing custom column value field editor if exists
            if (customEditor) { form.down('containerfield').remove(customEditor); }

            // add custom column value field
            if (column.editor) {
                // hide default textfield
                form.down('#valueTextField').setName('').hide();
                // add custom field editor
                form.down('containerfield').add(column.editor);
            } else {
                // show default textfield
                form.down('#valueTextField').setName('value').show();
            }
        },

        onCancel: function () {
            var me = this;
            me.getView().destroy();
        },

        onSubmit: function () {
            var me = this,
                vm = me.getViewModel(),
                route = vm.get('route'),
                conditions = route.conditions,
                form = me.getView().down('formpanel');

            console.log(form.validate());

            if (!form.validate()) { return; }
            route.conditions.push(form.getValues());

            console.log(route);

            // route.conditions = conditions;

            // if (me.mainView.isXType('dashboard')) {
            //     Mfw.app.redirectTo(DashboardUtil.routeToQuery(route));
            // } else {
                Mfw.app.redirectTo(ReportsUtil.routeToQuery(route));
            // }

            // // add action
            // // rule.set('action', actionform.getValues());

            // // add rule
            // if (vm.get('action') === 'ADD') {
            //     grid.getStore().add(rule);
            // } else {
            //     rule.commit();
            // }
            me.getView().destroy();
        }
    }

});
