Ext.define('Mfw.dashboard.widget.CpuLoad', {
    extend: 'Ext.Container',
    alias: 'widget.widget-cpu-load',

    viewModel: {
        data: {
            current: {
                value: '-.--',
                time: 'now'
            }
        }
    },

    config: {
        display: 'load1'
    },

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
                html: '<span style="color: #333; display: inline-block;">CPU Load</span>'
            }
        }, '->', {
            xtype: 'segmentedbutton',
            userCls: 'button-tabs',
            allowMultiple: false,
            defaults: {
                ripple: false
            },
            activeItem: 0,
            items: [
                { text: '1m', value: 0, pressed: true },
                { text: '5m', value: 1 },
                { text: '15m', value: 2 }
            ],
            listeners: {
                change: 'onDisplayChange'
            }
        }]
    }, {
        xtype: 'container',
        layout: 'center',
        height: 120,
        items: [{
            xtype: 'component',
            itemId: 'current',
            cls: 'cpu-widget',
            bind: {
                html: '<p>{current.value}<br><span>{current.time}</span></p>'
            }
        }]
    }, {
        xtype: 'component',
        flex: 1,
        // height: 272,
        itemId: 'chart'
    }],
    listeners: {
        removed: function (widget) {
            if (widget.timeout) {
                clearTimeout(widget.timeout);
            }
        },
        painted: 'onPainted'
    },

    controller: {
        init: function (widget) {
            widget.timeout = null;
            widget.dataHistory = {
                load1: [null, null, null, null, null, null, null, null, null, null, null, 0],
                load5: [null, null, null, null, null, null, null, null, null, null, null, 0],
                load15: [null, null, null, null, null, null, null, null, null, null, null, 0]
            };
        },

        onPainted: function (widget) {
            var me = this;

            if (me.chart) { return; }

            me.chart = Highcharts.chart(widget.down('#chart').innerElement.dom, {
                chart: {
                    marginLeft: 0,
                    marginRight: 0,
                    spacingBottom: 8,
                    marginTop: 15,
                    type: 'areaspline',
                    animation: false
                },
                title: { text: null },
                exporting: { enabled: false },
                credits: { enabled: false },
                legend: { enabled: false },
                tooltip: { enabled: false },
                xAxis: {
                    type: 'datetime',
                    startOnTick: false,
                    endOnTick: false,
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    },
                    dateTimeLabelFormats: {
                        second: '%l:%M:%S %p',
                        minute: '%l:%M %p',
                        hour: '%l:%M %p',
                        day: '%Y-%m-%d',
                        week: '%e. %b',
                        month: '%b \'%y',
                        year: '%Y'
                    }
                },
                yAxis: {
                    // max: 0.5,
                    // visible: true,
                    gridLineWidth: 1,
                    gridLineDashStyle: 'ShortDot',
                    title: { text: null },
                    labels: {
                        align: 'left',
                        style: {
                            fontSize: '10px'
                        },
                        x: 5,
                        y: -5
                    }
                },
                plotOptions: {
                    areaspline: {
                        lineWidth: 1,
                        marker: { enabled: false, radius: 1 },
                        states: { hover: { enabled: true, lineWidthPlus: 0, marker: { radius: 1 } } },
                        color: '#519839',
                        fillColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, Highcharts.Color('#519839').setOpacity(0.5).get('rgba')],
                                [1, Highcharts.Color('#519839').setOpacity(0.2).get('rgba')]
                            ]
                        }
                    },
                    series: {
                        pointStart: Ext.Date.subtract(Util.serverToClientDate(new Date()), Ext.Date.MINUTE, 1).getTime(),
                        pointInterval: 6 * 1000,
                        point: {
                            events: {
                                mouseOver: function () {
                                    me.setCurrent(this.x, this.y);
                                }
                            }
                        },
                        events: {
                            mouseOut: function () {
                                me.setCurrent();
                            }
                        }
                    }
                },
                series: [{
                    name: 'load1',
                    data: widget.dataHistory.load1
                }, {
                    name: 'load5',
                    data: widget.dataHistory.load5,
                    visible: false
                }, {
                    name: 'load15',
                    data: widget.dataHistory.load15,
                    visible: false
                }]
            });
            me.loadData();
        },

        onDisplayChange: function (btn, value) {
            var me = this, i;
            if (!me.chart) { return; }

            for (i = 0; i <= 2; i += 1) {
                if (i !== value) {
                    me.chart.series[i].setVisible(false);
                } else {
                    me.chart.series[i].setVisible(true);
                }
            }

            me.setCurrent();
        },


        setCurrent: function (time, value) {
            var me = this, widget = me.getView(),
                vm = me.getViewModel(),
                serie, point;

            if (!time && !value) {
                serie = me.chart.series[widget.down('segmentedbutton').getValue()];
                point = serie.data[serie.data.length - 1];
                time = point.x; value = point.y;
                widget.down('#current').removeCls('oldval');
            } else {
                widget.down('#current').addCls('oldval');
            }

            vm.set('current', {
                value: value.toFixed(2),
                time: Renderer.time(time)
            });
        },

        loadData: function () {
            var me = this, widget = me.getView();

            if (!me.chart) { return; }

            Ext.Ajax.request({
                url: '/api/status/system',
                success: function (response) {
                    var data = Ext.decode(response.responseText);



                    Ext.Array.removeAt(widget.dataHistory.load1, 0);
                    widget.dataHistory.load1.push(data.loadavg.last1min);

                    Ext.Array.removeAt(widget.dataHistory.load5, 0);
                    widget.dataHistory.load5.push(data.loadavg.last5min);

                    Ext.Array.removeAt(widget.dataHistory.load15, 0);
                    widget.dataHistory.load15.push(data.loadavg.last15min);

                    me.chart.series[0].addPoint(data.loadavg.last1min, false, true, true);
                    me.chart.series[1].addPoint(data.loadavg.last5min, false, true, true);
                    me.chart.series[2].addPoint(data.loadavg.last15min, false, true, true);

                    me.chart.redraw(true);

                    me.setCurrent();

                    widget.timeout = setTimeout(function() {
                        me.loadData();
                    }, 5000);
                },
                failure: function () {
                    console.error('Unable to get data');
                }
            });
        }
    }
});
