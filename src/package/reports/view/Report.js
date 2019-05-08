Ext.define('Mfw.reports.Report', {
    extend: 'Ext.Panel',
    alias: 'widget.report',

    controller: 'report',

    // viewModel: {},

    layout: {
        type: 'card',
        deferRender: false
    },
    bodyPadding: 0,

    relative: true,

    items: [{
        xtype: 'toolbar',
        docked: 'top',
        shadow: false,
        style: {
            background: 'transparent'
        },
        hidden: true,
        bind: {
            hidden: '{!record}'
        },
        items: [{
            xtype: 'component',
            bind: {
                html: '<h2 style="margin: 8px 0; font-weight: 100;">{record.name}</h2>' +
                      '<p style="margin: 0; font-weight: 100; font-size: 14px; color: #777;">{record.description}</p>'
            }
        }, '->', {
            enableToggle: true,
            reference: 'dataBtn',
            itemId: 'dataBtn',
            // handler: 'showData',
            margin: '0 8 0 0',
            hidden: true,
            // publishes: 'pressed',
            pressed: false,
            bind: {
                text: '{dataBtn.pressed ? "Hide Data" : "Show Data"}',
                hidden: '{record.type === "EVENTS"}'
            }
        }, {
            text: 'Refresh',
            ui: 'action',
            handler: 'loadData',
            tooltip: 'Reload'
        }]
    }, {
        xtype: 'component',
        docked: 'top',
        margin: '0 16 16 16',
        style: 'background: #DDD; font-size: 12px; line-height: 32px; padding: 0 8px; border-radius: 3px;',
        hidden: true,
        bind: {
            hidden: '{!record || !invalidConditionsWarning}',
            html: '{invalidConditionsWarning}'
        },
    }, {
        xtype: 'noselection-report'
    }, {
        xtype: 'chart-report'
    }, {
        xtype: 'text-report'
    }, {
        xtype: 'events-report'
    }, {
        // data panel + grid
        xtype: 'panel',
        itemId: 'data-panel',
        docked: 'bottom',
        height: 300,
        minHeight: 300,

        resizable: {
            split: true,
            edges: 'north'
        },

        layout: 'fit',
        items: [{
            xtype: 'grid',
            store: {
                data: []
            }
        }],

        hidden: true,
        bind: {
            hidden: '{!dataBtn.pressed}'
        }
    }]

});
