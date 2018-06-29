Ext.define('Mfw.cmp.condition.FieldDialog', {
    extend: 'Ext.Dialog',
    alternateClassName: 'FieldDialog',
    alias: 'widget.field-dialog',

    title: 'Field Condition',
    closable: true,
    closeAction: 'hide',
    draggable: false,
    // maskTapHandler: 'onCancel'
    layout: 'fit',

    alwaysOnTop: true,

    config: {
        field: null
    },

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
        defaults: {
            errorTarget: 'side'
        },
        items: [{
            xtype: 'combobox',
            name: 'column',
            label: 'Choose field'.t(),
            // placeholder: 'Choose field'.t(),
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
            // placeholder: 'Choose operator'.t(),
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
            // placeholder: 'Enter value'.t(),
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

    listeners: {
        show: 'onShow',
        hide: 'onHide'
    },

    controller: {
        onOk: function (btn) {
            var me = this, dialog = me.getView(),
                form = dialog.down('formpanel'),
                gvm = Ext.Viewport.getViewModel();

            if (!form.validate()) { return; }

            console.log(dialog.getViewModel().get('record'));

            if (!dialog.getViewModel().get('record')) {
                var fields = gvm.get('dashboardConditions.fields');
                fields.push(form.getValues());
            }
            Mfw.app.redirect('dashboard');
            dialog.hide();
        },

        onCancel: function (btn) {
            btn.up('dialog').hide();
        },

        onShow: function (dialog) {
            dialog.down('formpanel').setValues(dialog.getField());
            console.log(dialog.getField());
        },

        onHide: function (dialog) {
            // reset form on hide
            dialog.getViewModel().set('record', null);
            dialog.down('formpanel').reset(true);
        }
    }
});
