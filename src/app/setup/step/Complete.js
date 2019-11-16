Ext.define('Mfw.setup.step.Complete', {
    extend: 'Ext.Panel',
    alias: 'widget.step-complete',

    layout: 'center',

    padding: '0 0 100 0',

    items: [{
        xtype: 'container',

        layout: {
            type: 'vbox',
            align: 'middle'
        },

        items: [{
            xtype: 'component',
            // padding: '0 0 24 0',
            html: '<h1 style="text-align: center; font-size: 48px; font-weight: 100;">Complete!</h1>'
        }, {
            xtype: 'component',
            padding: '0 24',
            style: 'text-align: center;',
            html: '<h2 style="font-weight: 100;">The system is now configured!</h2>'
        }, {
            xtype: 'button',
            text: 'Go to Dashboard',
            ui: 'action',
            width: 200,
            height: '40',
            margin: '32 0 0 0',
            handler: function () {
    
                //Setup now runs as the 'setup' session user, log it out once setup is done, then login with admin user from store data
                Ext.Ajax.request({
                    url: '/account/logout',
                    success: function () {
                        window.location.href = '/admin#auth';
                    },
                    failure: function () {
                        window.location.href = '/admin#auth';
                     }
                 });
            }
        }]
    }],
    listeners: {
        activate: function () {
            // MFW-691 - clear interfaces filters only after showing this step
            Ext.getStore('interfaces').clearFilter();
        }
    }
});
