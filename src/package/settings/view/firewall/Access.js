Ext.define('Mfw.settings.firewall.Access', {
    extend: 'Mfw.cmp.grid.table.Table',
    alias: 'widget.mfw-settings-firewall-access',

    title: 'Access'.t(),
    config: {
        api: {
            read: Util.api + '/settings/firewall/tables/access',
            update: Util.api + '/settings/firewall/tables/access'
        },
        defaultAction: 'ACCEPT',
        actions: ['JUMP','GOTO','ACCEPT','RETURN','REJECT','DROP'],
        hash: 'firewall/access'
    }
});
