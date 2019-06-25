Ext.define('Mfw.cmp.UpgradeDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.upgrade-dialog',

    maximized: true,
    closable: false,

    layout: 'center',

    items: [{
        xtype: 'container',
        layout: {
            type: 'vbox',
            align: 'center'
        },
        items: [{
            xtype: 'component',
            html: '<img src="/static/res/untangle-logo.png"/>'
        }, {
            xtype: 'component',
            style: 'text-align: center;',
            html: '<h2 style="font-weight: 100; line-height: 1.5;">System is upgrading!<br/>Please wait ...</h2>' +
                  '<i class="fa fa-spinner fa-spin fa-2x fa-fw" style="margin-bottom: 200px;"></i>'
        }]
    }]

});
