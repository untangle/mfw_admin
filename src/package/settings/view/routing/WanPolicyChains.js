Ext.define('Mfw.settings.routing.WanPolicyChains', {
    extend: 'Mfw.cmp.grid.table.Table',
    alias: 'widget.mfw-settings-routing-wan-policy-chains',

    title: 'WAN Policy Chains'.t(),
    config: {
        api: {
            read: Util.api + '/settings/wan/policy_chains',
            update: Util.api + '/settings/wan/policy_chains'
        },
        actions: ['JUMP','GOTO','ACCEPT','RETURN','REJECT','DROP']
    }
});
