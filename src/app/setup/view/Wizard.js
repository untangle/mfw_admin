Ext.define('Mfw.setup.Wizard', {
    extend: 'Ext.Container',
    alias: 'widget.setup-wizard',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    // style: 'background: #999',

    viewModel: {
        data: {
            processing: false,
            settings: {}
        },
        // formulas: {
        //     bridgedOptions: function (get) {
        //         var interfaces = [];
        //         console.log('here');
        //         Ext.getStore('interfaces').each(function (interface) {
        //             // interface should be ADDRESSED
        //             if (interface.get('interfaceId') === get('intf.interfaceId') ||
        //                 interface.get('configType') !== 'ADDRESSED') {
        //                     return;
        //                 }

        //             interfaces.push({
        //                 text: interface.get('name'),
        //                 value: interface.get('interfaceId')
        //             });
        //         });
        //         return interfaces;
        //     }
        // }
    },

    controller: 'wizard',

    items: [{
        xtype: 'panel',
        itemId: 'wizard',
        reference: 'wizard',
        flex: 1,
        width: 900,
        layout: {
            type: 'card',
            // animation: null,
            animation: {
                type: 'fade', // slide
                // duration: 250,
                // direction: 'horizontal'
            },
        },
        items: [{
            xtype: 'component',
            docked: 'top',
            margin: '24 0',
            style: 'text-align: center;',
            html: '<img src="/static/res/untangle-logo.svg" style="vertical-align: middle; margin-right: 16px; height: 64px;"/>'
        }, {
            xtype: 'container',
            layout: 'center',
            items: [{
                xtype: 'component',
                html: '<i class="fa fa-spinner fa-spin fa-2x fa-fw" style="margin-bottom: 200px;"></i>'
            }]
        },
            { xtype: 'step-welcome' },
            { xtype: 'step-account' },
            { xtype: 'step-timezone' },
            // { xtype: 'step-wifi' },
            // { xtype: 'step-lte' },
            { xtype: 'step-interfaces' },
            { xtype: 'step-performance' },
            // { xtype: 'step-upgrades' },
            { xtype: 'step-complete' }
        ]
    }]

});


