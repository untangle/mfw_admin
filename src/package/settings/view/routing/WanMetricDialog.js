Ext.define('Mfw.settings.routing.WanMetricDialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.wan-metric-dialog',

    // viewModel: {},

    title: 'Add Metric'.t(),
    // width: 1100,
    // height: 600,
    resizable: {
        edges: 'all',
        dynamic: true
    },
    showAnimation: {
        duration: 0
    },

    layout: 'hbox',

    bodyPadding: 8,

    items: [{
        xtype: 'formpanel',
        layout: 'hbox',
        bodyPadding: 0,
        defaults: {
            margin: '0 8 16 8',
            labelAlign: 'top'
        },
        items: [{
            xtype: 'hiddenfield',
            name: 'type',
            value: 'METRIC'
        }, {
            xtype: 'selectfield',
            name: 'metric',
            required: true,
            value: 'LATENCY',
            options: Map.options.wanMetrics
        }, {
            xtype: 'selectfield',
            name: 'metric_op',
            required: true,
            value: '<',
            options: [
                { text: 'Less Than [ < ]', value: '<' },
                { text: 'More Than [ > ]', value: '>' },
                { text: 'Less Than or Equal [ <= ]', value: '<=' },
                { text: 'More Than or Equal [ >= ]', value: '>=' },
            ]
        }, {
            xtype: 'numberfield',
            name: 'metric_value',
            required: true,
            autoComplete: false
        }]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        items: ['->', {
            text: 'Cancel',
            margin: '0 8 0 0',
            handler: function () {  // standard button (see below)
                this.up('dialog').destroy();
            }
        }, {
            text: 'Add',
            ui: 'action',
            handler: function () {
                var view = this.up('wan-metric-dialog'),
                    form = view.down('formpanel'),
                    vm = this.up('wan-policy-dialog').getViewModel(),
                    policy = vm.get('policy');

                if (!form.validate()) { return; }

                policy.criteria().add(form.getValues());
                view.destroy();
            }
        }]
    }],


});
