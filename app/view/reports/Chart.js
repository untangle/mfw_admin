/**
 * Note: adding columns in class constructor is not desirable because
 * of the prototypal inheritance causing adding more and more columns for each new instance
 */
Ext.define('Mfw.reports.Chart', {
    extend: 'Ext.Container',
    alias: 'widget.chart',

    listeners: {
        initialize: 'onInitialize',
        painted: 'onPainted',
    },

    viewModel: {
        data: {
            record: null
        }
    },

    layout: 'fit',
    bodyPadding: 0,

    items: [{
        xtype: 'toolbar',
        docked: 'bottom',
        defaults: {
            // labelAlign: 'left'
            margin: '0 8'
        },
        items: [{
            xtype: 'selectfield',
            width: 150,
            bind: {
                value: '{record.rendering.timeStyle}',
                hidden: '{record.type === "PIE_CHART"}'
            },
            label: 'Style'.t(),
            options: [
                { text: 'Line', value: 'LINE' },
                { text: 'Area', value: 'AREA' },
                { text: 'Area Stacked', value: 'AREA_STACKED' },
                { text: 'Column', value: 'BAR' },
                { text: 'Column Overlapped', value: 'BAR_OVERLAPPED' },
                { text: 'Column Stacked', value: 'BAR_STACKED' }
            ]

        }, {
            xtype: 'selectfield',
            width: 150,
            bind: {
                value: '{record.rendering.pieStyle}',
                hidden: '{record.type !== "PIE_CHART"}'
            },
            label: 'Style'.t(),
            options: [
                { text: 'Pie', value: 'PIE' },
                { text: 'Pie 3D', value: 'PIE_3D' },
                { text: 'Donut', value: 'DONUT' },
                { text: 'Donut 3D', value: 'DONUT_3D' },
                { text: 'Column', value: 'COLUMN' },
                { text: 'Column 3D', value: 'COLUMN_3D' }
            ]

        }, {
            xtype: 'selectfield',
            width: 120,
            bind: {
                value: '{record.rendering.approximation}',
                hidden: '{record.type === "PIE_CHART"}'
            },
            label: 'Approximation'.t(),
            options: [
                { text: 'Average', value: 'average' },
                { text: 'Open', value: 'open' },
                { text: 'High', value: 'high' },
                { text: 'Low', value: 'low' },
                { text: 'Close', value: 'close' },
                { text: 'Sum', value: 'sum' }
            ]

        }]
    }, {
        xtype: 'container',
        itemId: 'chart'
    }],


    controller: {
        onPainted: function (view) {
            var me = this;

            if (view.chart) { return; }

            Highcharts.setOptions({
                chart: {
                    style: {
                        fontFamily: 'Roboto, sans-serif'
                    }
                }
            });

            view.chart = new Highcharts.stockChart(view.down('#chart').innerElement.dom, {
                chart: {
                    type: 'spline',
                    // animation: false,
                    // marginRight: isWidget ? undefined : 20,
                    // spacing: isWidget ? [5, 5, 10, 5] : [30, 10, 15, 10],
                    zoomType: 'x',
                    selectedrange: null,
                    events: {
                        // selection: function (event) {
                        //     // if (isWidget) { return; } // applies only when viewing the report
                        //     if (event.resetSelection) {
                        //         me.chart.update({
                        //             exporting: {
                        //                 buttons: {
                        //                     timerangeButton: {
                        //                         enabled: false
                        //                     }
                        //                 }
                        //             }
                        //         });
                        //         me.chart.selectedrange = null;
                        //     } else {
                        //         me.chart.update({
                        //             exporting: {
                        //                 buttons: {
                        //                     timerangeButton: {
                        //                         enabled: true
                        //                     }
                        //                 }
                        //             }
                        //         });
                        //         me.chart.selectedrange = {
                        //             min: event.xAxis[0].min,
                        //             max: event.xAxis[0].max
                        //         };
                        //     }
                        // }
                    }
                },
                exporting: {
                    enabled: true,
                    buttons: {
                        contextButton: {
                            enabled: true // disable default contextButton
                        },
                        testButton: {
                            text: 'Refresh'.t(),
                            onclick: function() {
                                me.setData()
                            }
                        },
                        timerangeButton: {
                            text: 'Apply this timerange'.t(),
                            align: 'center',
                            enabled: true, // this updates based on zoom selection
                            y: 10,
                            onclick: function() {
                                Ext.fireEvent('timerangechange', me.chart.selectedrange);
                            }
                        }
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
                    position: {
                        y: -20
                    },
                    style: {
                        fontSize: '16px',
                        fontWeight: 'normal',
                        color: '#555',
                        textAlign: 'center'
                    }
                },

                // colors: (me.entry.get('colors') !== null && me.entry.get('colors') > 0) ? me.entry.get('colors') : me.defaultColors,

                xAxis: {
                    // alternateGridColor: 'rgba(220, 220, 220, 0.1)',
                    type: 'datetime',
                    // lineWidth: 1,
                    // tickLength: 5,
                    // // gridLineWidth: 1,
                    // // gridLineDashStyle: 'dash',
                    // // gridLineColor: '#EEE',
                    // // tickPixelInterval: isWidget ? 80 : 120,
                    // labels: {
                    //     style: {
                    //         color: '#777',
                    //         // fontSize: isWidget ? '11px' : '12px',
                    //         fontWeight: 600
                    //     },
                    //     // y: isWidget ? 15 : 20,
                    //     autoRotation: [-25]
                    // },
                    // maxPadding: 0,
                    // minPadding: 0,
                    // events: {
                    //     // afterSetExtremes: function () {
                    //     //     // filters the current data grid based on the zoom range
                    //     //     if (me.getView().up('entry')) {
                    //     //         me.getView().up('entry').getController().filterData(this.getExtremes().min, this.getExtremes().max);
                    //     //     }
                    //     // }
                    // }
                },
                yAxis: {
                    // allowDecimals: true,
                    // min: 0,
                    // lineWidth: 1,
                    // // gridLineWidth: 1,
                    // gridLineDashStyle: 'dash',
                    // // gridLineColor: '#EEE',
                    // //tickPixelInterval: 50,
                    // tickLength: 5,
                    // tickWidth: 1,
                    // showFirstLabel: false,
                    // showLastLabel: true,
                    // endOnTick: true,
                    // // tickInterval: entry.get('units') === 'percent' ? 20 : undefined,
                    // maxPadding: 0,
                    opposite: false,
                    // labels: {
                    //     align: 'right',
                    //     useHTML: true,
                    //     padding: 0,
                    //     style: {
                    //         color: '#777',
                    //         // fontSize: isWidget ? '11px' : '12px',
                    //         fontWeight: 600
                    //     },
                    //     x: -10,
                    //     y: 4
                    // },
                    // title: {
                    //     align: 'high',
                    //     offset: -10,
                    //     y: 3,
                    //     rotation: 0,
                    //     textAlign: 'left',
                    //     style: {
                    //         color: '#555',
                    //         // fontSize: isWidget ? '12px' : '14px',
                    //         fontWeight: 600
                    //     }
                    // }
                },
                tooltip: {
                    enabled: true,
                    animation: false,
                    shared: true,
                    followPointer: true,
                    split: true,
                    // distance: 30,
                    padding: 10,
                    hideDelay: 0,
                    backgroundColor: 'rgba(247, 247, 247, 0.95)',
                    useHTML: true,
                    style: {
                        // fontSize: isWidget ? '12px' : '14px'
                    },
                    headerFormat: '<p style="margin: 0 0 5px 0; color: #555;">{point.key}</p>'
                },
                plotOptions: {
                    column: {
                        depth: 25,
                        edgeWidth: 1,
                        edgeColor: '#FFF'
                    },
                    areaspline: {
                        lineWidth: 1,
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, Highcharts.Color(Highcharts.getOptions().colors[Ext.Number.randomInt(0, 9)]).setOpacity(0.5).get('rgba')],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[Ext.Number.randomInt(0, 9)]).setOpacity(0.5).get('rgba')]
                            ]
                        }
                    },
                    spline: {
                        lineWidth: 2,
                        shadow: true
                    },
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        center: ['50%', '50%'],
                        showInLegend: true,
                        colorByPoint: true,

                        // depth: isWidget ? 25 : 35,
                        minSize: 150,
                        borderWidth: 1,
                        edgeWidth: 1,
                        dataLabels: {
                            enabled: true,
                            distance: 5,
                            padding: 0,
                            reserveSpace: false,
                            formatter: function () {
                                if (this.point.percentage < 2) {
                                    return null;
                                }
                                if (this.point.name.length > 25) {
                                    return this.point.name.substring(0, 25) + '...';
                                }
                                return this.point.name + ' (' + this.point.percentage.toFixed(2) + '%)';
                            }
                        }
                    },
                    // series: {
                    //     dataLabels: {
                    //         style: {
                    //             // fontSize: isWidget ? '10px' : '12px'
                    //         }
                    //     },
                    //     animation: true,
                    //     states: {
                    //         hover: {
                    //             lineWidthPlus: 0
                    //         }
                    //     },
                    //     marker: {
                    //         radius: 2,
                    //     }
                    // }
                },
                legend: {
                    enabled: true,
                    // margin: 0,
                    // // y: isWidget ? 5 : 10,
                    // // useHTML: true,
                    // lineHeight: 12,
                    // itemDistance: 10,
                    // itemStyle: {
                    //     fontSize: '12px',
                    //     fontWeight: 600,
                    //     width: '120px',
                    //     whiteSpace: 'nowrap',
                    //     overflow: 'hidden',
                    //     textOverflow: 'ellipsis'
                    // },
                    // symbolHeight: 8,
                    // symbolWidth: 8,
                    // symbolRadius: 4
                },
                loading: {
                    style: {
                        opacity: 1
                    }
                }
                // series: Util.generateTimeSeries(),
            });

        },

        onInitialize: function (view) {
            var me = this;
            view.getViewModel().bind('{record}', function (record) {
                if (!record) { return; }
                me.setData();
            });
            view.getViewModel().bind('{record.rendering.timeStyle}', function () {
                me.update();
                // me.update(record);
            });
            view.getViewModel().bind('{record.rendering.pieStyle}', function () {
                me.update();
            });
            view.getViewModel().bind('{record.rendering.approximation}', function () {
                me.update();
            });
        },

        update: function () {
            var me = this, isDateTime = false,
                chart = me.getView().chart, type, xAxisType = 'category',
                isDonut = false, is3d = false, isStacked = false, isOverlapped = false, colorByPoint = false;

            var record = me.getViewModel().get('record');

            if (!chart) { return; }

            if (record.get('type') === 'PIE_CHART') {
                switch (record.getRendering().get('pieStyle')) {
                    case 'PIE': type = 'pie'; break;
                    case 'PIE_3D': is3d = true; type = 'pie'; break;
                    case 'DONUT': isDonut = true; type = 'pie'; break;
                    case 'DONUT_3D': is3d = true; isDonut = true; type = 'pie'; break;
                    case 'COLUMN': colorByPoint = true; type = 'column'; break;
                    case 'COLUMN_3D': colorByPoint = true; is3d = true; type = 'column'; break;
                    default:
                }
            }

            if (record.get('type') === 'TIME_CHART' || record.get('type') === 'TIME_DYNAMIC_CHART') {
                isDateTime = true;
                xAxisType = 'datetime';
                switch (record.getRendering().get('timeStyle')) {
                    case 'BAR': type = 'column'; break;
                    case 'BAR_OVERLAPPED': isOverlapped = true; type = 'column'; break;
                    case 'BAR_STACKED': isStacked = true; type = 'column'; break;
                    case 'LINE': type = 'spline'; break;
                    case 'AREA': type = 'areaspline'; break;
                    case 'AREA_STACKED': isStacked = true; type = 'areaspline'; break;
                    default:
                }
            }

            var settings = {
                chart: {
                    type: type,
                    animation: false,
                    zoomType: isDateTime ? 'x' : undefined,
                    panning: isDateTime,
                    panKey: 'ctrl',
                    options3d: {
                        enabled: is3d,
                        alpha: 45,
                        beta: colorByPoint ? 15 : 0,
                        depth: colorByPoint ? 50 : 0,
                    }
                },
                title: {
                    text: record.get('name')
                },
                subtitle: {
                    text: record.get('description')
                },
                tooltip: {
                    split: isDateTime
                },
                // colors: colors,
                // scrollbar: {
                //     enabled: isTimeGraph
                // },
                legend: {
                    enabled: isDateTime
                },
                plotOptions: {
                    series: {
                        animation: {
                            duration: 300
                        },
                        stacking: isStacked ? 'normal' : undefined
                    },
                    // pie graphs
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        innerSize: isDonut ? 100 : undefined,
                        depth: is3d ? 40 : undefined,
                        dataLabels: {
                            enabled: false,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                        // innerSize: isDonut ? '40%' : 0,
                        // colors: colors
                        //borderColor: '#666666'
                    },
                    // time graphs
                    spline: {
                        shadow: true,
                        dataGrouping: {
                            groupPixelWidth: 50,
                            approximation: record.getRendering().get('approximation') || 'sum',
                            // dateTimeLabelFormats: timeLabelFormats.dataGrouping
                        },
                    },
                    // time graphs
                    areaspline: {
                        // shadow: true,
                        // fillOpacity: 0.3,
                        animation: {
                            duration: 300
                        },
                        dataGrouping: {
                            groupPixelWidth: 50,
                            approximation: record.getRendering().get('approximation') || 'sum',
                            // dateTimeLabelFormats: timeLabelFormats.dataGrouping
                        },
                    },
                    column: {
                        // borderWidth: isColumnOverlapped ? 1 : 0,
                        pointPlacement: isDateTime ? 'on' : null, // time
                        // // pointPadding: 0.01,
                        colorByPoint: colorByPoint, // pie
                        grouping: !isOverlapped,
                        groupPadding: isOverlapped ? 0.1 : 0.15,
                        // // shadow: !isColumnOverlapped,
                        dataGrouping: {
                            groupPixelWidth: 80,
                        }
                    }
                },
                xAxis: {
                    visible: isDateTime,
                    minRange: 10 * 60 * 1000, // minzoom = 10 minutes
                    // tickPixelInterval: 50,
                    type: xAxisType,
                    // crosshair: isDateTime ? {
                    //     width: 1,
                    //     dashStyle: 'ShortDot'
                    // } : false,
                    // plotLines: plotLines,
                    // dateTimeLabelFormats: timeLabelFormats.xAxis
                },
                yAxis: {
                    visible: type !== 'pie',
                    // minRange: entry.get('units') === 'percent' ? 100 : 1,
                    // maxRange: entry.get('units') === 'percent' ? 100 : undefined,
                }
            };
            Highcharts.merge(true, settings);

            // if (chart.series) {
            //     Ext.Array.each(chart.series, function (serie, idx) {
            //         serie.update({
            //             color: Highcharts.getOptions().colors[idx],
            //             lineColor: Highcharts.getOptions().colors[idx],
            //             fillColor: {
            //                 linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            //                 stops: [
            //                     [0, Highcharts.Color(Highcharts.getOptions().colors[idx]).setOpacity(0.7).get('rgba')],
            //                     [1, Highcharts.Color(Highcharts.getOptions().colors[idx]).setOpacity(0.1).get('rgba')]
            //                 ]
            //             },
            //         }, false);
            //     });
            // }

            chart.update(settings, true);
        },

        setData: function () {
            var me = this, chart = me.getView().chart,
                record = me.getViewModel().get('record');
            if (!chart) { return; }

            while (chart.series.length > 0) {
                chart.series[0].remove(false);
            }

            var data = Util.generateData(record);

            if (record.get('type') === 'TIME_CHART' || record.get('type') === 'TIME_DYNAMIC_CHART') {
                Ext.Array.each(data, function (d) {
                    chart.addSeries(d, false, { duration: 150 });
                });
            } else {
                chart.addSeries(data, true, { duration: 150 });
            }
            me.update();
        }
    }

});
