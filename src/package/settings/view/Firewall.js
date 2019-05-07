Ext.define('Mfw.settings.view.Firewall', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-firewall',

    title: 'Firewall',

    layout: 'fit',

    items: [{
        xtype: 'tree',
        expanderOnly: false,
        singleExpand: true,
        selectable: false,
        itemConfig: {
            viewModel: true, // important
        },
        columns: [{
            xtype: 'treecolumn',
            text: 'Tables / Chains / Rules',
            dataIndex: 'text',
            cell: { encodeHtml: false },
            width: 500
        }, {
            width: 80,
            align: 'center',
            cell: {
                encodeHtml: false,
                tools: [{
                    xtype: 'button',
                    text: 'Edit',
                    hidden: true,
                    bind: {
                        record: '{record}',
                        hidden: '{!record.href}',

                    },
                    handler: function (btn) {
                        Mfw.app.redirectTo(btn.getRecord().get('href'));
                    }
                }]
            }
        }, {
            text: 'Conditions',
            dataIndex: 'conditions',
            cell: { encodeHtml: false },
            flex: 1,
            renderer: 'conditionRenderer'
        }, {
            text: 'Action',
            dataIndex: 'action',
            cell: { encodeHtml: false },
            width: 200,
            renderer: 'actionRenderer'
        }]
    }],

    // listeners: {
    //     deactivate: 'onDeactivate'
    // },

    controller: {
        init: function () {
            var me = this, fw = new Mfw.model.Firewall();

            fw.load({
                success: function () {
                    me.buildTree(fw);
                }
            });
        },

        buildTree: function (fw) {
            var me = this, root = { children: [] }, data = {}, rules;

            var setChildren = function (table, chain) {
                if (!data[table]) {
                    data[table] = {
                        text: '<span style="font-size: 14px; font-weight: bold;">' + table + '</span>',
                        iconCls: 'md-icon-view-list',
                        href: 'settings/firewall/' + table.replace(/ /g, '-').toLowerCase(),
                        // expanded: true,
                        children: []
                    };
                }
                rules = [];
                chain.rules().each(function (rule) {
                    rules.push({
                        text: rule.get('description'),
                        conditions: rule.conditions().getData(),
                        action: rule.getAction().getData(),
                        iconCls: 'md-icon-label',
                        leaf: true
                    });
                });
                data[table].children.push({
                    text: '<strong>' + chain.get('name') + '</strong> (' + chain.rules().count() + ' rules)',
                    href: 'settings/firewall/' + table.replace(/ /g, '-').toLowerCase() + '/' + chain.get('name'),
                    iconCls: 'md-icon-link',
                    children: rules
                });
            };


            fw.getFilter().chains().each(function(chain) {
                setChildren('Filter', chain);
            });
            fw.getAccess().chains().each(function(chain) {
                setChildren('Access', chain);
            });
            fw.getNat().chains().each(function(chain) {
                setChildren('NAT', chain);
            });
            fw.getShaping().chains().each(function(chain) {
                setChildren('Shaping', chain);
            });
            fw.getPortForward().chains().each(function(chain) {
                setChildren('Port Forward', chain);
            });
            fw.getCaptivePortal().chains().each(function(chain) {
                setChildren('Captive Portal', chain);
            });
            fw.getWebFilter().chains().each(function(chain) {
                setChildren('Web Filter', chain);
            });

            Ext.Object.each(data, function(key, value) {
                root.children.push(value);
            });

            var store = Ext.create('Ext.data.TreeStore', {
                rootVisible: false,
                root: root
            });

            me.getView().down('tree').setStore(store);
        },


        // !!!! duplicated partially from TableController
        conditionRenderer: function (conditions) {
            var strArr = [], op, ruleCondition, valueRender;

            if (!conditions) { return; }

            conditions.each(function (c) {
                switch (c.get('op')) {
                    case '==': op = '='; break;
                    case '!=': op = '&ne;'; break;
                    case '>': op = '&gt;'; break;
                    case '<': op = '&lt;'; break;
                    case '>=': op = '&ge;'; break;
                    case '<=': op = '&le;'; break;
                    default: op = '?'; break;
                }

                ruleCondition = Util.ruleConditionsMap[c.get('type')];
                valueRender = c.get('value');
                // todo different value render based on condition type
                if (ruleCondition.type === 'IP_PROTOCOL') {
                    if (Globals.protocolsMap[c.get('value')]) {
                        valueRender = Globals.protocolsMap[c.get('value')].text + ' <em style="color: #999; font-style: normal;">[' + valueRender + ']</em>';
                    }
                }

                if (ruleCondition.type === 'LIMIT_RATE') {
                    valueRender = '<strong>' + c.get('value') + '</strong> <em style="color: #333; font-style: normal;">' + Util.limitRateUnitsMap[c.get('rate_unit')].text + '</em>';
                }


                strArr.push('<div class="condition"><span>' + ruleCondition.name + '</span> ' +
                       '<em style="font-weight: bold; font-style: normal; color: #000; padding: 0 3px;">' + op + '</em> <strong>' + valueRender + '</strong></div>');
            });
            if (strArr.length > 0) {
                return strArr.join('');
            } else {
                return '<span style="color: #999; font-style: italic; font-size: 11px; padding: 0 10px;">No Conditions!</span>';
            }
        },

        // !!!! duplicated partially from TableController
        actionRenderer: function (value) {
            var me = this, grid = me.getView(),
                action = value, type,
                actionStr = 'Missing or No Action...'.t();

            if (!value) { return ''; }

            if (grid.policies) {
                var policiesMap = Ext.Array.toValueMap(grid.policies, 'value');
            }
            if (action && action.type) {
                type = action.type;
                switch (type) {
                    // case 'JUMP':            actionStr = 'Jump to'.t(); break;
                    // case 'GOTO':            actionStr = 'Go to'.t(); break;
                    case 'ACCEPT':          actionStr = 'Accept'.t(); break;
                    case 'RETURN':          actionStr = 'Return'.t(); break;
                    case 'REJECT':          actionStr = 'Reject'.t(); break;
                    case 'DROP':            actionStr = 'Drop'.t(); break;
                    case 'DNAT':            actionStr = 'Destination Address'.t(); break;
                    case 'SNAT':            actionStr = 'Source Address'.t(); break;
                    case 'MASQUERADE':      actionStr = 'Masquerade'.t(); break;
                    case 'SET_PRIORITY':    actionStr = 'Priority'.t(); break;
                    case 'WAN_DESTINATION': actionStr = 'Wan Destination'.t(); break;
                    case 'WAN_POLICY':      actionStr = ''; break;
                    default: break;
                }
                if (type === 'JUMP' || type === 'GOTO') {
                    actionStr = '';
                }
                if (type === 'SNAT') {
                    actionStr += ' ' + action.snat_address;
                }
                if (type === 'DNAT') {
                    actionStr += ' ' + action.dnat_address;
                }
                if (type === 'SET_PRIORITY') {
                    actionStr += ' ' + action.priority;
                }
                if (type === 'WAN_POLICY') {
                    actionStr += policiesMap[action.policy].text + ' <span style="color: #999;">[ policy ' + action.policy + ' ]</span> ';
                }
            }
            return actionStr;
        },
    }
});
