Ext.define('Mfw.settings.firewall.Nat', {
    extend: 'Mfw.cmp.grid.table.Table',
    alias: 'widget.mfw-settings-firewall-nat',

    title: 'NAT'.t(),
    config: {
        api: {
            read: Util.api + '/settings/firewall/tables/nat',
            update: Util.api + '/settings/firewall/tables/nat'
        },
        defaultAction: 'MASQUERADE',
        actions: ['JUMP','GOTO','ACCEPT','RETURN','SNAT','MASQUERADE'],
        hash: 'firewall/nat',
        conditions: Util.getFilteredConditions('nat')
    }
});
