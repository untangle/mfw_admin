Ext.define('Mfw.setup.step.Upgrades', {
    extend: 'Ext.Panel',
    alias: 'widget.step-upgrades',

    style: 'color: #555;',

    layout: {
        type: 'vbox',
        align: 'middle'
    },

    items: [{
        xtype: 'container',
        width: 500,
        layout: {
            type: 'vbox'
        },
        items: [{
            xtype: 'component',
            padding: '0 32 24 32',
            html: '<h1 style="text-align: center;">Upgrades</h1><hr/><br/><p>Automatic Upgrades and Command Center Access</p>'
        }, {
            xtype: 'fieldcontainer',
            layout: 'vbox',
            margin: '0 32 16 32',
            items: [{
                xtype: 'checkbox',
                bodyAlign: 'start',
                checked: true,
                boxLabel: '<strong>Automatically Install Upgrades</strong>'
            }, {
                xtype: 'component',
                margin: '0 0 0 24',
                html: 'Automatically install new versions of the software when available.' + '<br/>' +
                    'This is the recommended choice for most sites.'
            }]
        }, {
            xtype: 'fieldcontainer',
            layout: 'vbox',
            margin: '0 32 16 32',
            items: [{
                xtype: 'checkbox',
                bodyAlign: 'start',
                checked: true,
                boxLabel: '<strong>Connect to Command Center</strong>'
            }, {
                xtype: 'component',
                margin: '0 0 0 24',
                html: 'Remain securely connected to the Command Center for cloud management, hot fixes, and support access.<br/>' +
                    'This is the recommended choice for most sites.'
            }]
        }]
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
        handler: 'onContinue',
        bind: { hidden: '{processing}' }
    }],

    controller: {
        onContinue: function (cb) {
            var me = this,
                wzCtrl = me.getView().up('setup-wizard').getController();

            me.getViewModel().set('processing', true);
            wzCtrl.update();
        }
    }

});
