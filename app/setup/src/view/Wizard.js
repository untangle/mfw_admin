Ext.define('Mfw.setup.Wizard', {
    extend: 'Ext.Panel',
    alias: 'widget.setup-wizard',
    reference: 'wizard',
    controller: 'wizard',

    viewModel: {},


    width: '50%',
    height: '70%',
    style: 'border-radius: 8px;',
    shadow: true,
    // bodyPadding: 24,
    layout: {
        type: 'card',
        animation: {
            type: 'slide',
            duration: 150,
            direction: 'horizontal'
        }, // slide
        indicator: {
            reference: 'indicator',
            tapMode: 'item',
            publishes: [
                'activeIndex',
                'count'
            ]
        }
    },
    items: [{
        xtype: 'toolbar',
        docked: 'top',
        style: 'font-size: 24px; font-weight: 100; color: #777;',
        // shadow: true,
        padding: '8 16 4 16',
        zIndex: 999,
        items: [{
            xtype: 'component',
            html: '<img src="/static/res/untangle-logo.png" width=90 style="vertical-align: middle; margin-right: 16px;"/>'
        }, {
            xtype: 'component',
            html: 'Setup'
        }]
    }],
    bbar: {
        reference: 'bbar',
        zIndex: 998,
        padding: 16,
        defaults: {
            width: 100
        },
        items: [{
            text: 'Back',
            ui: 'action',

            // iconCls: 'x-fa fa-angle-double-left',
            handler: 'onPrevious',
            hidden: true,
            hideMode: 'visibility',
            bind: {
                disabled: '{!indicator.activeIndex}',
                hidden: '{!indicator.activeIndex}'
            }
        }, {
            xtype: 'container',
            hidden: true,
            hideMode: 'visibility'
        },
        // the indicator is inserted here
        {
            text: 'Cancel',
            margin: '0 16 0 0',
            style: 'color: #999;',
            handler: 'onCancel',
            hidden: true,
            hideMode: 'visibility',
            bind: {
                disabled: '{indicator.activeIndex == indicator.count - 1}',
                hidden: '{indicator.activeIndex == indicator.count - 1 || !indicator.activeIndex}'
            }
        }, {
            text: 'Continue',
            ui: 'action',
            // iconCls: 'x-fa fa-angle-double-right',
            iconAlign: 'right',
            handler: 'onNext',
            hidden: true,
            hideMode: 'visibility',
            bind: {
                disabled: '{indicator.activeIndex == indicator.count - 1}',
                hidden: '{indicator.activeIndex == indicator.count - 1}'
            }
        }]
    }
});
