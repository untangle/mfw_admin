Ext.define('Mfw.setup.step.Upgrades', {
    extend: 'Ext.Panel',
    alias: 'widget.step-upgrades',

    style: 'color: #555;',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    bodyPadding: 24,

    items: [{
        xtype: 'component',
        padding: '0 0 24 0',
        html: '<h1>Upgrades</h1><p>Automatic Upgrades and Command Center Access</p><br/><hr/>'
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
    }],

    controller: {
        continue: function (cb) {
            cb();
        }
    }

});
