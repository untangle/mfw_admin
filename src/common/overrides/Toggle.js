/**
 * Override Toggle field and set active/inactive
 * as well a specific active/inactive class
 */
Ext.define('Ext.override.field.Toggle', {
    override: 'Ext.field.Toggle',

    config: {
        activeBoxLabel: null,
        inactiveBoxLabel: null
    },

    updateValue: function(value, oldValue) {
        var me = this,
            active = me.getActiveBoxLabel(),
            inactive = me.getInactiveBoxLabel();

        me.setCls(value ? 'x-toggle-on' : 'x-toggle-off');

        if (active || inactive) {
            me.setBoxLabel(value ? active : inactive);
        }

        me.callParent([value, oldValue]);
    }
});
