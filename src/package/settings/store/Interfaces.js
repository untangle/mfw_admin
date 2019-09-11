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
            var interfacesMap = {};

            store.each(function (intf) {
                interfacesMap[intf.get('interfaceId')] = intf.get('name');
            });
            Map.interfaces = interfacesMap;
            Map.options.interfaces = Map.toOptions(interfacesMap);

            if (Mfw.app.context === 'admin') {
                this.setInterfacesNav();
            }

        },

        load: function () {
            if (Mfw.app.context === 'admin') {
                this.setInterfacesNav();
            }
        }
    },

    /**
     * adds interfaces to the main Settings navigation under "Interfaces"
     */
    setInterfacesNav: function () {
        var modRecs = this.getModifiedRecords(),
            newRecs = this.getNewRecords(),
            remRecs = this.getRemovedRecords(),
            intfIcon = 'fa-signal', idx = 0,
            intfNode = Ext.getStore('settingsNav').findNode('href', 'network/interfaces');

        if (!intfNode.hasChildNodes()) {
            this.each(function (intf) {
                switch (intf.get('type')) {
                    case 'NIC': intfIcon = 'fa-network-wired'; break;
                    case 'WIFI': intfIcon = 'fa-wifi'; break;
                    case 'OPENVPN':
                    case 'VLAN': intfIcon = 'fa-project-diagram'; break;
                    default:
                }

                intfNode.insertChild(idx, {
                    text: '<i class="x-fa ' + intfIcon + '" style="font-size: 13px;"></i> &nbsp; ' + intf.get('name'),
                    href: 'network/interfaces/' + intf.get('name'),
                    leaf: true,
                });
                idx += 1;
            });
            return;
        }

        // console.log(modRecs);

        // if (modRecs.length > 0) {
        //     Ext.Array.each(modRecs, function (intf) {
        //         console.log(intf.modified, intf.isModified('name'));
        //         if (intf.isModified('name')) {
        //             var node = Ext.getStore('settingsNav').findNode('href', 'network/interfaces/' + intf.modified.name);
        //             console.log(node);
        //             console.log(intf.modified.name);
        //             node.set('text', intf.get('name'));
        //         }

        //     });
        // }

        // if (newRec.length > 0)
        // if (newRec.length > 0 || intfNode.hasChildNodes) {
        //     intfNode.removeAll();
        // }



    }
});
