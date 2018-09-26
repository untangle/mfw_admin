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
        }, {
            // Network
            text: '<strong>' + 'Network'.t() + '</strong>',
            iconCls: 'tree network',
            href: 'reports/network',
            children: [
                { text: 'Data Usage'.t(), leaf: true, href: 'reports/network/data-usage', iconCls: 'x-fa fa-bar-chart', type: 'datetime', graph: 'column' },
                { text: 'Interface Usage'.t(), leaf: true, href: 'reports/network/interface-usage', iconCls: 'x-fa fa-line-chart', type: 'datetime', graph: 'spline' },
                { text: 'Sessions'.t(), leaf: true, href: 'reports/network/sessions', iconCls: 'x-fa fa-bar-chart', type: 'datetime', graph: 'column' },
                { text: 'Bandwidth Usage'.t(), leaf: true, href: 'reports/network/bandwidth-usage', iconCls: 'x-fa fa-area-chart', type: 'datetime', graph: 'areaspline' },
                { text: 'Client Addresses'.t(), leaf: true, href: 'reports/network/client-addresses', iconCls: 'x-fa fa-pie-chart', type: 'pie', graph: 'pie' },
                { text: 'Server Addresses'.t(), leaf: true, href: 'reports/network/server-addresses', iconCls: 'x-fa fa-pie-chart', type: 'pie', graph: 'pie' },
                { text: 'IP Protocols'.t(), leaf: true, href: 'reports/network/ip-protocols', iconCls: 'x-fa fa-pie-chart', type: 'pie', graph: 'pie' },
                { text: 'Server Ports'.t(), leaf: true, href: 'reports/network/server-ports', iconCls: 'x-fa fa-pie-chart', type: 'pie', graph: 'pie' },
                { text: 'Server Countries'.t(), leaf: true, href: 'reports/network/server-countries', iconCls: 'x-fa fa-pie-chart', type: 'pie', graph: 'pie' }
            ]
        }]
    }

});
