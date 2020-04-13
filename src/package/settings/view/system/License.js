Ext.define('Mfw.settings.system.License', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-system-license',

    title: 'License Information'.t(),
    layout: 'fit',

    viewModel: {},

    items: [{
        xtype: 'container',
        style: 'font-size: 14px;',
        padding: 16,
        layout: 'vbox',
        items: [{
            xtype: 'component',
            style: 'color: red',
            html: 'Not licensed!',
            padding: 8,
            hidden: true,
            bind: {
                hidden: '{license}'
            }
        }, {
            xtype: 'component',
            hidden: true,
            bind: {
                hidden: '{!license}',
                html: '<table cellspacing=10>' +
                '<tr><td>Type: </td><td>{license.type}</td></tr>' +
                '<tr><td>Throughput: </td><td>{license.seatsReadable}</td></tr>' +
                '<tr><td>Start: </td><td>{license.start}</td></tr>' +
                '<tr><td>End: </td><td>{license.end}</td></tr>' +
                // '<tr><td>Key: </td><td>{license.key} (v{license.keyVersion})</td></tr>' +
                '</table>'
            }
        }, {
            xtype: 'button',
            width: 180,
            margin: '32 0 0 8',
            ui: 'action',
            iconCls: 'x-fa fa-sync',
            text: 'Refresh License',
            handler: 'refreshLicense'
        }, {
            xtype: 'component',
            margin: '32 0 0 8',
            html: '<a href="https://www.untangle.com/cmd/#account/subscriptions" target="_blank" style="font-weight: bold;">Manage License</a> ' +
                  '<i class="x-fa fa-external-link-square-alt fa-green"></i>'
        }]
    }],

    controller: {
        init: function () {
            // read the license.json
            CommonUtil.readLicense(this);
        },

        /**
         * calls script which queries the license server and refreshes the license.json
         */
        refreshLicense: function () {
            var me = this;

            var fetchingBox = Ext.create('Ext.MessageBox', {
                bodyStyle: 'font-size: 14px; color: #333;',
                message: '<p style="margin: 0; text-align: center;"><i class="fa fa-spinner fa-spin fa-fw"></i><br/><br/>Fetching license information ...</p>',
                width: 400,
                showAnimation: null,
                hideAnimation: null
            });

            fetchingBox.show();

            Ext.Ajax.request({
                url: '/api/fetch-licenses',
                method: 'POST',
                success: function () {
                    fetchingBox.hide();
                    CommonUtil.readLicense(me);
                },
                failure: function(response) {
                    fetchingBox.hide();
                    console.log('Unable to refresh license ... ' + response.status);
                }
            });
        }
    }

});
