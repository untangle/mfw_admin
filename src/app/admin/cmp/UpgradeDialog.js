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
            style: 'text-align: center;',
            html: '<h2 style="font-weight: 100; line-height: 1.5;">System is upgrading!<br/>Please wait ...</h2>' +
                  '<i class="fa fa-spinner fa-spin fa-2x fa-fw" style="margin-bottom: 200px;"></i>'
        }]
    }],

    listeners: {
        show: function () {
            var checkOnline = function () {
                Ext.Ajax.request({
                    url: '/account/status',
                    timeout: 5000,
                    success: function (result) {
                        // console.log('success', result);
                    },
                    failure: function (result) {
                        // recheck if address unreachable or internet disconnected
                        if (result.status === 0) {
                            Ext.defer(checkOnline, 3000);
                        }

                        // if back online but not logged in, go to login
                        if (result.status === 400) {
                            document.location.href = '/admin';
                        }
                    }
                });
            };
            Ext.defer(checkOnline, 3000);
        }
    }

});
