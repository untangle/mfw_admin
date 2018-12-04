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
            // iconCls: 'x-fa fa-refresh fa-gray',
            iconCls: 'md-icon-refresh',
            handler: 'loadData',
            tooltip: 'Reload'
        }, {
            // iconCls: 'x-fa fa-th-list fa-gray',
            iconCls: 'md-icon-view-list',
            handler: 'onData',
            tooltip: 'View Data',
            hidden: true,
            bind: {
                hidden: '{record.type === "EVENTS"}'
            }
        }, {
            // iconCls: 'x-fa fa-sliders fa-gray',
            iconCls: 'md-icon-settings',
            handler: 'onSettings',
            tooltip: 'Settings'
        }]
    }, {
        xtype: 'noselection-report'
    }, {
        xtype: 'chart-report'
    }, {
        xtype: 'text-report'
    }, {
        xtype: 'events-report'
    }, {
        xtype: 'data-sheet'
    }]

});
