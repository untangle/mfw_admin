Ext.define('Mfw.setup.Wizard', {
    extend: 'Ext.Panel',
    alias: 'widget.setup-wizard',

    layout: {
        type: 'card',
        animation: {
            // type: 'fade', // fade, slide
            // duration: 250
        },
    },
    viewModel: {
        data: {
            steps: [],
            processing: false
        }
    },

    controller: 'wizard',

    bind: {
        activeItem: 'step-{step}'
    },

    defaults: {
        bind: {
            masked: '{processing}'
        }
    },

    items: [{
        xtype: 'toolbar',
        docked: 'top',
        // shadow: false,
        layout: {
            type: 'hbox',
            pack: 'center'
        },
        style: 'background: #F5F5F5;',
        items: [{
            xtype: 'component',
            margin: '10 16',
            html: '<img src="/static/res/untangle-logo.svg" style="vertical-align: middle; height: 36px;"/>'
        }, {
            xtype: 'component',
            margin: '0 8',
            width: 1,
            height: 60,
            style: 'background-color: rgba(0, 0, 0, 0.1)',
            html: '<div></div>'
        }, {
            xtype: 'container',
            itemId: 'nav',
            height: 80,
            // shadow: true,
            layout: {
                type: 'hbox',
                pack: 'center',
                align: 'middle'
            }
        }]
    }, {
        xtype: 'toolbar',
        height: 60,
        docked: 'bottom',
        layout: {
            type: 'hbox',
            pack: 'center',
            // align: 'stretch'
        },
        hidden: true,
        bind: {
            hidden: '{step === "eula" || step === "complete"}'
        },
        items: [{
            xtype: 'button',
            text: 'CONTINUE',
            width: 200,
            ui: 'action',
            ripple: false,
            handler: 'onContinue',
            disabled: true,
            hidden: true,
            bind: {
                disabled: '{processing}',
                hidden: '{processing}'
            }
        }, {
            xtype: 'component',
            html: '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>',
            hidden: true,
            bind: {
                hidden: '{!processing}'
            }
        }]
    }]
});


