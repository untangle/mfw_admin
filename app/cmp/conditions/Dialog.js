Ext.define('Mfw.cmp.conditions.Dialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.field-dialog',
    title: 'Condition'.t(),

    closable: true,
    closeAction: 'hide',
    draggable: false,
    maskTapHandler: 'onDialogCancel',
    layout: 'fit',
    alwaysOnTop: true, // important

    maximized: false,
    maximizeAnimation: null,

    bind: {
        maximized: '{smallScreen}'
    },

    // bodyPadding: '0 16',

    config: {
        addAction: false // if condition is added or edited
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
            errorTarget: 'side',
            margin: '20 0'
            // plugins: 'responsive',
            // responsiveConfig: { large: { margin: '20 0' }, small: { margin: 0 } }
        },
        items: [{
            xtype: 'combobox',
            name: 'column',
            // label: 'Choose field'.t(),
            placeholder: 'Choose field'.t(),
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
            // label: 'Choose operator'.t(),
            placeholder: 'Choose operator'.t(),
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
            // label: 'Enter value'.t(),
            placeholder: 'Enter value'.t(),
            autoComplete: false,
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
        ok: 'onDialogOk',
        cancel: 'onDialogCancel'
    }
});
