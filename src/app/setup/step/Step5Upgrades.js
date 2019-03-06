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
            padding: '0 0 24 0',
            html: '<h1 style="text-align: center;">Upgrades</h1><hr/><p>Automatic Upgrades and Command Center Access</p>'
        }, {
            xtype: 'fieldcontainer',
            layout: 'vbox',
            margin: '0 0 16 0',
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
        }, {
            xtype: 'button',
            margin: '16 0 0 0',
            width: 150,
            text: 'Continue',
            ui: 'action',
            handler: 'onContinue'
        }]
    }],

    controller: {
        onContinue: function (cb) {
            var me = this,
                wizard = me.getView().up('#wizard'),
                layout = wizard.getLayout();

            layout.next();
        }
    }

});
