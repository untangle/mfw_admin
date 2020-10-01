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
    minWidth: 500,

    padding: 0,

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
        layout: {
            type: 'vbox',
            align: 'center'
        },
        cls: 'layout-widget',
        items: [{
            xtype: 'container',
            flex: 1,
            layout: 'fit',
            items: [{
                xtype: 'dataview',
                itemId: 'wans',
                cls: 'wans',
                // store: 'interfaces',
                flex: 1,
                // inline: true,
                ripple: false,
                layout: {
                    type: 'hbox',
                    align: 'bottom'
                },
                padding: '5 0 23 0'
            }]
        }, {
            xtype: 'component',
            width: '100%',
            height: 5,
            cls: 'separator'
        }, {
            xtype: 'container',
            maxWidth: '100%',
            layout: 'fit',
            flex: 1,
            items: [{
                xtype: 'dataview',
                itemId: 'nonwans',
                cls: 'nonwans',
                // store: 'interfaces',
                flex: 1,
                inline: true,
                ripple: false,
                layout: {
                    type: 'hbox',
                    align: 'top'
                },
                padding: '23 0 5 0'
            }]
        }]
    }],
    listeners: {
        removed: function (widget) {
            if (widget.tout) {
                clearTimeout(widget.tout);
            }
        }
    },

    controller: {
        init: function (widget) {
            var me = this;
            widget.tout = null;
            WidgetsPipe.add(widget);

            Ext.Array.each(widget.query('dataview'), function (view) {
                view.setItemTpl(
                    '<div class="item <tpl if="wan">wan</tpl>">' +
                    '<p>{_icon} &nbsp; <a href="#settings/network/interfaces/{interfaceId}"><b>{name}</b></a></p>' +
                    '<tpl if="_status"><p class="ip">{_status.ip4Addr}</p></tpl>' +
                    '<p class="rate">' +
                    '<tpl if="wan">' +
                        '<i class="x-fa fa-arrow-down fa-gray"></i> <tpl if="_status"><b>{_status.rxByteRate/1000}</b><tpl else> 0 </tpl> KBps<br/>' +
                        '<i class="x-fa fa-arrow-up fa-gray"></i> <tpl if="_status"><b>{_status.txByteRate/1000}</b><tpl else> 0 </tpl> KBps' +
                    '<tpl else>' +
                        '<i class="x-fa fa-arrow-down fa-gray"></i> <tpl if="_status"><b>{_status.txByteRate/1000}</b><tpl else> 0 </tpl> KBps<br/>' +
                        '<i class="x-fa fa-arrow-up fa-gray"></i> <tpl if="_status"><b>{_status.rxByteRate/1000}</b><tpl else> 0 </tpl> KBps' +
                    '</tpl>' +
                    '</p>' +
                    '<div class="connector"></div>' +
                    '<div class="status">' +
                    '<tpl if="_status">' +
                        '<tpl if="_status.connected">' +
                            '<i class="x-fa fa-circle fa-green"></i>' +
                        '<tpl else>' +
                            '<i class="x-fa fa-circle fa-gray"></i>' +
                        '</tpl>' +
                    '<tpl else>' +
                        '<tpl if="type === \'WIFI\' || type === \'WWAN\'">' +
                            '<i class="x-fa fa-circle fa-green"></i>' +
                        '<tpl else>' +
                            '<i class="x-fa fa-minus fa-gray"></i>' +
                        '</tpl>' +
                    '</tpl>' +
                    '</div>' +
                    '</div>'
                );
            });

            if (!Ext.getStore('interfaces').isLoaded()) {
                me.reload();
            } else {
                me.setInterfaces();
            }

        },

        setInterfaces: function () {
            var me = this,
                wans = [],
                nonwans = [],
                widget = me.getView();

            Ext.getStore('interfaces').each(function (intf) {
                if (intf.get('hidden') || !intf.get('enabled')) {
                    return;
                }
                if (intf.get('wan')) {
                    wans.push(intf);
                } else {
                    nonwans.push(intf);
                }
            });
            widget.down('#wans').setStore(wans);
            widget.down('#nonwans').setStore(nonwans);
            WidgetsPipe.addFirst(widget);
        },

        /**
         * in this case load data just refreshes the interfaces status
         * reload interfaces has to be done manually from refresh button
         */
        loadData: function (cb) {
            Ext.getStore('interfaces').getStatus();
            if (cb) { cb(); }
        },

        // on reload set the widget wans/nonwans based on interfaces
        reload: function () {
            var me = this;
            Ext.getStore('interfaces').load(function () {
                me.setInterfaces();
            });
        }
    }
});
