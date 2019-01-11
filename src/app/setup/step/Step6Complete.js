Ext.define('Mfw.setup.step.Complete', {
    extend: 'Ext.Panel',
    alias: 'widget.step-complete',

    style: 'color: #555;',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    bodyPadding: 24,

    items: [{
        xtype: 'component',
        padding: '0 0 24 0',
        html: '<h1>The Untangle Server is now configured</h1><hr/>'
    }, {
        xtype: 'button',
        text: 'Go To Admin',
        handler: function () {
            window.location.href = '/admin';
        }
    }]

});
