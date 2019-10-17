Ext.define('Mfw.dashboard.widget.ServerInfo', {
    extend: 'Ext.Container',
    alias: 'widget.widget-server-info',

    margin: 8,
    cls: 'mfw-widget',
    layout: 'vbox',

    maxWidth: 320,

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
                widget.tout = null;
            }
            if (widget.uptimeInterval) {
                clearInterval(widget.uptimeInterval);
                widget.uptimeInterval = null;
            }
        }
    },

    controller: {
        init: function (widget) {
            widget.tout = null;
            WidgetsPipe.add(widget);
        },

        getInfo: function () {
            var deferred = new Ext.Deferred();

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
            var deferred = new Ext.Deferred();

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
            var deferred = new Ext.Deferred();

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

        getBuild: function () {
            var deferred = new Ext.Deferred(); // create the Ext.Deferred object

            Ext.Ajax.request({
                url: '/api/status/build',
                success: function (response) {
                    var build = Ext.decode(response.responseText);
                    deferred.resolve(build);
                },
                failure: function () {
                    deferred.reject('Unable to get build!');
                }
            });
            return deferred.promise;
        },

        getLicense: function () {
            var deferred = new Ext.Deferred(); // create the Ext.Deferred object

            Ext.Ajax.request({
                url: '/api/status/license',
                success: function (response) {
                    var license = Ext.decode(response.responseText);
                    deferred.resolve(license);
                },
                failure: function () {
                    deferred.reject('Unable to get license!');
                }
            });
            return deferred.promise;
        },

        loadData: function (cb) {
            var me = this,
                widget = me.getView(),
                info,
                system,
                hardware,
                build,
                license,
                licenseRow,
                html = '';

            if (widget.uptimeInterval) {
                clearInterval(widget.uptimeInterval);
                widget.uptimeInterval = null;
            }

            me.getView().mask({xtype: 'loadmask'});
            Ext.Deferred.sequence([me.getInfo, me.getSystem, me.getHardware, me.getBuild, me.getLicense], me)
                .then(function (result) {
                    info = result[0];
                    system = result[1];
                    hardware = result[2];
                    build = result[3];
                    license = result[4];

                    if (!license || license.list.length === 0) {
                        licenseRow = '<tr><td></td><td style="color: red;">Not licensed</td></tr>';
                    } else {
                        licenseRow = '<tr><td>Licensed for: </td><td>' + license.list[0].seats + ' Mbps</td></tr>';
                    }

                    html = '<table style="font-size: 12px;" cellspacing="0" cellpadding="0">' +
                           '<tr><td style="width: 100px;">Board: </td><td>' + (Map.boards[hardware.boardName] || hardware.boardName) + '</td></tr>' +
                           '<tr><td>Build: </td><td>' + build.pretty_name + '</td></tr>' +
                           '<tr><td>Host: </td><td>' + info.hostName + '</td></tr>' +
                           '<tr><td>Domain: </td><td>' + info.domainName + '</td></tr>' +
                           '<tr><td>Time zone: </td><td>' + info.timeZone.displayName + '</td></tr>' +
                           '<tr><td>Up Time: </td><td id="uptime">' + Renderer.uptime(system.uptime.total) + '</td></tr>' +
                           '<tr><td>CPU(s): </td><td>' + hardware.cpuinfo.processors[0].model_name + '</td></tr>' +
                           '<tr><td>Memory: </td><td>' + parseInt(system.meminfo.mem_total/1000, 10) + 'M</td></tr>' +
                           licenseRow +
                           '</table>';
                    me.getView().down('#data').setHtml(html);

                    // start uptime counter
                    me.setUptime(Math.round(system.uptime.total));

                    if (cb) { cb(); }
                }, function (error) {
                    console.warn('Unable to get info: ', error);
                })
                .always(function () {
                    me.getView().unmask();
                });
        },

        setUptime: function (initialUptime) {
            var me = this, widget = me.getView();

            document.getElementById('uptime').innerHTML = Renderer.uptime(initialUptime);
            me.initialUptime = initialUptime;

            if (!widget.uptimeInterval) {
                widget.uptimeInterval = setInterval(function () {
                    me.setUptime(me.initialUptime + 1);
                }, 1000);
            }
        },

        reload: function () {
            var me = this, widget = me.getView();
            WidgetsPipe.addFirst(widget);
        }
    }
});
