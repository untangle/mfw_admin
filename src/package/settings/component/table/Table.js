Ext.define('Mfw.cmp.grid.table.Table', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.tablegrid',

    viewModel: {
        data: {
            selectedChain: null,
            chainNames: null
        },
        formulas: {
            selectionModel: function (get) {
                return {
                    mode: 'multi',
                    cells: false,
                    // checkbox: true,
                    drag: true,
                    rows: get('selectedChain.editable')
                };
            }
        }
    },

    bind: {
        store: '{selectedChain.rules}',
        selectable: '{selectionModel}'
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
        'DNAT': { value: 'DNAT', text: 'Destination Address'.t() },
        'SNAT': { value: 'SNAT', text: 'Source Address'.t() },
        'MASQUERADE': { value: 'MASQUERADE', text: 'Masquerade'.t() },
        'SET_PRIORITY': { value: 'SET_PRIORITY', text: 'Set Priority'.t() },
        'WAN_DESTINATION': { value: 'WAN_DESTINATION', text: 'Wan Destination'.t() },
        'WAN_POLICY': { value: 'WAN_POLICY', text: 'Wan Policy'.t() }
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
        }, '->', {
            xtype: 'component',
            style: 'font-size: 12px;',
            html: 'Move Rule'.t(),
            hidden: true,
            bind: { hidden: '{selcount !== 1}' }
        }, {
            xtype: 'segmentedbutton',
            allowToggle: false,
            margin: '0 8',
            hidden: true,
            bind: { hidden: '{selcount !== 1}' },
            defaults: {
                ui: 'default',
                handler: 'onSort',
            },
            items: [{
                iconCls: 'x-fa fa-angle-double-up',
                tooltip: 'Move First'.t(),
                pos: 'first'
            }, {
                iconCls: 'x-fa fa-angle-up',
                tooltip: 'Move Up'.t(),
                pos: 'up'
            }, {
                iconCls: 'x-fa fa-angle-down',
                tooltip: 'Move Down'.t(),
                pos: 'down'
            }, {
                iconCls: 'x-fa fa-angle-double-down',
                tooltip: 'Move Last'.t(),
                pos: 'last'
            }, {
                iconCls: 'md-icon-close',
                tooltip: 'Cancel'.t(),
                pos: null
            }]
        }, {
            xtype: 'toolbarseparator',
            hidden: true,
            bind: { hidden: '{selcount !== 1}' }
        }, {
            text: 'New Rule'.t(),
            iconCls: 'md-icon-add',
            hidden: true,
            bind: { hidden: '{!selectedChain.editable}' },
            handler: 'onNewRule'
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
            bind: { hidden: '{!selectedChain.editable}' },
            operation: 'EDIT',
            handler: 'onChainOperation'
        }, {
            iconCls: 'md-icon-delete',
            tooltip: {
                html: 'Delete chain'.t(),
                anchor: true,
                hideDelay: 0,
                showDelay: 0
            },
            hidden: true,
            bind: { hidden: '{!selectedChain.editable}' },
            handler: 'onDeleteChain'
        }]
    }],

    columns: [{
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
        dataIndex: 'conditions()',
        menuDisabled: true,
        flex: 1,
        cell: {
            bind: {
                userCls: '{!record.enabled ? "x-disabled" : ""}'
            },
            bodyStyle: {
                // padding: 0
                padding: '0 16px 0 0'
            },
            encodeHtml: false
        },
        renderer: 'conditionRenderer'
    }, {
        text: 'Action'.t(),
        dataIndex: 'action',
        menuDisabled: true,
        width: 350,
        cell: {
            encodeHtml: false,
            bind: {
                userCls: '{!record.enabled ? "x-disabled" : ""}'
            },
            tools: [{
                xtype: 'button',
                handler: 'selectChainFromGrid',
                // ui: 'action',
                style: 'font-weight: normal;',
                bind: {
                    record: '{record}',
                    hidden: '{record.action.type !== "JUMP" && record.action.type !== "GOTO"}',
                    text: '{record.action.type === "JUMP" ? "Jump To" : (record.action.type === "GOTO" ? "Go To" : "")} <b>{record.action.chain}</b>'
                }
            }]
        },
        renderer: 'actionRenderer'
    }],

    listeners: {
        select: 'onSelect',
        deselect: 'onDeselect',
        beforesave: 'beforeSave', // custom event to prepare records
        destroy: 'onDestroy'
    }
});
