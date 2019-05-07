Ext.define('Mfw.settings.firewall.WebFilter', {
    extend: 'Mfw.cmp.grid.table.Table',
    alias: 'widget.mfw-settings-firewall-web-filter',

    title: 'Web Filter'.t(),
    config: {
        api: {
            read: Util.api + '/settings/firewall/tables/web-filter',
            update: Util.api + '/settings/firewall/tables/web-filter'
        },
        hash: 'settings/firewall/web-filter'
    }
});
