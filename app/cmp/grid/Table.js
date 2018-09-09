Ext.define('Mfw.cmp.grid.Table', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.tablegrid',

    viewModel: {
        data: {
            selectedChain: null
        },
        formulas: {
            selectionModel: function (get) {
                return {
                    mode: 'multi',
                    cells: false,
                    // checkbox: true,
                    allowDeselect: true,
                    drag: true,
                    rows: get('selectedChain.editable')
                }
            }
        }
    },

    bind: {
        store: '{selectedChain.rules}',
        selectable: '{selectionModel}'
    },

    controller: 'tablegrid',

    config: {
        api: null
    },

    itemConfig: {
        viewModel: true, // important
    },

    emptyText: 'No Data!'.t(),
    scrollable: true,
    sortable: false,
    groupable: false,

    items: [{
        xtype: 'toolbar',
        docked: 'top',
        padding: '0 8',
        items: [{
            xtype: 'button',
            itemId: 'chainsmenu',
            bind: {
                text: '{selectedChain.name}'
            },
            menu: {
                userCls: 'x-htmlmenu',
                defaults: 'menucheckitem'
                // anchor: true,
            }
        }, {
            xtype: 'component',
            userCls: 'chain-base',
            html: 'BASE'.t(),
            hidden: true,
            bind: {
                hidden: '{!selectedChain.base}'
            }
        }, {
            xtype: 'component',
            userCls: 'chain-default',
            html: 'DEFAULT'.t(),
            hidden: true,
            bind: {
                hidden: '{!selectedChain.default}'
            }
        }, {
            xtype: 'component',
            userCls: 'chain-editable',
            html: 'READONLY'.t(),
            hidden: true,
            bind: {
                hidden: '{selectedChain.editable}'
            }
        }, '->', {
            text: 'New Rule',
            iconCls: 'md-icon-add',
            hidden: true,
            bind: { hidden: '{!selectedChain.editable}' }
        }, {
            xtype: 'toolbarseparator',
            hidden: true,
            bind: { hidden: '{!selectedChain.editable}' }
        }, {
            iconCls: 'md-icon-edit',
            tooltip: {
                html: 'Edit chain'.t(),
                anchor: true,
                hideDelay: 0,
                showDelay: 0
            },
            hidden: true,
            bind: { hidden: '{!selectedChain.editable}' }
        }, {
            iconCls: 'md-icon-delete',
            tooltip: {
                html: 'Delete chain'.t(),
                anchor: true,
                hideDelay: 0,
                showDelay: 0
            },
            hidden: true,
            bind: { hidden: '{!selectedChain.editable}' }
        }, {
            iconCls: 'md-icon-star',
            tooltip: {
                html: 'Set as default chain'.t(),
                anchor: true,
                hideDelay: 0,
                showDelay: 0
            },
            hidden: true,
            bind: { hidden: '{!selectedChain.editable || selectedChain.default}' }
        }]
    }],

    listeners: {
        initialize: 'onInitialize',
        select: 'onSelect',
        deselect: 'onDeselect',
        beforesave: 'beforeSave', // custom event to prepare records
        destroy: 'onDestroy'
    }
});
