Ext.define('Mfw.setup.step.Account', {
    extend: 'Ext.Panel',
    alias: 'widget.step-account',

    style: 'color: #555;',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    bodyPadding: 24,

    items: [{
        xtype: 'component',
        padding: '0 0 24 0',
        html: '<h1>Admin Account</h1><br/><hr/>'
    }, {
        xtype: 'container',
        layout: 'vbox',
        items: [{
            xtype: 'component',
            html: '<p>Choose a password for the <strong>admin</strong> account</p>'
        }, {
            xtype: 'passwordfield',
            width: 300,
            // ui: 'solo',
            label: 'Password',
            labelAlign: 'left',
            labelTextAlign: 'right'
        }, {
            xtype: 'passwordfield',
            width: 300,
            // ui: 'solo',
            label: 'Confirm',
            labelAlign: 'left',
            labelTextAlign: 'right'
        }, {
            xtype: 'component',
            margin: '24 0 0 0',
            html: '<p>Administrators receive email alerts and report summaries.</p>'
        }, {
            xtype: 'emailfield',
            width: 300,
            // ui: 'solo',
            label: 'Email',
            labelAlign: 'left',
            labelTextAlign: 'right'
        }]
    }]

});
