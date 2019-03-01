/**
 * Some override to avoid ExtJS throwing an unwanted exception in the console
 */
Ext.define('Ext.grid.plugin.CellEditing', {
    override: 'Ext.grid.plugin.CellEditing',

    getEditor: function(location) {
        if (!location.column) {
            return;
        }

        return this.callParent([location]);
    }
});
