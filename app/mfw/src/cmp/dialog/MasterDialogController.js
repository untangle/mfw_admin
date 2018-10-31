/**
 * MasterDialog controller
 * Methods can be overridden by child controllers extending this
 */
Ext.define('Mfw.cmp.dialog.MasterDialogController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.masterdialog',

    onInitialize: function (g) {
        // var titleBar = g.getTitleBar();
        console.log(g.getHeader());
    },

    onOk: function (btn) {
        btn.up('dialog').hide();
    },

    onCancel: function (btn) {
        btn.up('dialog').hide();
    }

});
