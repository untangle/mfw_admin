Ext.define('Mfw.CommonUtil', {
    alternateClassName: 'CommonUtil',
    singleton: true,

    api: window.location.origin + '/api',
    // api: 'http://192.168.101.233/api',

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
         * 
         * @param caller - the calling component, ie: 'this'
         */
    readLicense: function (caller) {
        var me = caller,
            vm = me.getViewModel(),
            license = vm.get('license');

            console.log("VM License:");
            console.log(license);

        if(license) {
            return license;
        }

        console.log("Getting license...");

        Ext.Ajax.request({
            url: '/api/status/license',
            success: function (response) {
                console.log("license response:");
                console.log(response);
                var licenseData = Ext.decode(response.responseText),
                    license;

                // not licensed
                if (!licenseData || licenseData.list.length === 0) {
                    vm.set('license', null);
                    return null;
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

                // format throughput
                if (license.seats === 1000000) {
                    license.seatsReadable = 'Unlimited'
                } else {
                    license.seatsReadable = license.seats + ' Mbps'
                }

                vm.set('license', license);
                return license;

            },
            failure: function () {
                // if license.json not found (unable to read)
                vm.set('license', null);
                return null;
            }
        });
    },
});
