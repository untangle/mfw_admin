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
        chain: null,
        hash: ''
    },

    actionsMap: {
        'JUMP': { value: 'JUMP', text: 'Jump to'.t() },
        'GOTO': { value: 'GOTO', text: 'Go to'.t() },
        'ACCEPT': { value: 'ACCEPT', text: 'Accept'.t() },
        'RETURN': { value: 'RETURN', text: 'Return'.t() },
        'REJECT': { value: 'REJECT', text: 'Reject'.t() },
        'DROP': { value: 'DROP', text: 'Drop'.t() },
        'DNAT': { value: 'DNAT', text: 'New Destination'.t() },
        'SNAT': { value: 'SNAT', text: 'New Source'.t() },
        'MASQUERADE': { value: 'MASQUERADE', text: 'Masquerade'.t() },
        'SET_PRIORITY': { value: 'SET_PRIORITY', text: 'Set Priority'.t() },
        'WAN_DESTINATION': { value: 'WAN_DESTINATION', text: 'Wan Destination'.t() },
        'WAN_POLICY': { value: 'WAN_POLICY', text: 'Wan Policy'.t() }
    },

    itemConfig: {
        viewModel: true, // important
    },

    rowLines: true,
    selectable: false,
    itemRipple: false,
    variableHeights: true,
    plugins: {
        sortablelist: true
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
            xtype: 'component',
            html: 'Chain:',
            style: 'font-size: 14px; color: #555;',
            margin: '0 8'
        }, {
            xtype: 'button',
            itemId: 'chainsmenu',
            minWidth: 200,
            textAlign: 'left',
            bind: {
                text: '{selectedChain.name}'
            },
            menu: {
                minWidth: 250,
                userCls: 'x-htmlmenu chain-menu',
                shadow: false
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
            userCls: 'chain-editable',
            html: 'READONLY'.t(),
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
                html: '<span style="color: #777;">' + 'Hook'.t() + ':</span> <strong>{selectedChain.hook}</strong>',
                hidden: '{!selectedChain.base}'
            }
        }, {
            xtype: 'component',
            style: 'font-size: 14px; font-weight: normal;',
            margin: '0 0 0 16',
            hidden: true,
            bind: {
                html: '<span style="color: #777;">' + 'Priority'.t() + ':</span> <strong>{selectedChain.priority}</strong>',
                hidden: '{!selectedChain.base}'
            }
        }, '->',
        // {
        //     xtype: 'component',
        //     style: 'font-size: 12px; color: #999;',
        //     margin: '0 8',
        //     bind: {
        //         html: '{displayList}'
        //     }
        //     // html: 'View as'
        // }, {
        //     iconCls: 'md-icon-format-list-bulleted',
        //     enableToggle: true,
        //     pressed: false,
        //     ripple: false,
        //     bind: {
        //         pressed: '{displayList}',
        //     },
        //     tooltip: {
        //         html: 'List'.t(),
        //         anchor: true,
        //         hideDelay: 0,
        //         showDelay: 0
        //     }
        // }, {
        //     iconCls: 'md-icon-short-text',
        //     enableToggle: true,
        //     pressed: false,
        //     ripple: false,
        //     bind: {
        //         pressed: '{!displayList}',
        //     },
        //     tooltip: {
        //         html: 'Sentence'.t(),
        //         anchor: true,
        //         hideDelay: 0,
        //         showDelay: 0
        //     }
        // },
        {
            iconCls: 'md-icon-edit',
            // text: 'Edit Chain',
            tooltip: {
                html: 'Edit chain'.t(),
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
            margin: '0 16 0 8',
            tooltip: {
                html: 'Delete chain'.t(),
                anchor: true,
                hideDelay: 0,
                showDelay: 0
            },
            hidden: true,
            bind: { hidden: '{!selectedChain.editable}' },
            handler: 'onDeleteChain'
        }, {
            text: 'New Rule'.t(),
            // iconCls: 'md-icon-add',
            ui: 'action',
            hidden: true,
            bind: { hidden: '{!selectedChain.editable}' },
            handler: 'onNewRule'
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
        text: 'Id'.t(),
        dataIndex: 'ruleId',
        menuDisabled: true,
        resizable: false,
        width: 50,
        align: 'right',
        // hidden: true,
        renderer: function (v) {
            return ( v === 0 ) ? '#?' : '#' + v;
        }
    }, {
        xtype: 'checkcolumn',
        dataIndex: 'enabled',
        text: 'Enabled'.t(),
        width: 80,
        menuDisabled: true,
        resizable: false,
        // width: 100,
        // dataIndex: 'enabled',
        // cell: {
        //     xtype: 'widgetcell',
        //     widget: {
        //         xtype: 'togglefield',
        //         margin: '0 10',
        //         disabled: true,
        //         bind: {
        //             disabled: '{!selectedChain.editable}'
        //         }
        //     }
        // }
    }, {
        text: 'Description'.t(),
        dataIndex: 'description',
        menuDisabled: true,
        minWidth: 400,
        cell: {
            bind: {
                userCls: '{!record.enabled ? "x-disabled" : ""}'
            }
        }
    }, {
        text: 'Conditions'.t(),
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
        text: 'Action'.t(),
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
        renderer: 'actionRenderer'
    }, {
        text: 'Summary',
        menuDisabled: true,
        flex: 1,
        cell: {
            style: {
                fontSize: '14px',
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
