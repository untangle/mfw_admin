Ext.define('Mfw.dashboard.widget.System', {
    extend: 'Ext.Container',
    alias: 'widget.widget-system',

    viewModel: {
        data: {
            cpu_model: '',
            system: {}
        }
    },

    layout: {
        type: 'hbox',
        align: 'center'
    },

    defaults: {
        margin: '0 16'
    },

    items: [{
        xtype: 'component',
        style: 'font-size: 12px; font-weight: 600;',
        margin: '0 16 0 0',
        bind: {
            html: 'Untangle MFW <br/>({cpu_model})'
        }
    }, {
        xtype: 'component',
        itemId: 'cpu-graph',
        userCls: 'system-graph',
        width: 160,
        height: 42
    }, {
        xtype: 'component',
        itemId: 'mem-graph',
        userCls: 'system-graph',
        width: 160,
        height: 42
    }],

    listeners: {
        // painted: 'onPainted'
    },

    controller: {
        init: function (view) {
            var me = this, vm = view.getViewModel();
            Ext.Ajax.request({
                url: '/api/status/hardware',
                success: function (response) {
                    var hardware = Ext.decode(response.responseText),
                        cpu_model = hardware.cpuinfo.processors[0].model_name;
                    vm.set('cpu_model', cpu_model);

                    // me.initCharts();

                    view.cpuChart = me.createChart(view.down('#cpu-graph'), 'cpu');
                    view.memChart = me.createChart(view.down('#mem-graph'), 'mem');

                    me.getSystemStatus();



                },
                failure: function () {
                    console.error('Unable to get hardware ');
                }
            });
        },

        createChart: function (cmp, type) {
            var title, serieName;

            if (type === 'cpu') { title = 'CPU Load', serieName = 'Load 1 min'; }
            if (type === 'mem') { title = 'Memory'; serieName = 'Used Memory (%)'; }

            return new Highcharts.chart(cmp.innerElement.dom, {
                chart: {
                    type: 'areaspline',
                    backgroundColor: '#333',
                    marginLeft: 0,
                    marginBottom: 0,
                    marginTop: 0,
                    marginRight: 0
                },
                exporting: {enabled: false },
                title: { text: title, y: 2, style: { color: '#FFF', fontSize: '11px', margin: 3 } },
                credits: { enabled: false },
                legend: { enabled: false },
                tooltip: { outside: true, shared: true, hideDelay: 0 },
                xAxis: {
                    type: 'datetime',
                    visible: false,
                    startOnTick: false,
                    endOnTick: false,
                    // maxPadding: 40,
                    // minPadding: 0
                },
                yAxis: {
                    visible: true,
                    max: type === 'cpu' ? 0.5 : 100,
                    // min: 1,
                    // minPadding: 40,
                    // maxPadding: 0,
                    // endOnTick: false,
                    // startOnTick: false,
                    gridLineWidth: 0,
                    title: { text: null }
                },
                plotOptions: {
                    areaspline: {
                        lineWidth: 2,
                        marker: { enabled: false, radius: 2 },
                        states: { hover: { enabled: true, lineWidthPlus: 0, marker: { radius: 2 } } }
                    },
                    series: {
                        pointStart: Ext.Date.subtract(Util.serverToClientDate(new Date()), Ext.Date.MINUTE, 1).getTime(),
                        pointInterval: 6 * 1000,
                    }
                },
                series: [
                {
                    name: serieName,
                    data: [null, null, null, null, null, null, null, null, null, 0],
                    lineColor: '#CCC',
                    fillColor: '#444'
                }]
            });
        },

        getSystemStatus: function () {
            var me = this,
                view = me.getView();
            Ext.Ajax.request({
                url: '/api/status/system',
                success: function (response) {
                    var system = Ext.decode(response.responseText);
                    // add the point
                    view.cpuChart.series[0].addPoint(system.loadavg.last1min, false, true);

                    view.memChart.series[0].addPoint(100 - (system.meminfo.mem_free/system.meminfo.mem_total * 100), false, true);
                    // view.cpuChart.series[2].addPoint(system.loadavg.last1min, false, true);

                    view.cpuChart.redraw();
                    view.memChart.redraw();


                    setTimeout(function () {
                        me.getSystemStatus();
                    }, 5000);

                },
                failure: function () {
                    console.error('Unable to get hardware ');
                }
            });
        }
    }

});
