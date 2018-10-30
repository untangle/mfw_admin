Ext.define('Mfw.settings.firewall.ShapingRules', {
    extend: 'Mfw.cmp.grid.table.Table',
    // extend: 'Ext.grid.Grid',
    alias: 'widget.mfw-settings-firewall-shaping-rules',
    title: 'Shaping Rules'.t(),

    viewModel: {},
    config: {
        api: {
            read: Util.api + '/settings/firewall/tables/shaping-rules',
            update: Util.api + '/settings/firewall/tables/shaping-rules'
        },
        actionFields: [{
            xtype: 'selectfield',
            reference: 'actiontype',
            name: 'type',
            label: 'Choose Action'.t(),
            editable: false,
            itemTpl: '<tpl>{text}</tpl>',
            options: [
                { value: 'REJECT', text: 'Reject'.t() },
                { value: 'ACCEPT', text: 'Accept'.t() },
                { value: 'JUMP', text: 'Jump to'.t() + '...' },
                { value: 'GOTO', text: 'Go to'.t() + '...' },
                { value: 'SNAT', text: 'SNAT'.t() },
                { value: 'MASQUERADE', text: 'Masquerade'.t() },
                { value: 'SET_PRIORITY', text: 'Set Priority'.t() }
            ]
        }, {
            xtype: 'combobox',
            name: 'chain',
            label: 'Choose Chain'.t(),
            editable: false,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'name',
            hidden: true,
            bind: {
                store: '{chainNames}',
                hidden: '{!actiontype.value || actiontype.value !== "JUMP" || actiontype.value !== "GOTO"}'
            }
        }, {
            xtype: 'textfield',
            name: 'snat_address',
            label: 'SNAT Address'.t(),
            required: true,
            validators: ['ipaddress'],
            hidden: true,
            bind: {
                hidden: '{!actiontype.value || actiontype.value !== "SNAT"}'
            }
        }, {
            xtype: 'numberfield',
            name: 'priority',
            label: 'Priority'.t(),
            required: true,
            hidden: true,
            bind: {
                hidden: '{!actiontype.value || actiontype.value !== "SET_PRIORITY"}'
            }
        }],
        actionColumn: [{
            text: 'Action'.t(),
            dataIndex: 'action',
            menuDisabled: true,
            width: 250,
            cell: {
                encodeHtml: false,
                bind: {
                    userCls: '{!record.enabled ? "x-disabled" : ""}'
                }
            },
            renderer: function (action) {
                // console.log (action);
                var actionStr = 'Missing or No Action...'.t();
                if (action && action.type) {
                    switch (action.type) {
                        case 'REJECT': actionStr = '<i class="x-fa fa-ban fa-red" style="width: 16px; display: inline-block;"></i> ' + 'Reject'.t(); break;
                        case 'ACCEPT': actionStr = '<i class="x-fa fa-check fa-green" style="width: 16px; display: inline-block;"></i> ' + 'Accept'.t(); break;
                        case 'JUMP':   actionStr = '<i class="x-fa fa-level-down fa-blue" style="width: 16px; display: inline-block;"></i> ' + 'Jump to'.t(); break;
                        case 'GOTO':   actionStr = '<i class="x-fa fa-level-down fa-blue" style="width: 16px; display: inline-block;"></i> ' + 'Go to'.t(); break;
                        case 'SNAT':   actionStr = 'SNAT'.t(); break;
                        case 'MASQUERADE':   actionStr = 'MASQUERADE'.t(); break;
                        case 'SET_PRIORITY':   actionStr = 'Set Priority'.t(); break;
                        default: break;
                    }
                    if (action.chain && (action.type === 'JUMP' || action.type === 'GOTO')) {
                        actionStr += ' ' + '<span style="color: #519839; font-weight: bold;">' + action.chain + '</span>';
                    }
                    if (action.snat_address && action.type === 'SNAT') {
                        actionStr += ' / address = ' + '<span style="font-weight: bold;">' + action.snat_address + '</span>';
                    }
                    if (action.priority && action.type === 'SET_PRIORITY') {
                        actionStr += ' = ' + '<span style="font-weight: bold;">' + action.priority + '</span>';
                    }
                }
                return actionStr;
            }
        }]
    }
});
