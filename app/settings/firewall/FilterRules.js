Ext.define('Mfw.settings.firewall.FilterRules', {
    extend: 'Mfw.cmp.grid.table.Table',
    // extend: 'Ext.grid.Grid',
    alias: 'widget.mfw-settings-firewall-filter-rules',
    title: 'Filter Rules'.t(),
    config: {
        api: {
            read: Util.api + '/settings/firewall/tables/filter-rules',
            update: Util.api + '/settings/firewall/tables/filter-rules'
        },
        actionsColumn: [{
            text: 'Action'.t(),
            dataIndex: 'action',
            menuDisabled: true,
            width: 150,
            renderer: function (action, record) {
                if (record.getAction()) {
                    return record.getAction().get('type');
                }
                return 'No Action...'
            }
        }]
    }
});
