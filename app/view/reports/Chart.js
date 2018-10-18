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
            xtype: 'selectfield',
            bind: {
                value: '{record.rendering.type}',
                hidden: '{record.type !== "STATIC_SERIES" && record.type !== "DYNAMIC_SERIES"}'
            },
            label: 'Type'.t(),
            options: [
                { text: 'Spline', value: 'spline' },
                { text: 'Line', value: 'line' },
                { text: 'Areaspline', value: 'areaspline' },
                { text: 'Area', value: 'area' },
                { text: 'Column', value: 'column' }
            ]
        }, {
            xtype: 'selectfield',
            bind: {
                value: '{record.rendering.type}',
                hidden: '{record.type !== "CATEGORIES"}'
            },
            label: 'Type'.t(),
            options: [
                { text: 'Pie', value: 'pie' },
                { text: 'Column', value: 'column' },
            ]
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
            xtype: 'containerfield',
            label: 'Line Width'.t(),
            items: [{
                xtype: 'sliderfield',
                flex: 1,
                minValue: 0,
                maxValue: 5,
                increment: 0.5,
                bind: {
                    value: '{record.rendering.lineWidth}'
                }
            }, {
                xtype: 'component',
                width: 30,
                padding: '7px 10px 0 7px',
                bind: {
                    html: '{record.rendering.lineWidth}'
                }
            }]
        }, {
            xtype: 'containerfield',
            label: 'Border Width'.t(),
            items: [{
                xtype: 'sliderfield',
                flex: 1,
                minValue: 0,
                maxValue: 5,
                increment: 0.5,
                bind: {
                    value: '{record.rendering.borderWidth}'
                }
            }, {
                xtype: 'component',
                width: 30,
                padding: '7px 10px 0 7px',
                bind: {
                    html: '{record.rendering.borderWidth}'
                }
            }]
        }, {
            xtype: 'containerfield',
            label: 'Area Opacity'.t(),
            items: [{
                xtype: 'sliderfield',
                flex: 1,
                minValue: 0,
                maxValue: 1,
                increment: 0.1,
                // hidden: true,
                bind: {
                    value: '{record.rendering.areaOpacity}',
                    // hidden: '{record.rendering.type !== "area" && record.rendering.type !== "areaspline"}'
                }
            }, {
                xtype: 'component',
                width: 30,
                padding: '7px 10px 0 7px',
                bind: {
                    html: '{record.rendering.areaOpacity}'
                }
            }]
        }, {
            xtype: 'fieldset',
            // title: 'Data Grouping',
            margin: '16 0',
            defaults: {
                labelAlign: 'left',
                labelTextAlign: 'right'
            },
            // hidden: true,
            // bind: {
            //     hidden: '{record.type !== "STATIC_SERIES" && record.type !== "DYNAMIC_SERIES"}'
            // },
            items: [{
                xtype: 'togglefield',
                label: 'Data Grouping'.t(),
                bind: '{record.rendering.dataGroupingEnabled}'
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
                xtype: 'containerfield',
                label: 'Group Factor'.t(),
                items: [{
                    xtype: 'sliderfield',
                    flex: 1,
                    minValue: 10,
                    maxValue: 50,
                    increment: 10,
                    bind: {
                        value: '{record.rendering.groupPixelWidth}'
                    }
                }, {
                    xtype: 'component',
                    width: 30,
                    padding: '7px 10px 0 7px',
                    bind: {
                        html: '{record.rendering.groupPixelWidth}'
                    }
                }]
            }]
        }, {
            xtype: 'fieldset',
            // title: '3D',
            margin: '16 0',
            defaults: {
                labelAlign: 'left',
                labelTextAlign: 'right'
            },
            hidden: true,
            bind: {
                hidden: '{record.type !== "CATEGORIES"}'
            },
            items: [{
                xtype: 'togglefield',
                label: '3D Enabled'.t(),
                bind: '{record.rendering.3dEnabled}'
            }, {
                xtype: 'containerfield',
                label: 'Alpha'.t(),
                items: [{
                    xtype: 'sliderfield',
                    flex: 1,
                    minValue: 0,
                    maxValue: 100,
                    increment: 5,
                    bind: {
                        value: '{record.rendering.3dAlpha}'
                    }
                }, {
                    xtype: 'component',
                    width: 30,
                    padding: '7px 10px 0 7px',
                    bind: {
                        html: '{record.rendering.3dAlpha}%'
                    }
                }]
            }, {
                xtype: 'containerfield',
                label: 'Depth'.t(),
                items: [{
                    xtype: 'sliderfield',
                    flex: 1,
                    minValue: 10,
                    maxValue: 50,
                    increment: 1,
                    bind: {
                        value: '{record.rendering.3dDepth}'
                    }
                }, {
                    xtype: 'component',
                    width: 30,
                    padding: '7px 10px 0 7px',
                    bind: {
                        html: '{record.rendering.3dDepth}'
                    }
                }]
            }]
        }, {
            xtype: 'containerfield',
            label: 'Donut Size'.t(),
            items: [{
                xtype: 'sliderfield',
                flex: 1,
                minValue: 0,
                maxValue: 90,
                increment: 5,
                bind: {
                    value: '{record.rendering.donutInnerSize}'
                }
            }, {
                xtype: 'component',
                padding: '7px 10px 0 7px',
                bind: {
                    html: '{record.rendering.donutInnerSize}%'
                }
            }]
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
                    animation: false,
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

                tooltip: {
                    enabled: true,
                    animation: false,
                    shared: true,
                    followPointer: true,
                    split: false,
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
                // loading: {
                //     style: {
                //         opacity: 1
                //     }
                // },
                yAxis: {
                    opposite: false
                },
                plotOptions: {
                    series: {
                        animation: false
                    }
                }
                // series: Util.generatePieData(),
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
            }, me, { deep: true });
        },

        update: function () {

            console.log('UPDATE.....');

            var me = this,
                record = me.getViewModel().get('record'),
                chart = me.getView().chart, settings;

            if (!chart) { return; }

            var rendering = record.getRendering(),
                colors = rendering.get('colors') || Highcharts.getOptions().colors, plotOptions = {};

            if (record.get('type') === 'STATIC_SERIES' || record.get('type') === 'DYNAMIC_SERIES') {
                Ext.Array.each(['line', 'spline', 'area', 'areaspline'], function (type) {
                    plotOptions[type] = {
                        // step: true,
                        lineWidth: rendering.get('lineWidth'),
                        stacking: rendering.get('stacking') === 'none' ? undefined : rendering.get('stacking'),
                        dashStyle: rendering.get('dashStyle'),
                        dataGrouping: {
                            enabled: rendering.get('dataGroupingEnabled'),
                            approximation: rendering.get('approximation'),
                            groupPixelWidth: rendering.get('groupPixelWidth')
                        }
                    }
                })

                plotOptions.column = {
                    stacking: rendering.get('stacking') === 'none' ? undefined : rendering.get('stacking'),
                    dataGrouping: {
                        enabled: rendering.get('dataGroupingEnabled'),
                        approximation: rendering.get('approximation'),
                        groupPixelWidth: rendering.get('groupPixelWidth')
                    }
                }

                settings = {
                    chart: {
                        type: rendering.get('type'),
                        zoomType: 'x',
                        options3d: {
                            enabled: false
                        }
                    },
                    colors: colors,
                    plotOptions: plotOptions,
                    xAxis: {
                        visible: true
                    },
                    yAxis: {
                        visible: true
                    }

                }
            }


            if (record.get('type') === 'CATEGORIES') {

                console.log(rendering.get('type'));
                // if (rendering.get('type') === 'column') {
                //     var xAxisCategs =
                // }

                settings = {
                    chart: {
                        type: rendering.get('type'),
                        zoomType: undefined,
                        options3d: {
                            enabled: rendering.get('3dEnabled'),
                            alpha: rendering.get('3dAlpha'),
                            beta: rendering.get('3dBeta')
                        }
                    },
                    colors: colors,
                    plotOptions: {
                        pie: {
                            innerSize: rendering.get('donutInnerSize') + '%',
                            borderWidth: rendering.get('borderWidth'),
                            edgeColor: '#FFF',
                            edgeWidth: rendering.get('borderWidth'),
                            depth: rendering.get('3dDepth')
                        }
                    },
                    xAxis: {
                        visible: false
                    },
                    yAxis: {
                        visible: false
                    }
                }
            }

            settings.title = {
                text: record.get('name')
            }

            settings.subtitle = {
                text: record.get('description')
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

            // console.log(chart.options);
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
