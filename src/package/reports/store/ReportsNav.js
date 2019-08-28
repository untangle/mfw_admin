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
                    case 'TEXT': icon = 'x-fa fa-align-left'; break;
                    case 'EVENTS': icon = 'x-fa fa-list'; break;
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
});
