Ext.define('Mfw.settings.routing.WanRules', {
    extend: 'Mfw.cmp.grid.table.Table',
    alias: 'widget.mfw-settings-routing-wan-rules',

    title: 'WAN Rules'.t(),
    ruleTitle: 'WAN', // used in rule dialog

    chainsOnly: true,

    config: {
        api: {
            read: Util.api + '/settings/wan/policy_chains',
            update: Util.api + '/settings/wan/policy_chains'
        },
        actions: ['WAN_POLICY', 'JUMP','GOTO','ACCEPT','RETURN','REJECT','DROP'],
        hash: 'settings/routing/wan-rules'
    },

    before: function(cb) {
        var me = this;
        // load wan policies
        var policies = [];
        Ext.Ajax.request({
            url: Util.api + '/settings/wan/policies',
            success: function(response) {
                var resp = Ext.decode(response.responseText);
                Ext.Array.each(resp, function (policy) {
                    policies.push({
                        text: policy.description,
                        value: policy.policyId
                    });
                });
                me.policies = policies;
                cb();
            },
            failure: function(response) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    }
});
