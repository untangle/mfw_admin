Ext.define('Mfw.settings.firewall.CaptivePortal', {
    extend: 'Mfw.cmp.grid.table.Table',
    alias: 'widget.mfw-settings-firewall-captive-portal',

    title: 'Captive Portal'.t(),
    config: {
        api: {
            read: Util.api + '/settings/firewall/tables/captive-portal',
            update: Util.api + '/settings/firewall/tables/captive-portal'
        },
        hash: 'firewall/captive-portal'
    }
});
