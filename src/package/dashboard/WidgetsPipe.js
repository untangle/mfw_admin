Ext.define('Mfw.dashboard.WidgetsPipe', {
    alternateClassName: 'WidgetsPipe',
    singleton: true,
    queue: [],
    processing: false,

    paused: false,

    add: function (widget) {
        this.queue.push(widget);
        this.process();
    },

    addFirst: function (widget) {
        this.queue.unshift(widget);
        this.process();
    },

    process: function () {
        var me = this, wg = me.queue[0],
            ctrl,
            widget = wg.getViewModel().get('widget'),
            timer = wg.down('#timer');

        if (me.queue.length > 0 && !me.processing) {
            me.processing = true;
            if (wg.tout) {clearTimeout(wg.tout); }

            if (widget.get('isReport')) {
                var reportContainer = wg.down('chart-report') || wg.down('events-report');
                reportContainer = reportContainer || wg.down('text-report');

                ctrl = reportContainer.getController();
            } else {
                ctrl = wg.getController();
            }

            if (Ext.isFunction(ctrl.loadData)) {
                ctrl.loadData(function () {
                    if (widget.get('interval') !== 0) {
                        wg.tout = setTimeout(function () {
                            WidgetsPipe.add(wg);
                        }, widget.get('interval') * 1000);

                        timer.setHtml('');
                        timer.setHtml('<div class="wrapper">' +
                                    '<div class="pie spinner" style="animation-duration: ' + widget.get('interval') + 's;"></div>' +
                                    '<div class="pie filler" style="animation-duration: ' + widget.get('interval') + 's;"></div>' +
                                    '<div class="mask" style="animation-duration: ' + widget.get('interval') + 's;"></div>' +
                                    '</div>');
                    }
                    Ext.Array.removeAt(me.queue, 0);
                    me.processing = false;
                    if (me.queue.length > 0) { me.process(); }
                });
            } else {
                // should be removed later
                Ext.Array.removeAt(me.queue, 0);
                me.processing = false;
                if (me.queue.length > 0) { me.process(); }
            }
        }
    }
});
