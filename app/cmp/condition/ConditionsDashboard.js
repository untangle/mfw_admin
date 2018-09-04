Ext.define('Mfw.cmp.condition.Dashboard', {
    extend: 'Ext.Container',
    alias: 'widget.dashboard-conditions',

    controller: 'conditions',

    layout: 'hbox',

    viewModel: {
        formulas: {
            conditionsBtnTxt: function (get) {
                return get('dashboardConditions.fields').length;
            }
        }
    },

    items: [{
        xtype: 'button',
        iconCls: 'md-icon-filter-list',
        bind: { text: 'Conditions'.t() + ' ({conditionsBtnTxt})' },
        handler: 'showFieldsSheet',
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
        iconCls: 'md-icon-add-circle',
        handler: 'addCondition',
        plugins: 'responsive',
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
    }],

    listeners: {
        initialize: 'onInitializeDashboard'
    }
});
