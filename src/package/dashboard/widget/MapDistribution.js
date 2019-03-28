Ext.define('Mfw.dashboard.widget.MapDistribution', {
    extend: 'Ext.Container',
    alias: 'widget.widget-map-distribution',

    viewModel: {
        data: {
            widget: null
        }
    },

    minWidth: 700,
    margin: 8,
    cls: 'mfw-widget',
    layout: 'vbox',

    items: [{
        xtype: 'toolbar',
        style: { background: 'transparent' },
        docked: 'top',
        // floated: true,
        shadow: false,
        padding: '0 8 0 16',
        items: [{
            xtype: 'container',
            style: 'font-weight: 100;',
            bind: {
                html: '<span style="color: #333; display: inline-block;">Map Distribution by Country</span>'
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
        xtype: 'component',
        height: 272,
        itemId: 'map'
    }],
    listeners: {
        removed: function (widget) {
            if (widget.tout) {
                clearTimeout(widget.tout);
            }
        },
        painted: 'onPainted'
    },

    controller: {
        init: function (widget) {
            widget.tout = null;
            // WidgetsPipe.add(widget);
        },

        onPainted: function (widget) {
            var me = this;
            me.chart = Highcharts.mapChart(widget.down('#map').innerElement.dom, {
                chart: {
                    map: 'custom/world',
                    margin: [0, 8, 8, 8],
                    spacing: 0,
                    // borderWidth: 1
                },
                title: { text: null },
                mapNavigation: {
                    enabled: true,
                    enableButtons: false
                },
                exporting: { enabled: false },
                credits: { enabled: false },
                colors: [
                    'rgba(81,152,57,0.2)',
                    'rgba(81,152,57,0.4)',
                    'rgba(81,152,57,0.6)',
                    'rgba(81,152,57,0.8)',
                    'rgba(81,152,57,1)'
                ],
                colorAxis: {
                    dataClasses: [
                        { to: 5, color: 'rgba(81,152,57,0.2)' },
                        { from: 5, to: 10, color: 'rgba(81,152,57,0.4)' },
                        { from: 10, to: 20, color: 'rgba(81,152,57,0.6)' },
                        { from: 20, to: 50, color: 'rgba(81,152,57,0.8)' },
                        { from: 50, color: 'rgba(81,152,57,1)' }
                    ]
                },
                legend: {
                    title: {
                        text: 'Sessions number',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                        }
                    },
                    align: 'left',
                    verticalAlign: 'bottom',
                    floating: true,
                    layout: 'vertical',
                    valueDecimals: 0,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)',
                    symbolRadius: 0,
                    symbolHeight: 14
                },
                series: [{
                    name: 'Sessions',
                    data: [],
                    joinBy: ['iso-a2', 'code'],
                    animation: false,
                    shadow: false
                }]
            });
            WidgetsPipe.add(widget);
        },

        loadData: function (cb) {
            // var sessionStore = Ext.getStore('sessions');
            // sessionStore.load(function(records, operation, success) {
            //     console.log(records);
            // });
            var me = this, dataMap = {}, data = [];
            me.chart.series[0].setData([]);
            me.getView().mask({xtype: 'loadmask'});
            Ext.Ajax.request({
                url: '/api/status/sessions',
                success: function (response) {
                    var sessions = Ext.decode(response.responseText);
                    Ext.Array.each(sessions, function (session) {
                        if (!dataMap[session.server_country]) {
                            dataMap[session.server_country] = 1;
                        } else {
                            dataMap[session.server_country] += 1;
                        }
                    });
                    Ext.Object.each(dataMap, function (key, value) {
                        data.push({
                            code: key,
                            value: parseInt(value, 10),
                            name: key
                        });
                    });
                    me.chart.series[0].setData(data);
                    if (cb) { cb(); }
                },
                failure: function () {
                    console.error('Unable to get sessions');
                },
                callback: function () {
                    me.getView().unmask();
                }
            });

        },

        reload: function () {
            var me = this;
            WidgetsPipe.add(me.getView());
        }
    }


});
