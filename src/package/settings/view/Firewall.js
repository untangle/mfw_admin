Ext.define('Mfw.settings.view.Firewall', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-firewall',

    title: 'Firewall',

    layout: 'fit',

    items: [{
        xtype: 'tree',
        expanderOnly: true,
        singleExpand: true,
        selectable: false,
        // variableHeights: true,
        rowLines: false,
        itemConfig: {
            viewModel: true, // important
        },
        columns: [{
            xtype: 'treecolumn',
            text: 'Tables / Chains / Rules',
            dataIndex: 'text',
            flex: 1,
            cell: {
                encodeHtml: false,
                style: {
                    // color: '#777'
                },
                tools: {
                    edit: {
                        iconCls: 'md-icon-edit',
                        hidden: true,
                        bind: {
                            record: '{record}',
                            hidden: '{!record.href}',
                        },
                        handler: function (grid, info) {
                            Mfw.app.redirectTo(info.record.get('href'));
                        }
                    }
                }
            },
            renderer: function (value, record) {
                if (!record.isLeaf()) {
                    return record.get('text');
                }
                return record.get('text') + ' &nbsp;<i class="x-fa fa-arrow-right fa-green"></i>&nbsp; <span style="color: #777;">' + Renderer.conditionsSentence(null, record.get('rule')) + '</span>';
            }
        }]
    }],

    controller: {
        init: function () {
            var me = this, fw = new Mfw.model.Firewall(),
                root = { children: [] }, store = null;

            store = Ext.create('Ext.data.TreeStore', {
                rootVisible: false,
                root: root
            });

            me.getView().down('tree').setStore(store);

            fw.load({
                success: function () {
                    me.buildTree(fw);
                }
            });
        },

        buildTree: function (fw) {
            var me = this, root = { expanded: true, children: [] }, data = {}, rules;

            var setChildren = function (table, chain) {
                if (!data[table]) {
                    data[table] = {
                        text: '<span style="font-size: 14px; font-weight: bold;">' + table + '</span>',
                        iconCls: 'md-icon-list',
                        href: 'settings/firewall/' + table.replace(/ /g, '-').toLowerCase(),
                        // expanded: true,
                        children: []
                    };
                }
                rules = [];
                chain.rules().each(function (rule) {
                    rules.push({
                        text: rule.get('description'),
                        rule: rule,
                        // conditions: rule.conditions().getData(),
                        // action: rule.getAction().getData(),
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
            // fw.getCaptivePortal().chains().each(function(chain) {
            //     setChildren('Captive Portal', chain);
            // });
            // fw.getWebFilter().chains().each(function(chain) {
            //     setChildren('Web Filter', chain);
            // });

            Ext.Object.each(data, function(key, value) {
                root.children.push(value);
            });

            me.getView().down('tree').getStore().setRoot(root);
        }

    }
});
