Ext.define('Mfw.setup.step.Welcome', {
    extend: 'Ext.Panel',
    alias: 'widget.step-welcome',

    style: 'color: #555;',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    bodyPadding: 24,

    items: [{
        xtype: 'component',
        padding: '100 0 24 0',
        style: 'text-align: center;',
        html: '<h1>Thanks for choosing Untangle!</h1>' +
            '<p style="font-size: 16px;">A wizard will guide you through the initial setup and configuration of the Server.</p>'
    }]
    // {
    //     xtype: 'container',
    //     layout: 'vbox',
    //     defaults: {
    //         xtype: 'radiofield',
    //         bodyAlign: 'start'
    //     },
    //     items: [{
    //         boxLabel: '<strong>Basic</strong>',
    //         name: 'mode',
    //         checked: true,
    //         margin: '0 16 0 0'
    //     }, {
    //         xtype: 'component',
    //         margin: '0 0 16 0',
    //         html: 'Basic setup is suited for ... more text to follow ....'
    //     }, {
    //         boxLabel: '<strong>Advanced</strong>',
    //         name: 'mode'
    //     }, {
    //         xtype: 'component',
    //         margin: '0 0 16 0',
    //         html: 'Choose Advanced mode if you know what you are doing and want to customize things from the start!'
    //     }]
    // }
    // ]

});
