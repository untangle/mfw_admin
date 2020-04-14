Ext.define('Mfw.store.Interfaces', {
    extend: 'Ext.data.Store',
    storeId: 'interfaces',
    alias: 'store.interfaces',
    model: 'Mfw.model.Interface',

    // important so interfaces are loaded at startup
    // autoLoad: true,

    trackRemoved: false, // important so no need to post dropped records
    autoSort: false, // important so store is not sorted on record add,

    listeners: {
        // refresh interfaces map on data change
        datachanged: function (store) {
            // initialize map with unset and local values
            var interfacesMap = {'0':'unset', '255':'local'};

            store.each(function (intf) {
                interfacesMap[intf.get('interfaceId')] = intf.get('name');
            });
            Map.interfaces = interfacesMap;
            Map.options.interfaces = Map.toOptions(interfacesMap);
        },

        load: function () {
            if (Mfw.app.context === 'admin') {
                this.setInterfacesNav();
            }
            this.getStatus();
        }
    },

    /**
     * adds interfaces to the main Settings navigation under "Interfaces"
     */
    setInterfacesNav: function () {
        var intfIcon, idx = 0,
            intfNode = Ext.getStore('settingsNav').findNode('href', 'network/interfaces');

        intfNode.removeAll();

        this.each(function (intf) {
            switch (intf.get('type')) {
                case 'NIC': intfIcon = 'fa-network-wired'; break;
                case 'WIFI': intfIcon = 'fa-wifi'; break;
                case 'OPENVPN':
                case 'WIREGUARD':
                case 'VLAN': intfIcon = 'fa-project-diagram'; break;
                default: intfIcon = 'fa-signal';
            }

            intfNode.insertChild(idx, {
                text: '<i class="x-fa ' + intfIcon + '" style="font-size: 13px;"></i> &nbsp; ' + intf.get('name'),
                key: intf.get('name'),
                href: 'network/interfaces/' + intf.get('name'),
                leaf: true,
            });
            idx += 1;
        });
    },


    /**
     * Get status for all interfaces/devices
     * @param {Function} cb - callback used when renewing IP address
     */
    getStatus: function (cb) {
        var store = this;
        Ext.Ajax.request({
            url: '/api/status/interfaces/all',
            success: function (response) {
                var status = Ext.decode(response.responseText);

                // match status response with each interface
                store.each(function (intf) {
                    var intfStatus = Ext.Array.findBy(status, function (s) {
                        return s.device === intf.get('device');
                    });
                    if (intfStatus) {
                        intf.set('_status', intfStatus);
                    }
                });
                if (cb) { cb(); }
            },
            failure: function () {
                console.error('Unable to get interfaces status!');
            }
        });
    }
});
