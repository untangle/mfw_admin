Ext.define('Mfw.setup.step.Eula', {
    extend: 'Ext.Panel',
    alias: 'widget.step-eula',

    layout: {
        type: 'vbox',
        align: 'middle'
    },

    padding: '16 0 24 0',

    scrollable: true,

    items: [{
        xtype: 'container',
        width: 600,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'component',
            padding: '8 0',
            html: '<h1 style="text-align: center;">Untangle SD-WAN Router</h1><hr/>'
        }, {
            xtype: 'component',
            style: 'text-align: center;',
            html: '<p style="font-weight: bold;">To continue installing and using this software, you must agree to the terms of the software license agreement. Please review the whole license agreement by scrolling through to the end of the agreement.</p>'
        }, {
            xtype: 'component',
            itemId: 'eula',
            margin: '16 0',
            padding: '8 16',
            scrollable: true,
            maxHeight: 300,
            style: 'background: #FFF; border-radius: 3px; border: 1px #EEE solid;'

        }, {
            xtype: 'component',
            style: 'text-align: center;',
            html: '<p>After installation, this license is available at <a style="color: blue;" href="https://www.untangle.com/legal" target="_blank">https://www.untangle.com/legal</a></p>'
        }, {
            xtype: 'container',
            margin: '8 0',
            layout: {
                type: 'hbox',
                pack: 'middle'
            },
            defaults: {
                xtype: 'button',
                margin: 8
            },
            hidden: true,
            bind: {
                hidden: '{wizardStatus.completed || currentStepIndex > 1}'
            },
            items: [{
                text: 'Disagree',
                handler: 'onDisagree'
            }, {
                text: 'Agree',
                ui: 'action',
                handler: 'onContinue'
            }]
        }]
    }],

    controller: {
        init: function (view) {

            /**
             * initially it should fetch a remote eula if possible (not implemented)
             * otherwise load locally stored eula
             */
            Ext.Ajax.request({
                url: '/setup/eula.html',
                success: function (response) {
                    view.down('#eula').setHtml(response.responseText);
                },
                failure: function () {
                    console.error('EULA not found!');
                }
            });
        },

        onContinue: function () {
            this.getView().up('setup-wizard').getController().updateWizard();
        },

        // called from EULA step
        onDisagree: function () {
            Mfw.app.redirectTo('welcome');
        }

    }
});
