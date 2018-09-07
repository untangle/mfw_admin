Ext.define('Mfw.settings.firewall.FilterRules', {
    // extend: 'Mfw.cmp.grid.MasterGrid',
    extend: 'Ext.grid.Grid',
    alias: 'widget.mfw-settings-firewall-filter-rules',

    title: 'Filter Rules'.t(),

    // layout: 'fit',

    viewModel : {
        data: {
            record: null,
            selectedChain: null
        },
        formulas: {
            chainDetails: function (get) {
                var html = '<div>Type<br/><span>' + (get('selectedChain.type') || '-') + '</span></div>' +
                           '<div>Hook<br/><span>' + (get('selectedChain.hook') || '-') + '</span></div>' +
                           '<div>Priority<br/><span>' + (Ext.isNumber(get('selectedChain.priority')) ? get('selectedChain.priority') :  '-') + '</span></div>';
                return html;
            }
        }

    },

    emptyText: 'No Data!',

    plugins: {
        // this is the plugin which enables generic grids data editing
        grideditable: true
    },

    scrollable: true,
    // config: {
    //     recordModel: 'Mfw.model.Table'
    // },

    // bind: '{record.chains.0.rules}',

    items: [{
        xtype: 'toolbar',
        docked: 'top',
        padding: '0 8',
        items: [{
            xtype: 'button',
            itemId: 'chainsmenu',
            // ui: 'action',
            // iconCls: 'md-icon-filter-list',
            menu: {
                // anchor: true,
            }
        }, {
            xtype: 'component',
            itemId: 'chaindetails',
            userCls: 'chain',
            style: 'line-height: 1.4; color: #999; font-size: 10px;',
            bind: {
                html: '{chainDetails}'
            },
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
            // bind: {
            //     disabled: '{!selectedChain.editable}'
            // }
        }, {
            xtype: 'button',
            iconCls: 'md-icon-more-vert',
            arrow: false,
            menu: {
                anchor: true,
                defaults: {
                    hideOnClick: true,
                    menuExpandDelay: 0,
                    menuHideDelay: 0
                    // bind: {
                    //     hidden: '{!selectedChain.editable}'
                    // }
                },
                items: [
                    { xtype: 'component', html: 'Chain', style: 'font-size: 14px; font-weight: bold;' },
                    { text: 'Edit', iconCls: 'md-icon-edit' },
                    { text: 'Delete', iconCls: 'md-icon-delete' },
                    { text: 'Set as Default', iconCls: 'md-icon-star' },
                    '-',
                    { xtype: 'component', html: 'Rules', style: 'font-size: 14px; font-weight: bold;' },
                    { text: 'New', iconCls: 'md-icon-add' },
                    { text: 'Import', iconCls: 'md-icon-call-received' },
                    { text: 'Export', iconCls: 'md-icon-call-made' },
                    { text: 'Reload', iconCls: 'md-icon-refresh' }
                ]
            }
        }]
    }],

    columns: [{
        text: 'Id'.t(),
        dataIndex: 'ruleId',
        width: 50,
        align: 'right',
        // hidden: true,
        renderer: function (v) {
            return '#' + v;
        }
    }, {
        text: 'Enabled',
        align: 'center',
        width: 55,
        dataIndex: 'enabled',
        cell: {
            xtype: 'widgetcell',
            widget: {
                xtype: 'togglefield',
                margin: '0 10',
                // disabled: true,
                // bind: {
                //     disabled: '{record._deleteSchedule}'
                // }
            }
        },
        editable: true,
        editor: {
            xtype: 'togglefield',
            // boxLabel: 'Enabled'.t()
        }
    }, {
        text: 'Description',
        dataIndex: 'description',
        minWidth: 400,
        editable: true
        // flex: 1
    }, {
        text: 'Conditions'.t(),
        dataIndex: 'conditions()',
        flex: 1,
        cell: {
            userCls: 'ctip',
            bodyStyle: {
                padding: 0
            },
            encodeHtml: false
        },
        renderer: function (conditions, record) {
            var strArr = [];
            record.conditions().each(function (c) {
                strArr.push('<div class="condition"><span>' + Ext.getStore('ruleconditions').findRecord('type', c.get('type')).get('name') + '</span>' +
                       (c.get('op') === "IS" ? ' = ' : ' &ne; ') + '<strong>' + c.get('value') + '</strong></div>');
            });
            if (strArr.length > 0) {
                return strArr.join(' <i class="x-fa fa-circle fa-small" style="font-size: 10px; color: #999; line-height: 12px;"></i> ');
            } else {
                return '<span style="color: #999; font-style: italic; font-size: 11px; padding: 0 10px;">No Conditions!</span>'
            }
        },
        // editable: true,
        // editor: 'collection'
    }],

    store: {},

    listeners: {
        initialize: 'onInitialize'
    },

    controller: {
        onInitialize: function (grid) {

            var me = this, table;
            me.table = table = new Mfw.model.Table();
            table.getProxy().setApi({
                read: Util.api + '/settings/firewall/tables/filter-rules',
                update: Util.api + '/settings/firewall/tables/filter-rules'
            });


            var tbar = grid.getTitleBar();

            tbar.setPadding('0 8');
            tbar.add([{
                xtype: 'button',
                iconCls: 'x-fa fa-bars',
                align: 'left',
                margin: '0 8 0 0',
                arrow: false,
                menu: {
                    anchor: true,
                    items: [
                        { text: 'New Chain'.t(), iconCls: 'md-icon-add', menuHideDelay: 0 },
                        '-',
                        { text: 'Import All', iconCls: 'md-icon-call-received' },
                        { text: 'Export All', iconCls: 'md-icon-call-made' },
                        { text: 'Reload', iconCls: 'md-icon-refresh', handler: 'onLoad' },
                        { text: 'Load Defaults', iconCls: 'md-icon-sync', handler: 'onReset' }
                    ]
                }
            }, {
                xtype: 'button',
                text: 'Save All',
                iconCls: 'md-icon-save',
                align: 'right',
                handler: 'onSaveAll'
            }]);

            me.onLoad();
        },


        onLoad: function () {
            var me = this, grid = me.getView(), record;
            grid.mask();
            this.table.load({
                success: function (record) {
                    me.record = record;
                    me.selectChain();
                    me.updateChainsMenu();
                },
                callback: function () {
                    grid.unmask();
                }
            });
        },

        onReset: function () {
            var me = this,
                api = me.table.getProxy().getApi();

            Ext.Msg.confirm('<i class="x-fa fa-exclamation-triangle"></i> Warning',
                'All existing <strong>' + this.getView().getTitle() + '</strong> settings will be replace with defauts.<br/>Do you want to continue?',
            function (answer) {
                if (answer === 'yes') {
                    // update proxy api to support reset
                    me.table.getProxy().setApi({ read: api.read.replace('/settings/', '/defaults/') });
                    // revert api to it's default values
                    me.table.load(function (records, operation, success) {
                        me.table.getProxy().setApi(api);
                        if (!success) {
                            console.error('Unable to fetch defaults!')
                        }
                    })
                }
            });
        },


        selectChain: function (name) {
            var me = this;
            if (!name) {
                me.selectedChain = me.record.chains().findRecord('default', true) || me.record.chains().findRecord('base', true);
            } else {
                me.selectedChain = me.record.chains().findRecord('name', name);
            }
            me.getView().setStore(me.selectedChain.rules());

            me.getViewModel().set('selectedChain', me.selectedChain);

            this.getView().down('#chainsmenu').setText(me.selectedChain.get('name'));

            // this.getView().down('#chaindetails').setRecord(me.selectedChain);
        },

        updateChainsMenu: function () {
            var me = this, chainsMenu = [];
            this.record.chains().each(function (chain) {
                chainsMenu.push({
                    text: chain.get('name') + ' / ' + chain.get('description'),
                    // key: chain.get('name'),
                    handler: function (item) { item.up('menu').hide(); me.selectChain(chain.get('name')) }
                });
            });
            this.getView().down('#chainsmenu').getMenu().setItems(chainsMenu);
        },

        onSaveAll: function () {
            var me = this, grid = me.getView();
            // console.log(me.table.isDirty());
            grid.mask();
            grid.getSelectable().deselectAll();
            me.table.save({
                success: function () {
                    console.log('success');
                    Ext.toast('All Filter Rules saved!', 3000);
                },
                callback: function () {
                    grid.unmask();
                }
            })
        }

    }
})
