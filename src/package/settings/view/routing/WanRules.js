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
        defaultAction: 'WAN_POLICY',
        actions: ['WAN_POLICY', 'JUMP','GOTO','ACCEPT','RETURN','REJECT','DROP'],
        conditions: Util.getFilteredConditions('wan-routing'),
        hash: 'routing/wan-rules'
    },

    before: function(cb) {
        // load wan policies
        var policies = {};
        Ext.Ajax.request({
            url: Util.api + '/settings/wan/policies',
            success: function(response) {
                var resp = Ext.decode(response.responseText);
                Ext.Array.each(resp, function (policy) {
                    policies[policy.policyId] = policy.description;
                });
                Map.wanPolicies = policies;
                Map.options.wanPolicies = Map.toOptions(policies);
                cb();
            },
            failure: function(response) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    },

    // MFW 715 - update rules map after saving
    afterSave: function () {
        Ext.Ajax.request({
            url: Util.api + '/settings/wan/policy_chains',
            success: function(response) {
                var resp = Ext.decode(response.responseText);
                Map.wanRules = resp;
            },
            failure: function(response) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    }
});
