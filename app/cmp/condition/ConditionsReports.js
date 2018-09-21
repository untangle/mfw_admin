Ext.define('Mfw.cmp.condition.Reports', {
    extend: 'Ext.Container',
    alias: 'widget.reports-conditions',

    controller: 'conditions',

    layout: {
        type: 'hbox',
        align: 'center'
    },

    viewModel: {
        formulas: {
            conditionsBtnTxt: function (get) {
                return get('reportsConditions.fields').length;
            }
        }
    },

    items: [{
        xtype: 'button',
        bind: { text: 'Conditions'.t() + ' ({conditionsBtnTxt})' },
        handler: 'showFieldsSheet'
    }, {
        xtype: 'container',
        itemId: 'fieldsBtns',
        layout: 'hbox',
        defaults: {
            margin: '0 5'
        },
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
    }, {
        xtype: 'button',
        // ui: 'action',
        // text: 'Add'.t(),
        iconCls: 'x-fa fa-plus',
        handler: 'addCondition',
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
    }],

    listeners: {
        initialize: 'onInitializeReports'
    }
});
