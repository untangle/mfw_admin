Ext.define('Mfw.settings.firewall.Filter', {
    extend: 'Mfw.cmp.grid.table.Table',
    alias: 'widget.mfw-settings-firewall-filter',

    title: 'Filter'.t(),
    config: {
        api: {
            read: Util.api + '/settings/firewall/tables/filter',
            update: Util.api + '/settings/firewall/tables/filter'
        },
        actions: ['JUMP','GOTO','ACCEPT','RETURN','REJECT','DROP'],
        hash: 'settings/firewall/filter'
    }
});
