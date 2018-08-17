Ext.define('Mfw.cmp.grid.RuleCondition', {
    extend: 'Ext.form.Panel',
    alias: 'widget.rule-condition',

    tbar: [{
        xtype: 'component',
        bind: {
            html: '{action === "add" ? "Add" : "Edit"} Rule Condition'.t(),
        }
    }, '->', {
        iconCls: 'x-fa fa-trash',
        handler: 'onDeleteCondition',
        hidden: true,
        bind: { hidden : '{action === "add"}'}
    }],

    padding: 16,

    layout: 'vbox',

    items: [{
        xtype: 'combobox',
        label: 'Choose condition'.t(),
        // placeholder: 'Choose field'.t(),
        editable: false,
        queryMode: 'local',
        required: true,
        forceSelection: true,
        displayField: 'name',
        valueField: 'value',
        store: 'ruleconditions',
        // store: {
        //     data: [
        //         { value: 'DST_ADDR', name: 'Destination Address'.t() },
        //         { value: 'DST_PORT', name: 'Destination Port'.t() },
        //         { value: 'SRC_ADDR', name: 'Source Address'.t(), editorType: 'textfield' },
        //         { value: 'SRC_PORT', name: 'Source Port'.t(), editorType: 'textfield' }
        //     ]
        // },
        bind: '{condition.conditionType}'
    }, {
        xtype: 'togglefield',
        bind: {
            value: '{condition.invert}',
            boxLabel: '{condition.invert ? "is not" : "is"}'
        }

    }, {
        xtype: 'textfield',
        label: 'Value'.t(),
        required: true,
        bind: '{condition.value}'
    }],
    bbar: ['->', {
        text: 'Cancel'.t(),
        handler: 'onConditionCancel'
    }, {
        bind: {
            text: '{action === "add" ? "Add" : "Update"}'.t(),
        },
        handler: 'onConditionDone'
    }]
});
