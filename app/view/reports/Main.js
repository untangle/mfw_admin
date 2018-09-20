Ext.define('Mfw.view.reports.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-reports',

    layout: 'fit',

    items: [{
        xtype: 'container',
        style: 'border-top: 1px #e1e1e1 solid;',
        items: [{
            xtype: 'panel',
            bind: {
                docked: '{(!smallScreen) ? "left" : null }',
                width: '{(!smallScreen) ? 250 : null }',
                hidden: '{ smallScreen && currentView }',
            },

            resizable: {
                split: true,
                edges: 'east'
            },

            items: [{
                xtype: 'treelist',
                scrollable: true,
                ui: 'nav',
                style: {
                    background: '#f5f5f5'
                },
                // micro: true,
                // selectable: {
                //     mode: 'single'
                // },

                animation: {
                    duration: 150,
                    easing: 'ease'
                },
                singleExpand: true,
                expanderFirst: false,
                expanderOnly: false,
                selectOnExpander: true,
                highlightPath: false,
                store: 'reports-nav',
                listeners: {
                    selectionchange: function (list, record) {
                        if (!record || !record.get('href')) { return; }
                        if (!record.isLeaf() && !record.isExpanded()) {
                            Ext.defer(function () { record.expand(true); }, 100);
                        }
                        Mfw.app.redirectTo(record.get('href'));
                    }
                }
            }],
            bbar: {
                shadow: true,
                items: [{
                    xtype: 'searchfield',
                    ui: 'faded',
                    flex: 1,
                    placeholder: 'Find report...'.t(),
                    listeners: {
                        change: 'filterSettings'
                    }
                }]
            }
        }, {
            xtype: 'panel',
            bodyPadding: 16,
            title: 'Hosts Adittions',
            tools: {
                refresh: {
                    iconCls: 'md-icon-refresh'
                },
                more: {
                    iconCls: 'md-icon-more-vert'
                }
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
            //     {
            //     xtype: 'toolbar',
            //     docked: 'top',
            //     shadow: false,
            //     items: [{
            //         text: 'Refresh'.t()
            //     }]
            // },
            {
                xtype: 'chart-time',
                flex: 1
                // maxHeight: 400
            }, {
                xtype: 'panel',
                // docked: 'bottom',
                minHeight: 400,
                // resizable: {
                //     split: true,
                //     edges: 'north'
                // },
                html: 'data'
            }]
        }, {
            xtype: 'toolbar',
            shadow: false,
            padding: 8,
            // padding: 0, // to remove left spacing
            docked: 'bottom',
            items: [{
                xtype: 'reports-conditions'
            }, '->', {
                xtype: 'reports-timerange-btn'
            }]
        }]
    }]



    // items: [, {
    //     xtype: 'container',
    //     padding: 20,
    //     items: [{
    //         xtype: 'component',
    //         bind: {
    //             html: 'Since: <br/>{reportsConditions.since} / {reportsConditions.since:dateFormatter}<br/><br/> Until: {reportsConditions.until || "none" } / {reportsConditions.until:dateFormatter}<br/><br/>'
    //         }
    //     }, {
    //         xtype: 'dataview',
    //         disableSelection: true,
    //         bind: {
    //             store: {
    //                 data: '{reportsConditions.fields}'
    //             }
    //         },
    //         itemTpl: '<div>{column} {operator} {value} (autoformat: {autoFormatValue})</div>'
    //     }]
    // }]

    // layout: 'fit',

    // tbar: {
    //     shadow: false,
    //     padding: 8,
    //     // padding: 0, // to remove left spacing
    //     dock: 'top',
    //     items: [{
    //         xtype: 'reports-conditions'
    //     }, '->', {
    //         xtype: 'reports-timerange-btn'
    //     }]
    // },

    // items: [{
    //     // layout: 'fit',
    //     xtype: 'panel',
    //     // shadow: false,
    //     // zIndex: 999,
    //     // border: 1,
    //     // style: {
    //     //     background: '#EEE'
    //     // },
    //     weight: 100,

    //     bind: {
    //         docked: '{(!smallScreen) ? "left" : null }',
    //         width: '{(!smallScreen) ? 250 : null }',
    //         hidden: '{ smallScreen && currentView }',
    //     },

    //     resizable: {
    //         split: true,
    //         edges: 'east'
    //     },

    //     // hidden: true,

    //     // plugins: 'responsive',
    //     // responsiveConfig: {
    //     //     large: { docked: 'left', width: 320 },
    //     //     small: { docked: null }
    //     //     // formula: { width: 500 }
    //     // },

    //     // bind: {
    //     //     // docked: '{ screen === "WIDE" ? "left" : null }',
    //     //     width: '{ screen === "WIDE" ? 320 : null }',
    //     //     // hidden: '{params && screen !== "WIDE" }',
    //     //     // resizable: {
    //     //     //     split: '{ screen === "WIDE" }',
    //     //     //     direction: 'left',
    //     //     //     edges: 'east'
    //     //     // }
    //     // },

    //     items: [{
    //         xtype: 'panel',


    //         bbar: {
    //             shadow: true,
    //             items: [{
    //                 xtype: 'searchfield',
    //                 ui: 'faded',
    //                 flex: 1,
    //                 placeholder: 'Find settings...'.t(),
    //                 listeners: {
    //                     change: 'filterSettings'
    //                 }
    //             }]
    //         },
    //         items: [{
    //             xtype: 'treelist',
    //             scrollable: true,
    //             ui: 'nav',
    //             style: {
    //                 background: '#f5f5f5'
    //             },
    //             // micro: true,
    //             // selectable: {
    //             //     mode: 'single'
    //             // },

    //             animation: {
    //                 duration: 150,
    //                 easing: 'ease'
    //             },
    //             singleExpand: true,
    //             expanderFirst: false,
    //             expanderOnly: false,
    //             selectOnExpander: true,
    //             highlightPath: false,
    //             store: 'reports-nav',
    //             listeners: {
    //                 selectionchange: function (el, record) {
    //                     // console.log(record);
    //                     if (!record || !record.get('href')) { return; }
    //                     Mfw.app.redirectTo(record.get('href'));
    //                 }
    //             }
    //         }]
    //     }]
    // }, {
    //     xtype: 'panel',
    //     flex: 1,
    //     title: 'content'
    // }]

});
