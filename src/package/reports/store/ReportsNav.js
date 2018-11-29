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
        text: 'All Reports'.t(),
        expanded: true,
        children: [{
            text: 'Loading...'.t(),
            icon: 'fa-spinner fa-spin',
            leaf: true
        }]
    },

    build: function () {
        var me = this, nodes = [], storeCat, category, categoryName, categorySlug, icon;
        Ext.Array.each(Ext.getStore('reports').getGroups().items, function (group) {
            categoryName = group._groupKey;
            categorySlug = categoryName.toLowerCase().replace(/ /g, '-');
            // storeCat = Ext.getStore('categories').findRecord('displayName', group._groupKey, 0, false, true, true);

            // create category node
            category = {
                text: '<strong>' + categoryName.toUpperCase() + '</strong>',
                iconCls: 'tree ' + categorySlug,
                route: 'cat=' + categorySlug,
                cat: categorySlug,
                // slug: storeCat.get('slug'),
                // type: storeCat.get('type'), // app or system
                // icon: storeCat.get('icon'),
                // cls: 'x-tree-category',
                // url: 'cat=' + storeCat.get('slug'),
                children: [],
                // viewPosition: storeCat.get('viewPosition'),
                // disabled: false
                // expanded: group._groupKey === vm.get('category.categoryName')
            };
            // add reports to each category
            Ext.Array.each(group.items, function (report) {
                switch (report.get('type')) {
                    case 'TEXT': icon = 'x-font-icon md-icon-subject'; break;
                    case 'EVENTS': icon = 'x-font-icon md-icon-view-list'; break;
                    default: icon = 'x-fa ' + report.getRendering().get('_icon');
                }

                category.children.push({
                    text: report.get('name'),
                    iconCls: icon,
                    route: report.get('_route'),
                    cat: categorySlug,
                    rep: report.get('name').toLowerCase().replace(/ /g, '-'),
                    leaf: true
                });
            });
            nodes.push(category);
        });

        me.setRoot({
            text: 'All reports'.t(),
            slug: '/reports/',
            expanded: true,
            disabled: false, // !important
            children: nodes
        });
    }

    // root: {
    //     expanded: true,
    //     children: [{
    //         // Hosts
    //         text: '<strong>' + 'Hosts'.t() + '</strong>',
    //         iconCls: 'tree hosts',
    //         href: 'reports/hosts',
    //         children: [
    //             { text: 'Active'.t(), leaf: true, href: 'reports/hosts/hosts-active', iconCls: 'x-fa fa-area-chart' },
    //             { text: 'Additions'.t(), leaf: true, href: 'reports/hosts/hosts-additions', iconCls: 'x-fa fa-bar-chart' },
    //             { text: 'Updates'.t(), leaf: true, href: 'reports/hosts/hosts-updates', iconCls: 'x-fa fa-bar-chart' },
    //             { text: 'Events'.t(), leaf: true, href: 'reports/hosts/hosts-events', iconCls: 'x-fa fa-list' }
    //         ]
    //     }, {
    //         // Devices
    //         text: '<strong>' + 'Devices'.t() + '</strong>',
    //         iconCls: 'tree devices',
    //         href: 'reports/devices',
    //         children: [
    //             { text: 'Additions'.t(), leaf: true, href: 'reports/devices/devices-additions' },
    //             { text: 'Updates'.t(), leaf: true, href: 'reports/devices/devices-updates' },
    //             { text: 'Events Active'.t(), leaf: true, href: 'reports/devices/devices-events-active' },
    //         ]
    //     }, {
    //         // Network
    //         text: '<strong>' + 'Network'.t() + '</strong>',
    //         iconCls: 'tree network',
    //         href: 'reports/network',
    //         children: [
    //             { text: 'Data Usage'.t(), leaf: true, href: 'reports/network/data-usage', iconCls: 'x-fa fa-bar-chart', type: 'datetime', graph: 'column' },
    //             { text: 'Interface Usage'.t(), leaf: true, href: 'reports/network/interface-usage', iconCls: 'x-fa fa-line-chart', type: 'datetime', graph: 'spline' },
    //             { text: 'Sessions'.t(), leaf: true, href: 'reports/network/sessions', iconCls: 'x-fa fa-bar-chart', type: 'datetime', graph: 'column' },
    //             { text: 'Bandwidth Usage'.t(), leaf: true, href: 'reports/network/bandwidth-usage', iconCls: 'x-fa fa-area-chart', type: 'datetime', graph: 'areaspline' },
    //             { text: 'Client Addresses'.t(), leaf: true, href: 'reports/network/client-addresses', iconCls: 'x-fa fa-pie-chart', type: 'pie', graph: 'pie' },
    //             { text: 'Server Addresses'.t(), leaf: true, href: 'reports/network/server-addresses', iconCls: 'x-fa fa-pie-chart', type: 'pie', graph: 'pie' },
    //             { text: 'IP Protocols'.t(), leaf: true, href: 'reports/network/ip-protocols', iconCls: 'x-fa fa-pie-chart', type: 'pie', graph: 'pie' },
    //             { text: 'Server Ports'.t(), leaf: true, href: 'reports/network/server-ports', iconCls: 'x-fa fa-pie-chart', type: 'pie', graph: 'pie' },
    //             { text: 'Server Countries'.t(), leaf: true, href: 'reports/network/server-countries', iconCls: 'x-fa fa-pie-chart', type: 'pie', graph: 'pie' }
    //         ]
    //     }]
    // }

});
