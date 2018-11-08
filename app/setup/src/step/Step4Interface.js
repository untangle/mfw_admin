Ext.define('Mfw.setup.step.Interface', {
    extend: 'Ext.Panel',
    alias: 'widget.step-interface',

    style: 'color: #555;',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    bodyPadding: 24,

    items: [{
        xtype: 'component',
        padding: '0 0 24 0',
        html: '<h1>External Interface</h1><br/><hr/>'
    }]

});
