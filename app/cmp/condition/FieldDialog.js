Ext.define('Mfw.cmp.condition.FieldDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.field-dialog',

    title: 'Field Condition',
    closable: true,
    closeAction: 'hide',
    draggable: false,
    // maskTapHandler: 'onCancel'
    layout: 'fit',

    viewModel: {
        data: {
            record: {
                column: '',
                operator: '',
                value: '',
                autoFormatValue: true
            }
        }
    },


    items: [{
        xtype: 'formpanel',
        padding: 0,
        items: [{
            xtype: 'combobox',
            name: 'column',
            label: 'Choose field'.t(),
            queryMode: 'local',
            required: true,
            forceSelection: true,
            displayField: 'name',
            valueField: 'field',
            store: Util.tmpColumns,
            bind: '{record.column}'
        }, {
            xtype: 'combobox',
            name: 'operator',
            label: 'Choose operator'.t(),
            queryMode: 'local',
            required: true,
            editable: false,
            displayField: 'name',
            valueField: 'value',
            store: Util.fieldOperators,
            bind: '{record.operator}'
        }, {
            xtype: 'textfield',
            name: 'value',
            label: 'Enter value'.t(),
            required: true,
            bind: '{record.value}'
        }, {
            xtype: 'checkbox',
            name: 'autoFormatValue',
            boxLabel: 'Auto Format Value',
            bind: '{record.autoFormatValue}'
        }]
    }],
    buttons: {
        ok: 'onOk',
        cancel: 'onCancel'
    },

    controller: {
        onOk: function (btn) {
            var me = this, form = me.getView().down('formpanel'),
                gvm = Ext.Viewport.getViewModel(), newQuery = '';
            if (!form.validate()) {
                return;
            }

            var fields = gvm.get('dashboardConditions.fields');
            // if (conditions.fields[])
            fields.push(form.getValues());

            Mfw.app.redirect('dashboard');

            me.getView().hide();
        },
        onCancel: function (btn) {
            btn.up('dialog').hide();
        }
    }
});
