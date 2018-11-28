Ext.define('Mfw.common.conditions.Fields', {
    extend: 'Ext.Container',
    alias: 'widget.conditions-fields',

    controller: 'fields',

    layout: 'hbox',

    viewModel: {
        formulas: {
            conditionsBtnTxt: function (get) {
                return get('route.columns').length;
            }
        }
    },

    items: [{
        xtype: 'button',
        bind: { text: 'Conditions'.t() + ' ({conditionsBtnTxt})' },
        handler: 'showSheetGrid',
    }, {
        xtype: 'container',
        itemId: 'fieldsBtns',
        layout: 'hbox',
        defaults: {
            margin: '0 5'
        }
    }, {
        xtype: 'button',
        iconCls: 'md-icon-add',
        handler: 'addConditionFromToolbar'
    }]

    // listeners: {
    //     initialize: 'onInitialize'
    // }
});
