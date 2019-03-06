Ext.define('Mfw.setup.step.Complete', {
    extend: 'Ext.Panel',
    alias: 'widget.step-complete',

    style: 'color: #555;',

    layout: {
        type: 'vbox',
        align: 'middle'
    },

    items: [{
        xtype: 'component',
        width: 500,
        padding: '0 0 24 0',
        html: '<h1 style="text-align: center;">Done!</h1><hr/>'
    }, {
        xtype: 'container',
        padding: 0,

        layout: {
            type: 'vbox',
            align: 'middle'
        },

        items: [{
            xtype: 'component',
            padding: '0 24',
            style: 'text-align: center;',
            html: '<h2 style="font-weight: 100;">The Untangle Server is now configured!</h2>'
        }, {
            xtype: 'button',
            text: 'Go To Admin',
            ui: 'action',
            width: 200,
            margin: '16 0 0 0',
            handler: function () {
                window.location.href = '/admin';
            }
        }]
    }],
});
