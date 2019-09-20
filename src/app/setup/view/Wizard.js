Ext.define('Mfw.setup.Wizard', {
    extend: 'Ext.Panel',
    alias: 'widget.setup-wizard',

    layout: 'card',
    viewModel: {
        data: {
            steps: [],
            wifiStep: false,
            lteStep: false,
            processing: false,
            wizardStatus: null
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
            },
            hidden: true,
            bind: {
                hidden: '{!wizardStatus}'
            },
            defaults: {
                xtype: 'component',
                margin: '0 16'
            },
            items: [{
                itemId: 'nav-eula',
                bind: {
                    html: '{!wizardStatus.completed ? "<span>License</span>" : "<a href=#eula>License</a>"}',
                    cls: '{!wizardStatus.completed ? "step-nonlink" : "step-link" } {step === "eula" ? "current" : ""}'
                }
            }, {
                itemId: 'nav-system',
                cls: 'step-nonlink',
                bind: {
                    html: '{!wizardStatus.completed ? "<span>System</span>" : "<a href=#system>System</a>"}',
                    cls: '{!wizardStatus.completed ? "step-nonlink" : "step-link" } {step === "system" ? "current" : ""}'
                }
            }, {
                itemId: 'nav-wifi',
                cls: 'step-nonlink',
                hidden: true,
                bind: {
                    html: '{!wizardStatus.completed ? "<span>WiFi</span>" : "<a href=#wifi>WiFi</a>"}',
                    cls: '{!wizardStatus.completed ? "step-nonlink" : "step-link" } {step === "wifi" ? "current" : ""}',
                    hidden: '{!wifiStep}'
                }
            }, {
                itemId: 'nav-lte',
                cls: 'step-nonlink',
                hidden: true,
                bind: {
                    html: '{!wizardStatus.completed ? "<span>LTE</span>" : "<a href=#lte>LTE</a>"}',
                    cls: '{!wizardStatus.completed ? "step-nonlink" : "step-link" } {step === "lte" ? "current" : ""}',
                    hidden: '{!lteStep}'
                }
            }, {
                itemId: 'nav-interfaces',
                cls: 'step-nonlink',
                bind: {
                    html: '{!wizardStatus.completed ? "<span>Interfaces</span>" : "<a href=#interfaces>Interfaces</a>"}',
                    cls: '{!wizardStatus.completed ? "step-nonlink" : "step-link" } {step === "interfaces" ? "current" : ""}'
                }
            }, {
                itemId: 'nav-performance',
                cls: 'step-nonlink',
                html: '<span>Performance</span>',
                bind: {
                    html: '{!wizardStatus.completed ? "<span>Performance</span>" : "<a href=#performance>Performance</a>"}',
                    cls: '{!wizardStatus.completed ? "step-nonlink" : "step-link" } {step === "performance" ? "current" : ""}'
                }
            }]
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
            hidden: '{(step === "eula" && !wizardStatus.completed) || step === "complete"}'
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


