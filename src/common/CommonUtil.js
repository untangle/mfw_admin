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

        if(license) {
            return license;
        }


        Ext.Ajax.request({
            url: '/api/status/license',
            success: function (response) {
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

    /**
     * showReauthRequired will display an expired session message box and reload the page when accepted
     *
     * @param {*} caller
     */
    showReauthRequired: function(caller) {
        // avoid displaying the exception bottom sheet
        caller.sheet.hide();

        /**
         * display auth fail message box
         * prevent showing more than a single dialog in case of multiple calls exceptions
         */
        if (!caller.authExceptionDialog) {
           caller.authExceptionDialog = Ext.create('Ext.MessageBox', {
                title: 'Authentication failed',
                message: 'Session has expired. Please login.',
                width: 300,
                showAnimation: null,
                hideAnimation: null,
                buttons: [{
                    text: 'OK',
                    ui: 'action',
                    handler: function () {
                        // reloading document will redirect to auth
                        document.location.reload();
                    }
                }]
            }).show();
            caller.authExceptionDialog.show();
        }
   },

   /**
     *
     * getNiceInterfaceTypeName will parse the type and return something better for displaying on UI elements (ie: "OpenVPN" vs "OPENVPN")
     *
     * @param {string} type - the type we want to get a better display of
     */
    getNiceInterfaceTypeName: function(type) {

        switch(type) {
            case "OPENVPN":
                return "OpenVPN";
            case "WIREGUARD":
                return "WireGuard VPN";;
            default:
                return type;
        }
    },

    /**
     *
     * getInterfaceIcon will return an interface icon based on the type passed as input
     *
     *
     * @param {string} type - the interface type to get the icon for
     * @param {int} height - the height of the image (width autoscaled)
     */
    getInterfaceIcon: function(type, height) {

        var icon;

        switch (type) {
            // access-point-network Material Design Icon: https://dev.materialdesignicons.com/icon/access-point-network
            case 'WIFI': icon = '<svg xmlns="http://www.w3.org/2000/svg" height='+height+' style="vertical-align:middle;display=inline-block;" viewBox="0 0 24 24"><path d="M4.93,3.93C3.12,5.74 2,8.24 2,11C2,13.76 3.12,16.26 4.93,18.07L6.34,16.66C4.89,15.22 4,13.22 4,11C4,8.79 4.89,6.78 6.34,5.34L4.93,3.93M19.07,3.93L17.66,5.34C19.11,6.78 20,8.79 20,11C20,13.22 19.11,15.22 17.66,16.66L19.07,18.07C20.88,16.26 22,13.76 22,11C22,8.24 20.88,5.74 19.07,3.93M7.76,6.76C6.67,7.85 6,9.35 6,11C6,12.65 6.67,14.15 7.76,15.24L9.17,13.83C8.45,13.11 8,12.11 8,11C8,9.89 8.45,8.89 9.17,8.17L7.76,6.76M16.24,6.76L14.83,8.17C15.55,8.89 16,9.89 16,11C16,12.11 15.55,13.11 14.83,13.83L16.24,15.24C17.33,14.15 18,12.65 18,11C18,9.35 17.33,7.85 16.24,6.76M12,9A2,2 0 0,0 10,11A2,2 0 0,0 12,13A2,2 0 0,0 14,11A2,2 0 0,0 12,9M11,15V19H10A1,1 0 0,0 9,20H2V22H9A1,1 0 0,0 10,23H14A1,1 0 0,0 15,22H22V20H15A1,1 0 0,0 14,19H13V15H11Z" /></svg>'; break;
            // signal Material Design Icon: https://dev.materialdesignicons.com/icon/signal
            case 'WWAN': icon = '<svg xmlns="http://www.w3.org/2000/svg" height='+height+' style="vertical-align:middle;display=inline-block;" viewBox="0 0 24 24"><path d="M3,21H6V18H3M8,21H11V14H8M13,21H16V9H13M18,21H21V3H18V21Z" /></svg>'; break;
            // wan Material Design Icon: https://dev.materialdesignicons.com/icon/wan
            case 'OPENVPN':
            case 'WIREGUARD': icon = '<svg xmlns="http://www.w3.org/2000/svg" height='+height+'  style="vertical-align:middle;display=inline-block;" viewBox="0 0 24 24"><path d="M12,2A8,8 0 0,0 4,10C4,14.03 7,17.42 11,17.93V19H10A1,1 0 0,0 9,20H2V22H9A1,1 0 0,0 10,23H14A1,1 0 0,0 15,22H22V20H15A1,1 0 0,0 14,19H13V17.93C17,17.43 20,14.03 20,10A8,8 0 0,0 12,2M12,4C12,4 12.74,5.28 13.26,7H10.74C11.26,5.28 12,4 12,4M9.77,4.43C9.5,4.93 9.09,5.84 8.74,7H6.81C7.5,5.84 8.5,4.93 9.77,4.43M14.23,4.44C15.5,4.94 16.5,5.84 17.19,7H15.26C14.91,5.84 14.5,4.93 14.23,4.44M6.09,9H8.32C8.28,9.33 8.25,9.66 8.25,10C8.25,10.34 8.28,10.67 8.32,11H6.09C6.03,10.67 6,10.34 6,10C6,9.66 6.03,9.33 6.09,9M10.32,9H13.68C13.72,9.33 13.75,9.66 13.75,10C13.75,10.34 13.72,10.67 13.68,11H10.32C10.28,10.67 10.25,10.34 10.25,10C10.25,9.66 10.28,9.33 10.32,9M15.68,9H17.91C17.97,9.33 18,9.66 18,10C18,10.34 17.97,10.67 17.91,11H15.68C15.72,10.67 15.75,10.34 15.75,10C15.75,9.66 15.72,9.33 15.68,9M6.81,13H8.74C9.09,14.16 9.5,15.07 9.77,15.56C8.5,15.06 7.5,14.16 6.81,13M10.74,13H13.26C12.74,14.72 12,16 12,16C12,16 11.26,14.72 10.74,13M15.26,13H17.19C16.5,14.16 15.5,15.07 14.23,15.57C14.5,15.07 14.91,14.16 15.26,13Z" /></svg>'; break;
            // lan Material Design Icon: https://dev.materialdesignicons.com/icon/lan
            case 'VLAN': icon = '<svg xmlns="http://www.w3.org/2000/svg" height='+height+' style="vertical-align:middle;display=inline-block;" viewBox="0 0 24 24"><path d="M10,2C8.89,2 8,2.89 8,4V7C8,8.11 8.89,9 10,9H11V11H2V13H6V15H5C3.89,15 3,15.89 3,17V20C3,21.11 3.89,22 5,22H9C10.11,22 11,21.11 11,20V17C11,15.89 10.11,15 9,15H8V13H16V15H15C13.89,15 13,15.89 13,17V20C13,21.11 13.89,22 15,22H19C20.11,22 21,21.11 21,20V17C21,15.89 20.11,15 19,15H18V13H22V11H13V9H14C15.11,9 16,8.11 16,7V4C16,2.89 15.11,2 14,2H10M10,4H14V7H10V4M5,17H9V20H5V17M15,17H19V20H15V17Z" /></svg>'; break;
            // network-outline Material Design Icon: https://dev.materialdesignicons.com/icon/network-outline
            default: icon = '<svg xmlns="http://www.w3.org/2000/svg" height='+height+' style="vertical-align:middle;display=inline-block;" viewBox="0 0 24 24"><path d="M15,20A1,1 0 0,0 14,19H13V17H17A2,2 0 0,0 19,15V5A2,2 0 0,0 17,3H7A2,2 0 0,0 5,5V15A2,2 0 0,0 7,17H11V19H10A1,1 0 0,0 9,20H2V22H9A1,1 0 0,0 10,23H14A1,1 0 0,0 15,22H22V20H15M7,15V5H17V15H7Z" /></svg>';
        }

        return icon;
    },

    /**
     * Check if the field value matches the IPV4 static
     * or alias addresses of any existing interfaces
     *
     * field - the address field to check
     * currentIntf - the current interface object
     *
     * return - true if no duplicate, otherwise
     *          return an error string
     */
    checkV4Dups: function (field, currentIntf) {
        var Err = null,
            val = field.getValue();

        /**
         * Check other nic/vlan/wifi interfaces with static
         * ipv4 addresses and/or v4aliases to make sure the
         * input value is not already in use
         *
         * Check the interfaceId to ensure we aren't checking
         * against the current interface.  Also, ensure the
         * interfaces we are checking against are currently
         * enabled and addressed, so we don't validate against
         * disabled interfaces or interfaces that have been
         * switched to bridged
         */
        Ext.getStore('interfaces').each(function (intf) {
            var type = intf.get('type');
            if(intf.get('enabled') &&
               intf.get('interfaceId') != currentIntf.get('interfaceId') &&
               (type == 'NIC' || type == 'VLAN' || type == 'WIFI') &&
               intf.get('configType') == 'ADDRESSED') {

                if(intf.get('v4ConfigType') == 'STATIC' && intf.get('v4StaticAddress') == val) {
                    Err = 'This address is already used by ' + intf.get('name')
                    return false;
                }

                intf.v6Aliases().each(function (alias) {
                    if(alias.get('v4Address') == val) {
                        Err = 'This address is already used by ' + intf.get('name')
                        return false;
                    }
                });
            }
        });

        if(Err) {
            return Err;
        }

        return true;
    },

    /**
     * Check if the field value matches the IPV6 static
     * or alias addresses of any existing interfaces
     *
     * field - the address field to check
     * currentIntf - the current interface object
     *
     * return - true if no duplicate, otherwise
     *          return an error string
     */
    checkV6Dups: function (field, currentIntf) {
        var Err = null,
            val = field.getValue();

        /**
         * Check other nic/vlan/wifi interfaces with static
         * ipv6 addresses and/or v6aliases to make sure the
         * input value is not already in use
         *
         * Check the interfaceId to ensure we aren't checking
         * against the current interface.  Also, ensure the
         * interfaces we are checking against are currently
         * enabled and addressed, so we don't validate against
         * disabled interfaces or interfaces that have been
         * switched to bridged
         */
        Ext.getStore('interfaces').each(function (intf) {
            var type = intf.get('type');
            if(intf.get('enabled') &&
               intf.get('interfaceId') != currentIntf.get('interfaceId') &&
               (type == 'NIC' || type == 'VLAN' || type == 'WIFI') &&
               intf.get('configType') == 'ADDRESSED') {

                if(intf.get('v6ConfigType') == 'STATIC' && intf.get('v6StaticAddress') == val) {
                    Err = 'This address is already used by ' + intf.get('name')
                    return false;
                }

                intf.v6Aliases().each(function (alias) {
                    if(alias.get('v6Address') == val) {
                        Err = 'This address is already used by ' + intf.get('name')
                        return false;
                    }
                });
            }
        });

        if(Err) {
            return Err;
        }

        return true;
    },

});
