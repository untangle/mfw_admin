Ext.define('Mfw.view.Reports', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-reports',

    layout: 'fit',

    viewModel: {},

    items: [{
        xtype: 'toolbar',
        userCls: 'x-conditions',
        shadow: false,
        padding: 8,
        // padding: 0, // to remove left spacing
        docked: 'top',
        items: [{
            xtype: 'reports-timerange-btn'
        }, {
            xtype: 'toolbarseparator',
        }, {
            xtype: 'reports-conditions'
        }]
    }, {
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
            // title: 'Hosts Adittions',
            // tools: {
            //     refresh: {
            //         iconCls: 'md-icon-refresh',
            //         handler: 'onRefresh'
            //     },
            //     more: {
            //         iconCls: 'md-icon-more-vert'
            //     }
            // },
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
        }]
    }],

    listeners: {
        initialize: 'onInitialize'
    },

    controller: {
        onInitialize: function (view) {
            // var vm = view.getViewModel();
            // vm.bind('{reportsConditions}', function (conditions) {
            //     console.log('BINDING FIRED');
            // });
        },

        onRefresh: function () {
            var me = this,
                vm = me.getViewModel(),
                chart = me.getView().down('chart-time');

            chart.chart.update({
                series: Util.generateTimeSeries()
            }, true);


        }
    }


});
