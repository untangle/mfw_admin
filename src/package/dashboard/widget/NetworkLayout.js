Ext.define('Mfw.dashboard.widget.NetworkLayout', {
    extend: 'Ext.Container',
    alias: 'widget.widget-network-layout',

    viewModel: {
        data: {
            widget: null
        }
    },

    margin: 8,
    cls: 'mfw-widget',
    layout: 'vbox',
    minWidth: 600,

    items: [{
        xtype: 'toolbar',
        style: { background: 'transparent' },
        docked: 'top',
        shadow: false,
        padding: '0 8 0 16',
        items: [{
            xtype: 'container',
            style: 'font-weight: 100;',
            bind: {
                html: '<span style="color: #333; display: inline-block;">Network Layout</span>'
            }
        }, '->', {
            xtype: 'component',
            itemId: 'timer',
            margin: '0 5 0 0',
            hidden: true,
            bind: {
                hidden: '{widget.interval === 0}'
            }
        }, {
            iconCls: 'md-icon-refresh',
            ui: 'round',
            handler: 'reload'
        }]
    }, {
        xtype: 'container',
        flex: 1,
        // margin: 16,
        layout: {
            type: 'vbox'
        },
        cls: 'layout-widget',
        items: [{
            xtype: 'dataview',
            itemId: 'wans',
            flex: 1,
            padding: 8,
            inline: true,
            itemTpl: '<div class="item wan">' +
                     '<p>{name}</p>' +
                     '<div class="connector"></div></div>'
        }, {
            xtype: 'component',
            height: 2,
            cls: 'separator'
        }, {
            xtype: 'dataview',
            itemId: 'lans',
            padding: 8,
            inline: true,
            flex: 1,
            itemTpl: '<div class="item <tpl if="bridgedTo">bridged</tpl> <tpl if="type === \'WIFI\'">wifi</tpl>">' +
                     '<p>{name}</p>' +
                     '<div class="connector"></div></div>'
        }]
    }], // <tpl if="this.isBaby(age)"></tpl>
    listeners: {
        removed: function (widget) {
            if (widget.tout) {
                clearTimeout(widget.tout);
            }
        }
    },

    controller: {
        init: function (widget) {
            widget.tout = null;
            WidgetsPipe.add(widget);
        },

        loadData: function (cb) {
            var me = this,
                wans = me.getView().down('#wans'),
                lans = me.getView().down('#lans');

            me.getView().mask({xtype: 'loadmask'});

            Ext.Ajax.request({
                url: '/api/settings/network/interfaces',
                success: function (response) {
                    var interfaces = Ext.decode(response.responseText),
                        wansStore = [], lansStore = [];
                    Ext.Array.each(interfaces, function (intf) {
                        if (intf.configType === 'DISABLED') {
                            return;
                        }
                        if (intf.wan) {
                            wansStore.push(intf);
                        } else {
                            lansStore.push(intf);
                        }
                    });

                    wans.setStore(wansStore);
                    lans.setStore(lansStore);
                    if (cb) { cb(); }
                },
                failure: function () {
                    console.error('Unable to get data');
                },
                callback: function () {
                    me.getView().unmask();
                }
            });
        },

        reload: function () {
            var me = this, widget = me.getView();
            WidgetsPipe.addFirst(widget);
        }
    }
});
