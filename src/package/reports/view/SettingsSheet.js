Ext.define('Mfw.reports.Settings', {
    extend: 'Ext.Sheet',
    alias: 'widget.settings-sheet',

    // title: 'Conditions'.t(),
    width: 350,
    // closable: true,
    // closeAction: 'hide',
    // centered: true,
    cover: true,
    side: 'right',
    viewModel: {},

    // layout: {
    //     type: 'card',
    //     deferRender: false, // important so the validation works if card not yet visible
    //     animation: {
    //         duration: 150,
    //         type: 'slide',
    //         direction: 'horizontal'
    //     },
    // },
    layout: 'fit',
    items: [{
        xtype: 'tabpanel',

        layout: {
            type: 'card',
            deferRender: false, // important so the validation works if card not yet visible
            animation: null
        },

        tabBar: {
            animateIndicator: false
        },

        items: [{
            title: '<i class="x-fa fa-paint-brush"></i>',
            padding: 10,
            defaults: {
                labelAlign: 'left',
                labelTextAlign: 'right'
            },
            items: [{
                xtype: 'selectfield',
                bind: {
                    value: '{record.rendering.type}',
                    hidden: '{record.type !== "SERIES" && record.type !== "CATEGORIES_SERIES"}'
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
                hidden: true,
                bind: {
                    value: '{record.rendering.stacking}',
                    hidden: '{record.type !== "SERIES" && record.type !== "CATEGORIES_SERIES"}'
                },
                label: 'Stacking'.t(),
                options: [
                    { text: 'None', value: 'none' },
                    { text: 'Normal', value: 'normal' },
                    { text: 'Percent', value: 'percent' }
                ]
            }, {
                xtype: 'containerfield',
                label: 'Line Width'.t(),
                hidden: true,
                bind: {
                    hidden: '{record.rendering.type !== "line" && record.rendering.type !== "spline" && record.rendering.type !== "area" && record.rendering.type !== "areaspline"}'
                },
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
                xtype: 'selectfield',
                hidden: true,
                bind: {
                    value: '{record.rendering.dashStyle}',
                    hidden: '{record.rendering.type !== "line" && record.rendering.type !== "spline" && record.rendering.type !== "area" && record.rendering.type !== "areaspline"}'
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
                label: 'Slices Number'.t(),
                hidden: true,
                bind: {
                    hidden: '{record.rendering.type !== "pie"}'
                },
                items: [{
                    xtype: 'sliderfield',
                    flex: 1,
                    minValue: 2,
                    maxValue: 15,
                    increment: 1,
                    bind: {
                        value: '{record.rendering.slicesNumber}'
                    }
                }, {
                    xtype: 'component',
                    width: 30,
                    padding: '7px 10px 0 7px',
                    bind: {
                        html: '{record.rendering.slicesNumber}'
                    }
                }]
            }, {
                xtype: 'containerfield',
                label: 'Border Width'.t(),
                hidden: true,
                bind: {
                    hidden: '{record.rendering.type !== "pie"}'
                },
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
                label: 'Top Opacity'.t(),
                hidden: true,
                bind: {
                    hidden: '{record.rendering.type !== "area" && record.rendering.type !== "areaspline"}'
                },
                items: [{
                    xtype: 'sliderfield',
                    flex: 1,
                    minValue: 0,
                    maxValue: 1,
                    increment: 0.1,
                    bind: {
                        value: '{record.rendering.topAreaOpacity}',
                    }
                }, {
                    xtype: 'component',
                    width: 30,
                    padding: '7px 10px 0 7px',
                    bind: {
                        html: '{record.rendering.topAreaOpacity}'
                    }
                }]
            }, {
                xtype: 'containerfield',
                label: 'Bottom Opacity'.t(),
                hidden: true,
                bind: {
                    hidden: '{record.rendering.type !== "area" && record.rendering.type !== "areaspline"}'
                },
                items: [{
                    xtype: 'sliderfield',
                    flex: 1,
                    minValue: 0,
                    maxValue: 1,
                    increment: 0.1,
                    bind: {
                        value: '{record.rendering.bottomAreaOpacity}',
                    }
                }, {
                    xtype: 'component',
                    width: 30,
                    padding: '7px 10px 0 7px',
                    bind: {
                        html: '{record.rendering.bottomAreaOpacity}'
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
                hidden: true,
                bind: {
                    hidden: '{record.type !== "SERIES" && record.type !== "CATEGORIES_SERIES"}'
                },
                items: [{
                    xtype: 'togglefield',
                    label: 'Data Grouping'.t(),
                    bind: '{record.rendering.dataGroupingEnabled}'
                }, {
                    xtype: 'selectfield',
                    bind: {
                        value: '{record.rendering.dataGroupingApproximation}'
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
                            value: '{record.rendering.dataGroupingFactor}'
                        }
                    }, {
                        xtype: 'component',
                        width: 30,
                        padding: '7px 10px 0 7px',
                        bind: {
                            html: '{record.rendering.dataGroupingFactor}'
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
                hidden: true,
                bind: {
                    hidden: '{record.rendering.type !== "pie"}'
                },
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
            }, {
                xtype: 'textareafield',
                label: 'Colors'.t(),
                bind: '{record.rendering.colors}'
            }]
        }, {
            title: '<i class="x-fa fa-sliders"></i>'
        }]
    }]

});
