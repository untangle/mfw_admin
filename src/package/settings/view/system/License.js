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
            html: 'Not lincensed!',
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
                '<tr><td>Throughput: </td><td>{license.seats} Mbps</td></tr>' +
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
            html: '<a href="https://www.untangle.com/cmd/#account/subscriptions" target="_blank" style="font-weight: bold;">Manage License</a> <i class="x-fa fa-external-link-square-alt fa-green"></i>'
        }]
    }],

    controller: {
        init: function () {
            // read the license.json
            this.readLicense();
        },

        /**
         * reads the /etc/config/license.json
         * license should contain following
         * UID: "65f18ab6-120e-42eb-bcf0-1af9d4c5433f",
         * type: "Subscription",
         * end: 1572678000,
         * start: 1570913303,
         * seats: 50,
         * displayName: "SD-WAN Throughput",
         * key: "6b3cd781dead369b693d3adc6bb4bf95",
         * keyVersion: 1,
         * name: "untangle-node-throughput"
         */
        readLicense: function () {
            var me = this,
                vm = me.getViewModel();

            Ext.Ajax.request({
                url: '/api/status/license',
                success: function (response) {
                    var licenseData = Ext.decode(response.responseText),
                        license;

                    if (!licenseData) {
                        vm.set('license', null);
                        return;
                    }

                    // still not licensed
                    if (licenseData.list.length === 0) {
                        vm.set('license', null);
                        return;
                    }

                    // take the first license info from the list
                    license = licenseData.list[0];

                    // format start/end dates
                    if (license.start) {
                        license.start = Ext.Date.format(new Date(license.start * 1000), 'F j, Y');
                    } else {
                        license.start = '<em>not set</em>';
                    }

                    if (license.end) {
                        license.end = Ext.Date.format(new Date(license.end * 1000), 'F j, Y');
                    } else {
                        license.end = '<em>not set</em>';
                    }

                    vm.set('license', license);

                },
                failure: function () {
                    // if licese.json not found (unable to read)
                    vm.set('license', null);
                }
            });
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
                    me.readLicense();
                },
                failure: function(response) {
                    fetchingBox.hide();
                    console.log('Unable to refresh license ... ' + response.status);
                }
            });
        }
    }

});
