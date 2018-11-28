/**
 * Note: adding columns in class constructor is not desirable because
 * of the prototypal inheritance causing adding more and more columns for each new instance
 */
Ext.define('Mfw.reports.Chart', {
    extend: 'Ext.Panel',
    alias: 'widget.chart',

    controller: 'chart',

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
        xtype: 'toolbar',
        docked: 'top',
        shadow: false,
        style: {
            background: 'transparent'
        },
        items: [{
            xtype: 'component',
            bind: {
                html: '<h2 style="margin: 8px 0; font-weight: 100;">{record.name}</h2><p style="margin: 0; font-weight: 100; font-size: 14px; color: #777;">{record.description}</p>'
            }
        }, '->', {
            iconCls: 'x-fa fa-refresh',
            handler: 'loadData'
        }, {
            iconCls: 'x-fa fa-sliders',
            handler: 'onSettings'
        }]
    }, {
        xtype: 'container',
        // flex: 1,
        itemId: 'chart'
    }]

});
