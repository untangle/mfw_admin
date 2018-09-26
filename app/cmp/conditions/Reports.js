Ext.define('Mfw.cmp.conditions.Reports', {
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
                return get('conditions.fields').length;
            }
        }
    },

    items: [{
        xtype: 'button',
        bind: { text: 'Conditions'.t() + ' ({conditionsBtnTxt})' },
        handler: 'showSheetGrid'
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
        iconCls: 'md-icon-add',
        handler: 'addConditionFromToolbar',
        view: 'reports',
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
    }],

    listeners: {
        initialize: 'onInitialize'
    }
});
