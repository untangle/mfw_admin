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
            href: 'network',
            children: [
                { text: 'Interfaces'.t(), leaf: true, href: 'network/interfaces' },
                { text: 'DHCP'.t(), leaf: true, href: 'network/dhcp' },
                { text: 'DNS'.t(), leaf: true, href: 'network/dns' }
            ]
        }, {
            // Firewall
            text: '<strong>' + 'Firewall'.t() + '</strong>',
            iconCls: 'tree administration',
            href: 'firewall',
            children: [
                { text: 'Filter'.t(), leaf: true, href: 'firewall/filter' },
                { text: 'Access'.t(), leaf: true, href: 'firewall/access' },
                { text: 'NAT'.t(), leaf: true, href: 'firewall/nat' },
                { text: 'Shaping'.t(), leaf: true, href: 'firewall/shaping' },
                { text: 'Port Forward'.t(), leaf: true, href: 'firewall/port-forward' },
                // not implemented
                // { text: 'Captive Portal'.t(), leaf: true, href: 'firewall/captive-portal' },
                // { text: 'Web Filter'.t(), leaf: true, href: 'firewall/web-filter' }
            ]
        }, {
            // Smart Routing
            text: '<strong>' + 'Routing'.t() + '</strong>',
            iconCls: 'tree system',
            href: 'routing',
            children: [
                { text: 'WAN Policies'.t(), leaf: true, href: 'routing/wan-policies' },
                { text: 'WAN Rules'.t(), leaf: true, href: 'routing/wan-rules' }
            ]
        }, {
            // System
            text: '<strong>' + 'System'.t() + '</strong>',
            iconCls: 'tree system',
            href: 'system',
            children: [
                { text: 'Settings'.t(), leaf: true, href: 'system/settings' },
                { text: 'Accounts'.t(), leaf: true, href: 'system/accounts' },
                { text: 'Upgrade'.t(), leaf: true, href: 'system/upgrade' },
                { text: 'About'.t(), leaf: true, href: 'system/about' }
            ]
        }]
    }

});
