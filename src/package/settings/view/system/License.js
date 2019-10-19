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
            bind: {
                html: '<table cellspacing=10>' +
                '<tr><td style="width: 60px;">Name: </td><td>{license.displayName}</td></tr>' +
                '<tr><td>Type: </td><td>{license.type}</td></tr>' +
                '<tr><td>Seats: </td><td>{license.seats} Kbps</td></tr>' +
                '<tr><td>Start: </td><td>{license.start}</td></tr>' +
                '<tr><td>End: </td><td>{license.end}</td></tr>' +
                '<tr><td>Key: </td><td>{license.key} (v{license.keyVersion})</td></tr>' +
                '</table>'
            }
        }, {
            xtype: 'button',
            width: 200,
            margin: '32 0 0 8',
            ui: 'action',
            text: 'Re-fetch License Info'
        }]
    }],

    controller: {
        init: function (view) {
            var vm = view.getViewModel();

            var license = {
                UID: "65f18ab6-120e-42eb-bcf0-1af9d4c5433f",
                type: "Subscription",
                end: 1572678000,
                start: 1570913303,
                seats: 50,
                displayName: "SD-WAN Throughput",
                key: "6b3cd781dead369b693d3adc6bb4bf95",
                keyVersion: 1,
                name: "untangle-node-throughput"
            };

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

            // Ext.Ajax.request({
            //     url: '/api/status/build',
            //     success: function (response) {
            //         vm.set('build', Ext.decode(response.responseText));

            //         // get UID
            //         Ext.Ajax.request({
            //             url: '/api/status/uid',
            //             success: function (response) {
            //                 vm.set('uid', response.responseText);
            //             },
            //             failure: function () {
            //                 console.warn('Unable to get uid!');
            //             }
            //         });
            //     },
            //     failure: function () {
            //         console.warn('Unable to get build!');
            //     }
            // });
        }
    }

});
