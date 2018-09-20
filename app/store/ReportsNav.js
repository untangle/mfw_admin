/**
 * This store holds the Reports tree navigation,
 */
Ext.define('Mfw.store.ReportsNav', {
    extend: 'Ext.data.TreeStore',
    storeId: 'reports-nav',
    alias: 'store.reports-nav',
    rootVisible: false,
    filterer: 'bottomup',

    root: {
        expanded: true,
        children: [{
            // Hosts
            text: '<strong>' + 'Hosts'.t() + '</strong>',
            iconCls: 'tree hosts',
            href: 'reports/hosts',
            children: [
                { text: 'Active'.t(), leaf: true, href: 'reports/hosts/hosts-active', iconCls: 'x-fa fa-area-chart' },
                { text: 'Additions'.t(), leaf: true, href: 'reports/hosts/hosts-additions', iconCls: 'x-fa fa-bar-chart' },
                { text: 'Updates'.t(), leaf: true, href: 'reports/hosts/hosts-updates', iconCls: 'x-fa fa-bar-chart' },
                { text: 'Events'.t(), leaf: true, href: 'reports/hosts/hosts-events', iconCls: 'x-fa fa-list' }
            ]
        }, {
            // Devices
            text: '<strong>' + 'Devices'.t() + '</strong>',
            iconCls: 'tree devices',
            href: 'reports/devices',
            children: [
                { text: 'Additions'.t(), leaf: true, href: 'reports/devices/devices-additions' },
                { text: 'Updates'.t(), leaf: true, href: 'reports/devices/devices-updates' },
                { text: 'Events Active'.t(), leaf: true, href: 'reports/devices/devices-events-active' },
            ]
        }]
    }

});
