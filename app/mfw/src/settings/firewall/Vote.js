Ext.define('Mfw.settings.firewall.Vote', {
    extend: 'Mfw.cmp.grid.table.Table',
    alias: 'widget.mfw-settings-firewall-vote',

    title: 'Vote'.t(),
    config: {
        api: {
            read: Util.api + '/settings/firewall/tables/vote',
            update: Util.api + '/settings/firewall/tables/vote'
        },
        actions: ['JUMP','GOTO','ACCEPT','RETURN','WAN_DESTINATION']
    }
});
