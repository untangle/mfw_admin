/**
 * Note: adding columns in class constructor is not desirable because
 * of the prototypal inheritance causing adding more and more columns for each new instance
 */
Ext.define('Mfw.cmp.chart.Time', {
    extend: 'Ext.Container',
    alias: 'widget.chart-time',

    listeners: {
        painted: 'onInitialize'
    },

    controller: {
        onInitialize: function (view) {
            var me = this;
            view.chart = new Highcharts.stockChart(view.innerElement.dom, {
                chart: {
                    type: 'spline',
                    // animation: false,
                    // marginRight: isWidget ? undefined : 20,
                    // spacing: isWidget ? [5, 5, 10, 5] : [30, 10, 15, 10],
                    zoomType: 'x',
                    backgroundColor: 'transparent',
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
                        timerangeButton: {
                            text: 'Apply this timerange'.t(),
                            align: 'center',
                            enabled: false, // this updates based on zoom selection
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
                    text: 'Hosts Additions',
                    // text: null,
                    style: {
                        fontSize: '24px',
                        fontWeight: 400
                    }
                    // useHtml: true
                },

                subtitle: {
                    align: 'left',
                    text: 'The amount of total, scanned, and bypassed sessions created per minute.',
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
                },
                series: Util.generateTimeSeries(),
            });

        }
    }

});
