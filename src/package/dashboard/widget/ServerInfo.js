Ext.define('Mfw.dashboard.widget.ServerInfo', {
    extend: 'Ext.Container',
    alias: 'widget.widget-server-info',

    margin: 8,
    cls: 'mfw-widget',
    layout: 'vbox',

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
                html: '<span style="color: #333; display: inline-block;">Server Information</span>'
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
        userCls: 'info-widget',
        itemId: 'data',
        margin: 16
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
        },

        getInfo: function () {
            var deferred = new Ext.Deferred(); // create the Ext.Deferred object

            Ext.Ajax.request({
                url: '/api/settings/system',
                success: function (response) {
                    var info = Ext.decode(response.responseText);
                    deferred.resolve(info);
                },
                failure: function () {
                    deferred.reject('Unable to get info!');
                }
            });
            return deferred.promise;
        },

        getSystem: function () {
            var deferred = new Ext.Deferred(); // create the Ext.Deferred object

            Ext.Ajax.request({
                url: '/api/status/system',
                success: function (response) {
                    var system = Ext.decode(response.responseText);
                    deferred.resolve(system);
                },
                failure: function () {
                    deferred.reject('Unable to get system!');
                }
            });
            return deferred.promise;
        },

        getHardware: function () {
            var deferred = new Ext.Deferred(); // create the Ext.Deferred object

            Ext.Ajax.request({
                url: '/api/status/hardware',
                success: function (response) {
                    var hardware = Ext.decode(response.responseText);
                    deferred.resolve(hardware);
                },
                failure: function () {
                    deferred.reject('Unable to get hardware!');
                }
            });
            return deferred.promise;
        },

        loadData: function (cb) {
            var me = this, info, system, hardware, html = '';
            me.getView().mask({xtype: 'loadmask'});
            Ext.Deferred.sequence([me.getInfo, me.getSystem, me.getHardware], me)
                .then(function (result) {
                    info = result[0];
                    system = result[1];
                    hardware = result[2];

                    html = '<table>' +
                           '<tr><td>Host: </td><td>' + info.hostName + '</td></tr>' +
                           '<tr><td>Domain: </td><td>' + info.domainName + '</td></tr>' +
                           '<tr><td>Timezone: </td><td>' + info.timeZone.displayName + '</td></tr>' +
                           '<tr><td>Up Time: </td><td>' + Renderer.uptime(system.uptime.total) + '</td></tr>' +
                           '<tr><td>CPU(s): </td><td>' + hardware.cpuinfo.processors[0].model_name + '</td></tr>' +
                           '<tr><td>Memory: </td><td>' + parseInt(system.meminfo.mem_total/1000, 10) + 'M (' + parseInt(system.meminfo.mem_free/1000, 10) + 'M free)</td></tr>' +
                           '</table>';
                    me.getView().down('#data').setHtml(html);
                    if (cb) { cb(); }
                }, function (error) {
                    console.warn('Unable to get info: ', error);
                })
                .always(function () {
                    me.getView().unmask();
                });
        },

        reload: function () {
            var me = this, widget = me.getView();
            WidgetsPipe.addFirst(widget);
        }
    }
});
