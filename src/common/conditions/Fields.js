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
        xtype: 'component',
        margin: '0 16',
        style: 'color: #FFF; font-size: 12px; font-weight: normal; line-height: 32px;',
        html: 'Conditions'
        // bind: { html: 'Conditions' + ' ({conditionsCount})' }
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
        handler: 'conditionsDialog'
    }]
});
