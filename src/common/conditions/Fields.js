Ext.define('Mfw.common.conditions.Fields', {
    extend: 'Ext.Container',
    alias: 'widget.conditions-fields',

    controller: 'fields',

    layout: 'hbox',

    viewModel: {
        formulas: {
            conditionsCount: function (get) {
                return get('route.conditions').length;
            }
        }
    },

    items: [{
        xtype: 'button',
        bind: { text: 'Conditions'.t() + ' ({conditionsCount})' },
        handler: 'conditionsDialog',
    }, {
        xtype: 'container',
        itemId: 'fieldsBtns',
        layout: 'hbox',
        defaults: {
            margin: '0 5'
        }
    }, {
        xtype: 'button',
        ui: 'round',
        iconCls: 'md-icon-add',
        handler: 'addConditionFromToolbar'
    }]

    // listeners: {
    //     initialize: 'onInitialize'
    // }
});
