Ext.define('Mfw.cmp.grid.table.Table', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.tablegrid',

    viewModel: {
        data: {
            selectedChain: {
                rules: []
            },
            chainNames: null
        }
    },

    bind: {
        store: '{selectedChain.rules}'
    },

    controller: 'tablegrid',

    config: {
        api: null,
        // use all available actions unless a subset is specified in each Table
        actions: ['JUMP', 'GOTO', 'ACCEPT', 'REJECT', 'DROP', 'DNAT', 'SNAT', 'MASQUERADE', 'SET_PRIORITY'],
        // use all available conditions unless a subset is specified in each Table
        conditions: null,
        chain: null,
        hash: ''
    },

    actionsMap: {
        'JUMP': { value: 'JUMP', text: 'Jump to' },
        'GOTO': { value: 'GOTO', text: 'Go to' },
        'ACCEPT': { value: 'ACCEPT', text: 'Accept' },
        'RETURN': { value: 'RETURN', text: 'Return' },
        'REJECT': { value: 'REJECT', text: 'Reject' },
        'DROP': { value: 'DROP', text: 'Drop' },
        'DNAT': { value: 'DNAT', text: 'New Destination' },
        'SNAT': { value: 'SNAT', text: 'New Source' },
        'MASQUERADE': { value: 'MASQUERADE', text: 'Masquerade' },
        'SET_PRIORITY': { value: 'SET_PRIORITY', text: 'Set Priority' },
        'WAN_DESTINATION': { value: 'WAN_DESTINATION', text: 'Wan Destination' },
        'WAN_POLICY': { value: 'WAN_POLICY', text: 'Wan Policy' }
    },

    itemConfig: {
        viewModel: true, // important
    },

    rowLines: false,
    selectable: false,
    itemRipple: false,
    // variableHeights: true,
    plugins: {
        sortablelist: true
    },

    emptyText: 'No rules defined!',
    scrollable: true,
    sortable: false,
    groupable: false,

    items: [{
        xtype: 'toolbar',
        itemId: 'chainsBar',
        docked: 'top',
        layout: 'float',
        padding: 0,
        defaults: {
            margin: 8,
            handler: 'selectChainFromToolbar'
        },
        zIndex: 10,
        items: []
    }, {
        xtype: 'toolbar',
        docked: 'top',
        padding: '0 8',
        shadow: false,
        style: 'background: transparent; border-bottom: 1px #EEE solid',
        border: true,
        items: [{
            text: 'Create New Rule',
            // iconCls: 'md-icon-add',
            ui: 'action',
            hidden: true,
            bind: { hidden: '{!selectedChain.editable}' },
            handler: 'onNewRule'
        }, '->',
        {
            xtype: 'component',
            userCls: 'chain-base',
            html: 'BASE',
            hidden: true,
            bind: {
                hidden: '{!selectedChain.base}'
            }
        }, {
            xtype: 'component',
            userCls: 'chain-editable',
            html: 'READONLY',
            hidden: true,
            bind: {
                hidden: '{selectedChain.editable}'
            }
        }, {
            xtype: 'component',
            style: 'font-size: 14px; font-weight: normal;',
            margin: '0 0 0 16',
            hidden: true,
            bind: {
                html: '<span style="color: #777;">' + 'Hook' + ':</span> <strong>{selectedChain.hook}</strong>',
                hidden: '{!selectedChain.base}'
            }
        }, {
            xtype: 'component',
            style: 'font-size: 14px; font-weight: normal;',
            margin: '0 0 0 16',
            hidden: true,
            bind: {
                html: '<span style="color: #777;">' + 'Priority' + ':</span> <strong>{selectedChain.priority}</strong>',
                hidden: '{!selectedChain.base}'
            }
        }, {
            xtype: 'toolbarseparator',
            style: 'background: #EEE',
            margin: '0 16 0 32',
            hidden: true,
            bind: {
                hidden: '{!selectedChain.base}'
            }
        }, {
            iconCls: 'md-icon-edit',
            // text: 'Edit Chain',
            tooltip: {
                html: 'Edit Chain',
                anchor: true,
                hideDelay: 0,
                showDelay: 0
            },
            hidden: true,
            bind: { hidden: '{!selectedChain.editable}' },
            operation: 'EDIT',
            handler: 'onChainOperation'
        }, {
            iconCls: 'md-icon-delete',
            // text: 'Delete Chain',
            tooltip: {
                html: 'Delete Chain',
                anchor: true,
                hideDelay: 0,
                showDelay: 0
            },
            margin: '0 0 0 8',
            hidden: true,
            bind: { hidden: '{!selectedChain.editable}' },
            handler: 'onDeleteChain'
        }]
    }],

    columns: [{
        width: 44,
        menuDisabled: true,
        resizable: false,
        cell: {
            encodeHtml: false,
            tools: [{ cls: 'x-list-sortablehandle', iconCls: 'md-icon-drag-handle', zone: 'start', tooltip: 'Drag to Sort' }]
        }
    }, {
        xtype: 'checkcolumn',
        dataIndex: 'enabled',
        // text: 'Enabled',
        width: 44,
        menuDisabled: true,
        resizable: false
    }, {
        text: 'Id',
        dataIndex: 'ruleId',
        menuDisabled: true,
        resizable: false,
        width: 44,
        align: 'right',
        cell: {
            encodeHtml: false,
        },
        renderer: function (v) {
            return ( v === 0 ) ? '-' : v;
        }
    }, {
        text: 'Description',
        dataIndex: 'description',
        menuDisabled: true,
        minWidth: 400,
        cell: {
            encodeHtml: false,
            bind: {
                userCls: '{!record.enabled ? "x-disabled" : ""}'
            }
        },
        renderer: function (val, rec) {
            return rec.get('enabled') ? ('<strong>' + val + '</strong>') : val;
        }
    }, {
        text: 'Conditions',
        menuDisabled: true,
        flex: 1,
        hidden: true,
        cell: {
            bind: {
                userCls: '{!record.enabled ? "x-disabled" : ""}'
            },
            encodeHtml: false
        },
        renderer: Renderer.conditionsList
    }, {
        text: 'Action',
        dataIndex: 'action',
        menuDisabled: true,
        width: 350,
        hidden: true,
        cell: {
            encodeHtml: false,
            bind: {
                userCls: '{!record.enabled ? "x-disabled" : ""}'
            }
        },
        renderer: Renderer.ruleAction
    }, {
        text: 'Summary',
        menuDisabled: true,
        // hidden: true,
        flex: 1,
        cell: {
            style: {
                color: '#777'
            },
            encodeHtml: false
        },
        renderer: Renderer.conditionsSentence
    }],

    listeners: {
        select: 'onSelect',
        deselect: 'onDeselect',
        beforesave: 'beforeSave', // custom event to prepare records
        destroy: 'onDestroy'
    }
});
