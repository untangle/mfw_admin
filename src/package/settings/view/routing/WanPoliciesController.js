Ext.define('Mfw.settings.routing.WanPoliciesController', {
    extend: 'Mfw.cmp.grid.MasterGridController',
    alias: 'controller.mfw-settings-routing-wan-policies',


    onAddRecord: function () {
        var me = this;
        if (!me.wanPolicyDialog) {
            me.wanPolicyDialog = Ext.Viewport.add({
                xtype: 'wan-policy-dialog',
                ownerCmp: me.getView(),
            });
            me.wanPolicyDialog.on('destroy', function (dialog) {
                me.wanPolicyDialog = null;
            });
        }
        me.wanPolicyDialog.show();
    },

    onEditRecord: function (grid, info) {
        var me = this;
        if (!me.wanPolicyDialog) {
            me.wanPolicyDialog = Ext.Viewport.add({
                xtype: 'wan-policy-dialog',
                ownerCmp: me.getView(),
                policy: info.record
            });
            me.wanPolicyDialog.on('destroy', function (dialog) {
                me.wanPolicyDialog = null;
            });
        }
        me.wanPolicyDialog.show();
    }

});
