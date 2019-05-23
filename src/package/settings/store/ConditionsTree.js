Ext.define('Mfw.store.Conditions', {
    extend: 'Ext.data.TreeStore',
    storeId: 'conditions',
    alias: 'store.conditions',
    rootVisible: false,
    folderSort: true,

    sorters: 'text',

    constructor: function (config) {
        var me = this,
            root = {
                expanded: true,
                children: []
            },
            categories = {};

        me.byIdMap = {};

        Ext.Array.each(Conditions.list, function (cond) {
            var cat = cond.category || 'none';
            if (!categories[cat]) {
                categories[cat] = [];
            }
            cond.leaf = true;
            categories[cat].push(cond);
        });

        Ext.Object.each(categories, function(key, value) {
            if (key === 'none') {
                Ext.Array.push(root.children, value);
                return;
            }
            root.children.push({
                text: '<strong>' + key + '</strong>',
                children: value
            });
        });

        config.root = root;

        this.callParent([config]);
    }
});
