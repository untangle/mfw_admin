/**
 * Note: adding columns in class constructor is not desirable because
 * of the prototypal inheritance causing adding more and more columns for each new instance
 */
Ext.define('Mfw.reports.Chart', {
    extend: 'Ext.Panel',
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

    // layout: 'fit',
    bodyPadding: 0,

    items: [{
        xtype: 'panel',
        docked: 'right',
        width: 300,
        bodyPadding: 10,
        resizable: {
            split: true,
            edges: 'west'
        },
        defaults: {
            labelAlign: 'left',
            labelTextAlign: 'right'
        },
        items: [{
            xtype: 'component',
            bind: {
                html: '{record.rendering.groupPixelWidth}'
            }
        }, {
            xtype: 'selectfield',
            bind: {
                value: '{record.rendering.chartType}',
                hidden: '{record.type === "CATEGORIES"}'
            },
            label: 'Style'.t(),
            options: [
                { text: 'Spline', value: 'spline' },
                { text: 'Line', value: 'line' },
                { text: 'Areaspline', value: 'areaspline' },
                { text: 'Area', value: 'area' },
                { text: 'Column', value: 'column' },
                // { text: 'Column', value: 'BAR' },
                // { text: 'Column Overlapped', value: 'BAR_OVERLAPPED' },
                // { text: 'Column Stacked', value: 'BAR_STACKED' }
            ]

        }, {
            xtype: 'selectfield',
            bind: {
                value: '{record.rendering.pieStyle}',
                hidden: '{record.type !== "CATEGORIES"}'
            },
            // label: 'Style'.t(),
            options: [
                { text: 'Pie', value: 'PIE' },
                { text: 'Pie 3D', value: 'PIE_3D' },
                { text: 'Donut', value: 'DONUT' },
                { text: 'Donut 3D', value: 'DONUT_3D' },
                { text: 'Column', value: 'COLUMN' },
                { text: 'Column 3D', value: 'COLUMN_3D' }
            ]

        }, {
            xtype: 'sliderfield',
            label: 'Line Width'.t(),
            // labelAlign: 'top',
            minValue: 0,
            maxValue: 8,
            increment: 0.5,
            bind: {
                value: '{record.rendering.lineWidth}'
            }
        }, {
            xtype: 'selectfield',
            bind: {
                value: '{record.rendering.dashStyle}',
            },
            label: 'Dash Style'.t(),
            options: [
                { text: 'Solid', value: 'Solid' },
                { text: 'Short Dash', value: 'ShortDash' },
                { text: 'Short Dash Dot', value: 'ShortDashDot' },
                { text: 'Short Dash Dot Dot', value: 'ShortDashDotDot' },
                { text: 'Dot', value: 'Dot' },
                { text: 'Dash', value: 'Dash' },
                { text: 'Long Dash', value: 'LongDash' },
                { text: 'Long Dash Dot', value: 'LongDashDot' },
                { text: 'Long Dash Dot Dot', value: 'LongDashDotDot' }
            ]
        }, {
            xtype: 'sliderfield',
            label: 'Area Opacity'.t(),
            // labelAlign: 'top',
            minValue: 0,
            maxValue: 1,
            increment: 0.1,
            bind: {
                value: '{record.rendering.areaOpacity}'
            }
        }, {
            xtype: 'selectfield',
            bind: {
                value: '{record.rendering.stacking}'
            },
            label: 'Stacking'.t(),
            options: [
                { text: 'None', value: 'none' },
                { text: 'Normal', value: 'normal' },
                { text: 'Percent', value: 'percent' }
            ]

        }, {
            xtype: 'selectfield',
            bind: {
                value: '{record.rendering.approximation}'
            },
            label: 'Approximation'.t(),
            options: [
                { text: 'Average', value: 'average' },
                { text: 'High', value: 'high' },
                { text: 'Low', value: 'low' },
                { text: 'Sum', value: 'sum' }
            ]

        }, {
            xtype: 'sliderfield',
            label: 'Group Pixel Width'.t(),
            // labelAlign: 'top',
            minValue: 10,
            maxValue: 30,
            increment: 10,
            bind: {
                value: '{record.rendering.groupPixelWidth}'
            }
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
                    // type: 'spline',
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

                    spline: {
                        // lineWidth: 2,
                        // shadow: true
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


            view.getViewModel().bind('{record.rendering}', function (r) {
                me.update();
                // me.update(record);
            }, me, {deep: true});
            // view.getViewModel().bind('{record.rendering.pieStyle}', function () {
            //     me.update();
            // });
            // view.getViewModel().bind('{record.rendering.approximation}', function () {
            //     me.update();
            // });
        },

        update: function () {
            var me = this,
                record = me.getViewModel().get('record'),
                chart = me.getView().chart, settings;

            if (!chart) { return; }

            var rendering = record.getRendering(),
                colors = rendering.get('colors') || Highcharts.getOptions().colors;

            settings = {
                chart: {
                    type: rendering.get('chartType')
                },
                colors: colors,
                plotOptions: {
                    series: {
                        lineWidth: rendering.get('lineWidth'),
                        stacking: rendering.get('stacking') === 'none' ? undefined : rendering.get('stacking'),
                        dashStyle: rendering.get('dashStyle'),
                        dataGrouping: {
                            approximation: rendering.get('approximation'),
                            groupPixelWidth: rendering.get('groupPixelWidth')
                        }
                    }
                }
            }

            if (chart.series) {
                Ext.Array.each(chart.series, function (serie, idx) {
                    serie.update({
                        color: colors[idx],
                        lineColor: colors[idx],
                        fillColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, Highcharts.Color(colors[idx]).setOpacity(rendering.get('areaOpacity')).get('rgba')],
                                [1, Highcharts.Color(colors[idx]).setOpacity(0.1).get('rgba')]
                            ]
                        },
                    }, false);
                });
            }


            console.log(settings);

            // Highcharts.merge(true, rendering);
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

            if (record.get('type') === 'STATIC_SERIES' || record.get('type') === 'DYNAMIC_SERIES') {
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
