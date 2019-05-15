Ext.define('Mfw.reports.ChartController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.chart',

    onPainted: function (view) {
        var me = this;

        if (view.chart) { return; }

        // Highcharts.setOptions({
        //     chart: {
        //         style: {
        //             fontFamily: 'Roboto, sans-serif'
        //         }
        //     }
        // });

        // add the chart component
        view.chart = new Highcharts.stockChart(view.down('#chart').innerElement.dom, {
            chart: {
                animation: false,
                type: 'pie', // to avoid initial xAxis cut-off for pies
                backgroundColor: 'transparent',
                // width: '100%',
                // height: '100%',
                events: {
                    selection: function (event) {
                        // only has effect on reports and not widgets
                        if (view.up('report')) {
                            var store = view.up('report').down('#dataPanel').down('grid').getStore();
                            store.clearFilter();
                            if (!event.resetSelection) {
                                store.filterBy(function (rec) {
                                    return (rec.get('time_trunc') > event.xAxis[0].min && rec.get('time_trunc') < event.xAxis[0].max);
                                });
                            }
                        }
                    }
                }
            },
            lang: {
                noData: 'No Data!',
                loading: ''
            },
            exporting: {
                enabled: false,
                buttons: {
                    contextButton: {
                        enabled: false // disable default contextButton
                    },
                    testButton: {
                        text: 'Refresh'.t(),
                        onclick: function() {
                            me.loadData();
                        }
                    },
                    // timerangeButton: {
                    //     text: 'Apply this timerange'.t(),
                    //     align: 'center',
                    //     enabled: true, // this updates based on zoom selection
                    //     y: 10,
                    //     onclick: function() {
                    //         Ext.fireEvent('timerangechange', me.chart.selectedrange);
                    //     }
                    // }
                }
            },
            navigator: { enabled: false },
            rangeSelector : { enabled: false },
            scrollbar: { enabled: false },
            credits: { enabled: false },
            title: {
                align: 'left',
                text: null,
                style: {
                    fontSize: '24px',
                    fontWeight: 400
                }
                // useHtml: true
            },

            subtitle: {
                align: 'left',
                text: null,
                style: {
                    fontSize: '14px',
                    color: '#777'
                },
            },

            noData: {
                style: {
                    fontSize: '16px',
                    fontWeight: '100',
                    color: '#555',
                    textAlign: 'center'
                }
            },

            tooltip: {
                enabled: true,
                animation: false,
                outside: true,
                shared: true,
                followPointer: true,
                split: false,
                // distance: 30,
                padding: 10,
                hideDelay: 0,
                backgroundColor: 'rgba(247, 247, 247, 0.95)',
                useHTML: true,
                xDateFormat: '%A, %b %e, %l:%M %p',
                headerFormat: '<p style="font-weight: bold; margin: 0 0 5px 0; color: #555;">{point.key}</p>'
            },
            legend: {
                enabled: true,
                itemStyle: {
                    fontSize: '11px',
                    fontWeight: 300,
                    width: '100px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                },
            },
            // loading: {
            //     style: {
            //         opacity: 1
            //     }
            // },
            // xAxis: {
            //     visible: false
            // },
            yAxis: {
                opposite: false,
                allowDecimals: false,
                title: {
                    align: 'high',
                    offset: 0,
                    reserveSpace: false,
                    y: 3,
                    rotation: 0,
                    textAlign: 'left',
                    style: {
                        color: '#555',
                        fontSize: '12px',
                        fontWeight: 600
                    }
                }
            },
            plotOptions: {
                series: {
                    animation: false
                },
                pie: {
                    borderColor: '#fafafa'
                }
            }
        });

    },

    init: function (view) {
        var me = this;
        view.on('painted', me.onPainted);
    },

    onResize: function (view) {
        if (view.chart) {
            view.chart.reflow();
        }
    },

    loadData: function (cb) {
        var me = this,
            record = me.getViewModel().get('record'),
            view = me.getView().up('report') || me.getView().up('widget-report'),
            chart = me.getView().chart,
            since = ReportsUtil.computeSince(me.getViewModel().get('route')),
            userConditions, sinceCondition;

        if (!record) { return; }

        /**
         * because initially the base chart may not be rendered
         * defer the loading till the chart is available
         */
        if (!chart) {
            Ext.defer(function () {
                me.loadData(cb);
            }, 200, me);
            return;
        }

        // remove existing since condition
        userConditions = record.userConditions();
        sinceCondition = userConditions.findBy(function (c) {
            return c.get('column') === 'time_stamp' && c.get('operator') === 'GT';
        });
        if (sinceCondition >= 0) {
            userConditions.removeAt(sinceCondition);
        }

        // add updated since
        record.userConditions().add({
            column: 'time_stamp',
            operator: 'GT',
            value: since
        });

        while (chart.series.length > 0) {
            chart.series[0].remove(true);
        }

        view.mask({xtype: 'loadmask'});
        chart.zoomOut();
        chart.showLoading();
        ReportsUtil.fetchReportData(record, function (data) {
            chart.hideLoading();
            view.unmask();

            if (!Ext.isArray(data)) { return; }
            // remove first and last data items as they are empty
            if (record.get('type') === 'SERIES' || record.get('type') === 'CATEGORIES_SERIES') {
                data.shift(); data.pop();
            }
            me.setData(data);
            // me.getViewModel().set('data', data);
            if (cb) { cb(data); }
        });
    },


    update: function () {
        var me = this,
            isWidget = me.getViewModel().get('widget') ? true : false,
            record = me.getViewModel().get('record'),
            rendering = record.getRendering(),
            plotOptions = {},
            colors = rendering.get('colors') ? rendering.get('colors').replace(/ /g, '').split(',') : Highcharts.getOptions().colors, // default colors
            chart = me.getView().chart, settings, color;

        if (!chart) { return; }

        if (record.get('type') === 'SERIES' || record.get('type') === 'CATEGORIES_SERIES') {

            if (chart.series) {
                Ext.Array.each(chart.series, function (serie, idx) {
                    // normally the number of series needs to match the nimber of defined colors
                    // in case colors array is smaller than number of series, the colors should repeat
                    color = colors[idx] || colors[idx % colors.length];
                    serie.update({
                        color: color,
                        lineColor: color,
                        fillColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, Highcharts.Color(color).setOpacity(rendering.get('topAreaOpacity')).get('rgba')],
                                [1, Highcharts.Color(color).setOpacity(rendering.get('bottomAreaOpacity')).get('rgba')]
                            ]
                        },
                    }, false);
                });
            }

            Ext.Array.each(['line', 'spline', 'area', 'areaspline'], function (type) {
                plotOptions[type] = {
                    // step: true,
                    lineWidth: rendering.get('lineWidth'),
                    stacking: rendering.get('stacking') === 'none' ? undefined : rendering.get('stacking'),
                    dashStyle: rendering.get('dashStyle'),
                    dataGrouping: {
                        enabled: rendering.get('dataGroupingEnabled'),
                        approximation: rendering.get('dataGroupingApproximation'),
                        groupPixelWidth: rendering.get('dataGroupingFactor'),
                        dateTimeLabelFormats: {
                            millisecond: ['%A, %b %e, %l:%M:%S.%L %p', '%A, %b %e, %l:%M:%S.%L %p', ' - %l:%M:%S.%L %p'],
                            second: ['%A, %b %e, %l:%M:%S %p', '%A, %b %e, %l:%M:%S %p', ' - %l:%M:%S %p'],
                            minute: ['%A, %b %e, %l:%M %p', '%A, %b %e, %l:%M %p', ' - %l:%M %p'],
                            hour: ['%A, %b %e, %l:%M %p', '%A, %b %e, %l:%M %p', ' - %l:%M %p'],
                            day: ['%A, %b %e, %Y', '%A, %b %e', ' - %A, %b %e, %Y'],
                            week: ['Week from %A, %b %e, %Y', '%A, %b %e', ' - %A, %b %e, %Y'],
                            month: ['%B %Y', '%B', ' - %B %Y'],
                            year: ['%Y', '%Y', ' - %Y']
                        }
                    }
                };
            });

            plotOptions.column = {
                stacking: rendering.get('stacking') === 'none' ? undefined : rendering.get('stacking'),
                colorByPoint: false,
                dataGrouping: {
                    enabled: rendering.get('dataGroupingEnabled'),
                    approximation: rendering.get('dataGroupingApproximation'),
                    pointPadding: 0.2,
                    groupPixelWidth: rendering.get('dataGroupingFactor') * chart.series.length
                }
            };

            settings = {
                chart: {
                    type: rendering.get('type'),
                    zoomType: 'x',
                    marginBottom: undefined,
                    options3d: {
                        enabled: false
                    }
                },
                colors: colors,
                plotOptions: plotOptions,
                legend: {
                    layout: 'horizontal',
                    floating: false,
                    align: 'center',
                    verticalAlign: 'bottom',
                    itemMarginTop: 0,
                    itemMarginBottom: 0
                },
                tooltip: {
                    formatter: function (tooltip) {
                        if (rendering.get('stacking') !== 'none') {
                            return tooltip.defaultFormatter.call(this, tooltip);
                        }

                        // !!! Sorting !!! already made on the backend
                        // var items = this.points;
                        // if (items) {
                        //     items.sort(function(a, b) {
                        //         return ((a.y < b.y) ? -1 : ((a.y > b.y) ? 1 : 0));
                        //     });
                        //     items.reverse();
                        // }

                        return tooltip.defaultFormatter.call(this, tooltip);
                    },
                    pointFormatter: function () {
                        var str = '<span style="color: ' + this.color + '; font-size: 16px;">\u25A0</span>' +
                                  '<span style="font-weight: bold;">' + Renderer.shortenText(this.series.name) + '</span>';
                        if (record.get('units') === 'bytes' || record.get('units') === 'bytes/s') {
                            str += '&rarr; ' + Renderer.bytesRenderer(this.y) + record.get('units');
                        } else {
                            str += '&rarr; <b>' + this.y + '</b> ' + (record.get('units') || '');
                        }
                        return str + '<br/>';
                    }
                },
                xAxis: {
                    visible: true,
                    categories: undefined,
                    dateTimeLabelFormats: {
                        second: '%l:%M:%S %p',
                        minute: '%l:%M %p',
                        hour: '%l:%M %p',
                        day: '%Y-%m-%d',
                        week: '%e. %b',
                        month: '%b \'%y',
                        year: '%Y'
                    },
                    labels: {
                        autoRotation: false
                    }
                },
                yAxis: {
                    visible: true,
                    title: {
                        text: record.get('units') || ''
                    },
                    labels: {
                        formatter: function() {
                            var str;
                            if (record.get('units') === 'bytes' || record.get('units') === 'bytes/s') {
                                str = Renderer.bytesRenderer(this.value);
                            } else {
                                str = this.value;
                            }
                            return str;
                        }
                    }
                }

            };
        }


        if (record.get('type') === 'CATEGORIES') {
            var categs = [];

            if (!chart.series[0]) { return; }

            settings = {
                chart: {
                    type: rendering.get('type'),
                    zoomType: undefined,
                    marginBottom: 16,
                    options3d: {
                        enabled: rendering.get('3dEnabled'),
                        alpha: rendering.get('3dAlpha'),
                        beta: 0
                    }
                },
                colors: colors,
                plotOptions: {
                    pie: {
                        innerSize: rendering.get('donutInnerSize') + '%',
                        borderWidth: rendering.get('borderWidth'),
                        edgeColor: '#fafafa',
                        edgeWidth: rendering.get('borderWidth'),
                        depth: isWidget ? 20 : rendering.get('3dDepth'), // if widget use a smaller depth
                        size: '90%',
                        dataLabels: {
                            distance: 10,
                            formatter: function () { return Renderer.shortenText(this.point.name); }
                        }
                    },
                    column: {
                        colorByPoint: true
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'top',
                    floating: true,
                    itemMarginTop: 3,
                    itemMarginBottom: 3,
                    x: 5,
                    y: 5,
                    labelFormatter: function () { return '<strong>' + Renderer.shortenText(this.name) + '</strong>'; }
                },
                xAxis: {
                    visible: rendering.get('type') === 'column',
                    // categories: categs
                },
                yAxis: {
                    visible: rendering.get('type') === 'column'
                }
            };
        }

        // settings.title = {
        //     text: record.get('name')
        // };

        // settings.subtitle = {
        //     text: record.get('description')
        // };

        chart.update(settings, true);

    },

    setData: function (data) {
        var me = this, chart = me.getView().chart, normalizedData = [],
            isWidget = me.getViewModel().get('widget') ? true : false,
            record = me.getViewModel().get('record');
        if (!chart) { return; }

        while (chart.series.length > 0) {
            chart.series[0].remove(true);
        }

        if (record.get('type') === 'SERIES' || record.get('type') === 'CATEGORIES_SERIES') {
            var series = {}, name;

            // Ext.Array.sort(data, function (a, b) {
            //     if (a.time_trunc < b.time_trunc) { return -1; }
            //     if (a.time_trunc > b.time_trunc) { return 1; }
            //     return 0;
            // });

            Ext.Array.each(data, function (d) {
                Ext.Object.each(d, function (key, val) {
                    if (key !== 'time_trunc') {
                        name = key;
                        if (record.get('category') === 'Interfaces') {
                            name = Globals.interfacesMap[key] + ' [' + key + ']';
                        }
                        if (!series[key]) {
                            series[key] = { name: (name !== '<nil>') ? name : 'none', data: [] };
                        } else {
                            series[key].data.push([d.time_trunc, val || 0]);
                        }
                    }
                });
            });
            Ext.Object.each(series, function (serie, val) {
                // if (isWidget && chart.series.length >= 5) {
                //     return;
                // }
                chart.addSeries(val, false, { duration: 150 });
            });
        } else {
            Ext.Array.each(data, function (point) {
                var name = point[record.getQueryCategories().get('groupColumn')];
                if (name === null) { name = 'Unknown'; }
                normalizedData.push({
                    name: name,
                    y: point.value
                });
            });
            if (normalizedData.length > record.getRendering().get('slicesNumber')) {
                var others = { name: 'Others', y: 0, color: '#CCC' }, newData = [];
                Ext.Array.each(normalizedData, function (point, idx) {
                    if (idx >= record.getRendering().get('slicesNumber')) {
                        others.y += point.y;
                    } else {
                        newData.push(point);
                    }
                });
                newData.push(others);
                chart.addSeries({ name: record.get('table').split(' ')[0], data: newData, showInLegend: !isWidget }, true, { duration: 150 });
            } else {
                chart.addSeries({ name: record.get('table').split(' ')[0], data: normalizedData, showInLegend: !isWidget }, true, { duration: 150 });
            }
        }
        me.update();
    },

    onSettings: function () {
        var me = this;
        if (!me.setingsSheet) {
            me.setingsSheet = me.getView().add({
                xtype: 'settings-sheet',
                owner: me.getView()
            });
        }
        me.setingsSheet.show();
    }

});
