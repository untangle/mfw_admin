/**
 * This view covers the UI while upgrade process is pending
 * Usually the machine restarts and UI is refreshed when done
 */
Ext.define('Mfw.cmp.UpgradePending', {
    extend: 'Ext.Dialog',
    alias: 'widget.upgrade-pending',

    maximized: true,
    closable: false,

    layout: 'center',

    config: {
        /**
         * type is used to know which type of upgrade is performed
         * FILEUPLOAD - user uploads an upgrade image
         * MANUAL - user triggers the upgrade after the online upgrade availability check
         */
        type: 'FILEUPLOAD' // FILEUPLOAD or MANUAL
    },

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
        show: function (view) {
            if (view.getType() === 'MANUAL') {
                /**
                 * MANUAL trigger upgrade
                 * check for online availability only after the callbacks
                 *
                 * the upgrade will trigger system reboot and the call might hang
                 * the entire app will be refreshed when back online
                 */
                Ext.Ajax.request({
                    url: '/api/upgrade',
                    method: 'POST',
                    success: function() {
                        Ext.defer(Util.checkOnlineStatus, 3000);
                    },
                    failure: function () {
                        Ext.defer(Util.checkOnlineStatus, 3000);
                    }
                });
            } else {
                // FILEUPLOAD upgrade
                Ext.defer(Util.checkOnlineStatus, 3000);
            }
        }
    }

});
