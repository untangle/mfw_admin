/**
 * This store holds the Settings tree navigation,
 * each setting view being contained in a Category
 */
Ext.define('Mfw.store.Nav', {
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
                { text: 'Filter'.t(), leaf: true, href: 'settings/firewall/filter' },
                { text: 'Access'.t(), leaf: true, href: 'settings/firewall/access' },
                { text: 'NAT'.t(), leaf: true, href: 'settings/firewall/nat' },
                { text: 'Shaping'.t(), leaf: true, href: 'settings/firewall/shaping' },
                { text: 'Port Forward'.t(), leaf: true, href: 'settings/firewall/port-forward' },
                { text: 'Captive Portal'.t(), leaf: true, href: 'settings/firewall/captive-portal' },
                { text: 'Vote'.t(), leaf: true, href: 'settings/firewall/vote' },
                { text: 'Web Filter'.t(), leaf: true, href: 'settings/firewall/web-filter' }
            ]
        }, {
            // Smart Routing
            text: '<strong>' + 'Routing'.t() + '</strong>',
            iconCls: 'tree system',
            href: 'settings/routing',
            children: [
                { text: 'WAN Policies'.t(), leaf: true, href: 'settings/routing/wan-policies' },
                { text: 'WAN Policy Chains'.t(), leaf: true, href: 'settings/routing/wan-policy-chains' }
            ]
        }, {
            // System
            text: '<strong>' + 'System'.t() + '</strong>',
            iconCls: 'tree system',
            href: 'settings/system',
            children: [
                { text: 'Host/Domain'.t(), leaf: true, href: 'settings/system/host' },
                { text: 'Accounts'.t(), leaf: true, href: 'settings/system/accounts' }
            ]
        }]
    }

});
