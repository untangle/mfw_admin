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

    padding: '0 16 8 16',

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
            layout: {
                type: 'hbox',
                align: 'bottom'
            },
            items: [{
                xtype: 'dataview',
                itemId: 'wans',
                cls: 'wans',
                store: 'interfaces',
                flex: 1,
                inline: true,
                ripple: false,
                layout: 'hbox',
                padding: '5 0 28 0'
            }]
        }, {
            xtype: 'component',
            width: '100%',
            height: 5,
            cls: 'separator'
        }, {
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'top'
            },
            items: [{
                xtype: 'dataview',
                itemId: 'lans',
                cls: 'nonwans',
                store: 'interfaces',
                flex: 1,
                inline: true,
                ripple: false,
                layout: 'hbox',
                padding: '28 0 5 0'
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
            widget.tout = null;
            WidgetsPipe.add(widget);

            Ext.Array.each(widget.query('dataview'), function (view) {
                view.setItemTpl(
                    '<div class="item <tpl if="wan">wan</tpl>">' +
                    '<p>{_icon} <a href="#settings/network/interfaces/{name}"><b>{name}</b></a> - {device}</p>' +
                    '<tpl if="_status"><p class="ip">{_status.ip4Addr}</p></tpl>' +
                    '<p class="rate">' +
                    '<i class="x-fa fa-arrow-down fa-gray"></i> <tpl if="_status"><b>{_status.rxByteRate/1000}</b><tpl else> 0 </tpl> Kbps<br/>' +
                    '<i class="x-fa fa-arrow-up fa-gray"></i> <tpl if="_status"><b>{_status.txByteRate/1000}</b><tpl else> 0 </tpl> Kbps' +
                    '</p>' +
                    '<div class="connector">' +
                       '<tpl if="_status">' +
                           '<tpl if="_status.connected">' +
                                '<i class="fas fa-exchange-alt fa-rotate-90"></i>' +
                                '<tpl else>' +
                                '<i class="fas fa-ban" style="color: tomato;"></i>' +
                            '</tpl>' +
                        '<tpl else>' +
                        '<i class="fas fa-ban" style="color: tomato;"></i>' +
                       '</tpl>' +
                    '</div>' +
                    '</div>'
                );
            });
        },


        /**
         * in this case load data just refreshes the interfaces status
         * reload interfaces has to be done manually from refresh button
         */
        loadData: function (cb) {
            Ext.getStore('interfaces').getStatus();
            if (cb) { cb(); }
        },

        reload: function () {
            var me = this, widget = me.getView();
            WidgetsPipe.addFirst(widget);
        }
    }
});
