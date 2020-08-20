/**
 * Performance Test Dialog
 * displayed and initiated from
 * - Setup Wizard performance step
 * - or from QoS interface settings
 *
 * Example usage:
 *     @example
 *
 *     Ext.Viewport.add({
 *         xtype: 'performance-dialog',
 *         interfaces: interfaces
 *     }).show();
 */
Ext.define('Mfw.PerformanceTestDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.performance-dialog',

    config: {
        /**
         * @cfg {Array} interfaces
         * array of WAN interfaces to be tested for performance
         */
        interfaces: []
    },

    showAnimation: null,
    hideAnimation: null,

    viewModel: {
        data: {
            // a floating number between 0 and 1 used as the value for the Ext.Progress component
            progress: 0,
            // the device name shown while testing
            device: '',
            // string result after test is finished for all interfaces
            result: null
        },
        formulas: {
            // percent value of progress
            percent: function(get) {
                var progress = get('progress');
                return Math.round(progress * 100);
            },
        }
    },

    bind: {
        title: '{!result ? "Testing WAN performance, please wait..." : "Test result"}'
    },

    layout: 'vbox',
    width: 400,
    minHeight: 180,

    items: [{
        xtype: 'progress',
        margin: '16 0 0 0',
        width: '100%',
        hidden: true,
        bind: {
            text: 'Testing <strong>{device}</strong>... {percent}%',
            value: '{progress}',
            hidden: '{result}'
        }
    }, {
        xtype: 'component',
        hidden: true,
        style: 'color: #333; font-size: 14px;',
        bind: {
            html: '{result}',
            hidden: '{!result}'
        }
    }],
    buttons: [{
        ui: 'action',
        bind: {
            text: '{result ? "Close" : "Cancel"}'
        },
        handler: 'onClose'
    }],

    listeners: {
        show: 'onShow'
    },

    controller: {
        onShow: function (view) {
            var me = this;
            // object holding test results for each device/interface
            me._result = {};
            Ext.Array.each(view.getInterfaces(), function (intf) {

                // Use the L3 Device from the status API for passing to the test
                me._result[intf.get('device')] = {
                    testingDevice: intf.get('_status').l3device,
                    tested: false,
                    success: null,
                    result: null
                }
            })
            me.startTest();
        },

        /**
         * interfaces are tested sequentially (not in parallel)
         */
        startTest: function () {
            var me = this, device = null, name = null;

            // cycle to all testable interfaces and until none is left
            Ext.Object.each(me._result, function(key, value) {
                if (!value.tested && !device) {
                    name = key;
                    device = value.testingDevice;
                }
            });
            if (device) {
                // if a device not tested, start testing
                me.runTestForDevice(name, device);
            } else {
                // all devices tested, process results
                me.processResult();
            }
        },

        runTestForDevice: function (name, device) {
            var me = this,
                view = me.getView(),
                vm = me.getViewModel(),
                progress;

            if (me._interval) {
                Ext.uninterval(me._interval);
            }

            vm.set({
                device: name,
                progress: 0
            });

            /**
             * progress bar updates every 0.1 secons for 30 seconds max
             * if the test takes less than 30s than the test is finished and
             * - starts to test next interface
             * - or show the results if no interface is left to test
             */
            me._interval = Ext.interval(function() {
                if (view.isDestroyed) {
                    Ext.uninterval(me._interval);
                }
                else {
                    progress = vm.get('progress');
                    progress += 100/30000;
                    if (progress > 1) {
                        progress = 1;
                        Ext.uninterval(me._interval);
                    }
                    vm.set('progress', progress);
                }
            }, 100);

            /**
             * the actual API request which initiate the test
             * the call should take around 30 seconds
             * but not being certain let it finish beyond 30 seconds progress bar limit
             */
            me._request = Ext.Ajax.request({
                url: '/api/status/wantest/' + device,
                timeout: 60000, // full minute timeout for the call
                success: function (response) {
                    var result = Ext.JSON.decode(response.responseText, true);
                    me._result[name] = {
                        testingDevice: device,
                        tested: true,
                        success: true,
                        result: result
                    }
                },
                failure: function (response) {
                    var result = Ext.JSON.decode(response.responseText, true);

                    me._result[name] = {
                        testingDevice: device,
                        tested: true,
                        success: false,
                        result: result
                    }
                },
                callback: function () {
                    /**
                     * reinitiate test
                     * if no interfaces to test left it will show results
                     */
                    me.startTest();
                }
            });
        },

        processResult: function() {
            var me = this,
                str = '';

            /**
             * compute a string to display as the end result of all interfaces tested
             */
            Ext.Object.each(me._result, function(key, value) {
                var intf = Ext.getStore('interfaces').findRecord('device', key);
                str += '<div><strong>' + intf.get('name') + '/' + intf.get('device') + '</strong>: ';
                if (!value.success) {
                    str += 'Unable to test</div>';
                } else {
                    str += '<i class="x-fa fa-arrow-down fa-green"></i> <strong>' + (value.result.download/1000) + '</strong> Mbps, ' +
                           '<i class="x-fa fa-arrow-up fa-green"></i> <strong>' + (value.result.upload/1000) + '</strong> Mbps </div>';

                    intf.set({
                        qosEnabled: true,
                        downloadKbps: value.result.download,
                        uploadKbps: value.result.upload
                    });

                }
            });
            me.getViewModel().set('result', str);
        },

        onClose: function (btn) {
            var me = this;

            /**
             * if any request is in progress, must be aborted
             */
            if (me._request && !me._request.completed) {
                me._request.abort();
            }

            if (me._interval) {
                Ext.uninterval(me._interval);
            }

            // destroy the dialog on cancel/close
            me.getView().destroy();
        }
    }
});
