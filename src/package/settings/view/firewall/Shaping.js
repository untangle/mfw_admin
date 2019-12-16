Ext.define('Mfw.settings.firewall.Shaping', {
    extend: 'Mfw.cmp.grid.table.Table',
    alias: 'widget.mfw-settings-firewall-shaping',

    title: 'Shaping'.t(),
    config: {
        api: {
            read: Util.api + '/settings/firewall/tables/shaping',
            update: Util.api + '/settings/firewall/tables/shaping'
        },
        defaultAction: 'SET_PRIORITY',
        actions: ['JUMP','GOTO','ACCEPT','RETURN','DROP','SET_PRIORITY'],
        hash: 'firewall/shaping'
    }
});
