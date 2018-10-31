Ext.define('Mfw.settings.firewall.Access', {
    extend: 'Mfw.cmp.grid.table.Table',
    // extend: 'Ext.grid.Grid',
    alias: 'widget.mfw-settings-firewall-access',
    title: 'Access'.t(),

    viewModel: {},
    config: {
        api: {
            read: Util.api + '/settings/firewall/tables/access',
            update: Util.api + '/settings/firewall/tables/access'
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
                { value: 'GOTO', text: 'Go to'.t() + '...' }
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
                hidden: '{!actiontype.value || actiontype.value === "REJECT" || actiontype.value === "ACCEPT"}'
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
                var actionStr = 'No Action...'.t();
                if (action && action.type) {
                    switch (action.type) {
                        case 'REJECT': actionStr = '<i class="x-fa fa-ban fa-red" style="width: 16px; display: inline-block;"></i> ' + 'Reject'.t(); break;
                        case 'ACCEPT': actionStr = '<i class="x-fa fa-check fa-green" style="width: 16px; display: inline-block;"></i> ' + 'Accept'.t(); break;
                        case 'JUMP':   actionStr = '<i class="x-fa fa-level-down fa-blue" style="width: 16px; display: inline-block;"></i> ' + 'Jump to'.t(); break;
                        case 'GOTO':   actionStr = '<i class="x-fa fa-level-down fa-blue" style="width: 16px; display: inline-block;"></i> ' + 'Go to'.t(); break;
                        default: 'No Action...'.t(); break;
                    }
                    if (action.chain && (action.type === 'JUMP' || action.type === 'GOTO')) {
                        actionStr += ' ' + '<span style="color: #519839; font-weight: bold;">' + action.chain + '</span>';
                    }
                }
                return actionStr;
            }
        }]
    }
});
