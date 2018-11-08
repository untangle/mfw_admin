Ext.define('Mfw.setup.Main', {
    extend: 'Ext.Container',
    alias: 'widget.setup',

    layout: 'center',

    controller: 'mainc',

    hidden: false,

    viewModel: {},

    style: 'background-color: #CCC;', /* background-image: url(bg.png); background-size: cover; */

    items: [{
        xtype: 'panel',
        reference: 'panel',
        shadow: true,
        // bodyPadding: 24,

        width: '50%',
        height: '70%',
        style: 'border-radius: 8px;',

        layout: {
            type: 'card',
            animation: {
                type: 'slide',
                duration: 150,
                direction: 'horizontal'
            }, // slide
            indicator: {
                reference: 'indicator',
                tapMode: 'direction',
                publishes: [
                    'activeIndex',
                    'count'
                ]
            }
        },
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            style: 'background: #EEE; font-size: 24px; font-weight: 400; color: #777;',
            padding: '8 16 4 16',
            items: [{
                xtype: 'component',
                html: '<img src="/static/res/untangle-logo.png" width=90 style="vertical-align: middle; margin-right: 16px;"/>'
            }, '->', {
                xtype: 'component',
                html: 'Server Setup'
            }]
        },
            { xtype: 'step-welcome' },
            { xtype: 'step-account' },
            { xtype: 'step-interfaces' },
            { xtype: 'step-interface' },
            { xtype: 'step-upgrades' },
            { xtype: 'step-complete' }
        ],
        bbar: {
            reference: 'bbar',
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
                    hidden: '{indicator.activeIndex == indicator.count - 1}'
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
    }]

});
