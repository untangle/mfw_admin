Ext.define('Mfw.setup.step.Complete', {
    extend: 'Ext.Panel',
    alias: 'widget.step-complete',

    layout: 'center',

    padding: '0 0 200 0',

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
                window.location.href = '/admin';
            }
        }]
    }],
});
