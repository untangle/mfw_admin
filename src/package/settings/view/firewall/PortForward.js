Ext.define('Mfw.settings.firewall.PortForward', {
    extend: 'Mfw.cmp.grid.table.Table',
    alias: 'widget.mfw-settings-firewall-port-forward',

    title: 'Port Forward'.t(),
    config: {
        api: {
            read: Util.api + '/settings/firewall/tables/port-forward',
            update: Util.api + '/settings/firewall/tables/port-forward'
        },
        hash: 'firewall/port-forward',
        defaultAction: 'DNAT',
        actions: ['JUMP','GOTO','ACCEPT','RETURN','DNAT'],
        conditions: Util.getFirstPacketConditions()
    }
});
