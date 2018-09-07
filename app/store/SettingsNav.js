/**
 * This store holds the Settings tree navigation,
 * each setting view being contained in a Category
 */
Ext.define('Mfw.store.SettingsNav', {
    extend: 'Ext.data.TreeStore',
    storeId: 'settings-nav',
    alias: 'store.settings-nav',
    rootVisible: false,
    filterer: 'bottomup',

    root: {
        expanded: true,
        children: [{
            // Netwotk
            text: '<strong>' + 'Network'.t() + '</strong>',
            iconCls: 'tree network',
            href: 'settings/network',
            children: [
                { text: 'Interfaces'.t(), leaf: true, href: 'settings/network/interfaces' },
                { text: 'DHCP'.t(), leaf: true, href: 'settings/network/dhcp' },
                { text: 'DNS'.t(), leaf: true, href: 'settings/network/dns' }
            ]
        }, {
            // Firewall
            text: '<strong>' + 'Firewall'.t() + '</strong>',
            iconCls: 'tree administration',
            href: 'settings/firewall',
            children: [
                { text: 'Filter Rules'.t(), leaf: true, href: 'settings/firewall/filter-rules' },
                // { text: 'Port Forward Rules'.t(), leaf: true, href: 'settings/firewall/portforwardrules' },
            ]
        }, {
            // System
            text: '<strong>' + 'System'.t() + '</strong>',
            iconCls: 'tree system',
            href: 'settings/system',
            children: [
                { text: 'Host/Domain'.t(), leaf: true, href: 'settings/system/host' }
            ]
        }, {
            // Administration
            text: '<strong>' + 'Administration'.t() + '</strong>',
            iconCls: 'tree administration',
            href: 'settings/administration',
            children: [
                { text: 'Some Setting title'.t(), leaf: true }
            ]
        }]
    }

});
