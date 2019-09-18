Ext.define('Mfw.setup.step.Welcome', {
    extend: 'Ext.Panel',
    alias: 'widget.step-welcome',

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
            padding: '0 0 24 0',
            html: '<h1 style="text-align: center; font-size: 64px; font-weight: 100;">Welcome,</h1>'
        }, {
            xtype: 'component',
            padding: '0 24',
            style: 'text-align: center;',
            html: '<h1 style="font-size: 32px;">Thanks for choosing Untangle!</h1>' +
                '<p style="font-size: 16px; margin-top: 32px;">A wizard will guide you through the initial setup<br/>and configuration of the Server.</p>'
        }]
    }]
});
