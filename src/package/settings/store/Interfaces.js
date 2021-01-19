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

            //Refresh network widgets
            //when the interfaces store changes, we want to query and active network-layout widgets
            //and have them reload their backing data, because the network layout widget is not directly
            //bound to the interfaces store, we have this special case. pass false to setInterfaces, because
            //we do not want the widget to be added back to the widgets pipe
            var netWidgets = Ext.ComponentQuery.query('widget.widget-network-layout');

            if(netWidgets && netWidgets.length > 0) {
                netWidgets.forEach(function(netWidget) {
                    netWidget.getController().setInterfaces(false);
                });
            }
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

            var intfIcon = CommonUtil.getInterfaceIcon(intf.get('type'), 20);


            intfNode.insertChild(idx, {
                text: intfIcon + '&nbsp;&nbsp;&nbsp;' + intf.get('name'),
                key: intf.get('interfaceId'),
                href: 'network/interfaces/' + intf.get('interfaceId'),
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
