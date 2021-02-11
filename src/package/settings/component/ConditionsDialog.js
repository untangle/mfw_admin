Ext.define('Mfw.cmp.ConditionsDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.all-conditions-dialog',

    title: 'All Conditions',
    width: 400,
    height: 750,
    maxHeight: '80%',
    layout: 'vbox',
    bodyPadding: '0 0 0 10',

    showAnimation: {
        duration: 0
    },

    viewModel: {
        selection: null
    },

    items: [{
        xtype: 'searchfield',
        placeholder: 'Find Condition Type ...'.t(),
        listeners: {
            change: 'filterConditionType'
        }
    }, {
        xtype: 'tree',
        userCls: 'conditions-tree c-noheaders',
        singleExpand: true,
        expanderOnly: false,
        selectOnExpander: true,
        flex: 1,
        selectable: {
            mode: 'single'
        },
        margin: '5 0',
        columns: [{
            xtype: 'treecolumn',
            dataIndex: 'text',
            flex: 1,
            cell: {
                // cellCls: 'event-key',
                encodeHtml: false
            }
        }],
        store: {
            type: 'conditionsTree',
            rootVisible: false,
            filterer: 'bottomup'
        },
        listeners: {
            select: 'onSelect',
            deselect: 'onDeselect'
        },
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        items: [{
            xtype: 'component',
            style: 'font-size: 12px;',
            bind: {
                html: '{selection.text}'
            }
        }, '->', {
            xtype: 'button',
            text: 'Cancel',
            margin: '0 10 0 0',
            handler: 'onCancel'
        }, {
            xtype: 'button',
            text: 'Add',
            ui: 'action',
            handler: 'onAdd',
            disabled: true,
            bind: {
                disabled: '{!selection}'
            }
        }]
    }],
    controller: {
        filterConditionType: function (field, value) {
            var me = this,
                tree = me.up('tree'),
                store = tree.getStore(),
                root = store.getRoot(),
                conditions = null;
                // conditions = me.getView().ownerCmp.getConditions();

            store.clearFilter();

            // the above store.clearFilter() removes the conditions we have filtered for this ruleDialog instance
            // we have to refilter based on the ownerCmp conditions, so that invalid conditions do not show up
            if (conditions) {
                // display only possible conditions provided for this table
                store.filterBy(function (rec) {
                    return Ext.Array.contains(conditions, rec.get('type'));
                });
            }

            if (value) {
                tree.setSingleExpand(false);
                root.expandChildren(true);
                store.filterBy(function (node) {
                    var v = new RegExp(value, 'i');
                    return node.isLeaf() ? v.test(node.get('text')) : false;
                });
            } else {
                tree.setSingleExpand(true);
                root.collapseChildren(true);
            }
        },
        onSelect(dataview, selection) {
            this.getViewModel().set('selection', selection);
        },
        onDeselect() {
            this.getViewModel().set('selection', null);
        },

        onCancel: function () {
            var me = this;
            me.getViewModel().set('selection', null);
            me.getView().close();
        },
        onAdd: function () {
            var me = this;
            me.getView().close();
        }
    }
})
