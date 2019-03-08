Ext.define('Mfw.setup.step.Welcome', {
    extend: 'Ext.Panel',
    alias: 'widget.step-welcome',

    layout: {
        type: 'vbox',
        align: 'middle'
    },

    items: [{
        xtype: 'component',
        width: 500,
        // flex: 1,
        padding: '0 0 24 0',
        html: '<h1 style="text-align: center;">Welcome</h1><hr/>'
    }, {
        xtype: 'container',
        padding: '100 0 0 0',
        layout: {
            type: 'vbox',
            align: 'middle'
        },
        items: [{
            xtype: 'component',
            padding: '0 24',
            style: 'text-align: center;',
            html: '<h1 style="font-size: 32px;">Thanks for choosing Untangle!</h1>' +
                '<p style="font-size: 16px; margin-top: 32px;">A wizard will guide you through the initial setup<br/>and configuration of the Server.</p>'
        }, {
            xtype: 'component',
            margin: '32 0 0 0',
            html: '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>',
            hidden: true,
            bind: { hidden: '{!processing}' }
        }, {
            xtype: 'button',
            margin: '32 0 0 0',
            width: 120,
            text: 'Continue',
            ui: 'action',
            handler: 'continue',
            bind: { hidden: '{processing}' }
        }]
    }],

    controller: {
        continue: function () {
            var me = this,
                wzCtrl = me.getView().up('setup-wizard').getController();

            me.getViewModel().set('processing', true);
            wzCtrl.update();
        }
    }
});
