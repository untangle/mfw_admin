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
        },
        formulas: {
            currentStepIndex: function (get) {
                return get('steps').indexOf(get('wizardStatus.currentStep'));
            }
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
            margin: '0 16',
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
                cls: 'nav-link',
                margin: '0 16'
            },
            items: [{
                itemId: 'nav-eula',
                bind: {
                    html: '<a {(wizardStatus.completed || currentStepIndex >= 1) ? "href=#eula" : ""}>License</a>',
                    userCls: '{step === "eula" ? "current" : ""}'
                }
            }, {
                itemId: 'nav-system',
                bind: {
                    html: '<a {(wizardStatus.completed || currentStepIndex >= 2) ? "href=#system" : ""}>System</a>',
                    userCls: '{step === "system" ? "current" : ""}'
                }
            }, {
                itemId: 'nav-wifi',
                hidden: true,
                bind: {
                    html: '<a {(wizardStatus.completed || currentStepIndex >= 3) ? "href=#wifi" : ""}>WiFi</a>',
                    userCls: '{step === "wifi" ? "current" : ""}',
                    hidden: '{!wifiStep}'
                }
            }, {
                itemId: 'nav-lte',
                hidden: true,
                bind: {
                    html: '<a {(wizardStatus.completed || currentStepIndex >= 4) ? "href=#lte" : ""}>LTE</a>',
                    userCls: '{step === "lte" ? "current" : ""}',
                    hidden: '{!lteStep}'
                }
            }, {
                itemId: 'nav-interfaces',
                bind: {
                    html: '<a {(wizardStatus.completed || currentStepIndex >= 5) ? "href=#interfaces" : ""}>Interfaces</a>',
                    userCls: '{step === "interfaces" ? "current" : ""}'
                }
            }, {
                itemId: 'nav-performance',
                html: '<span>Performance</span>',
                bind: {
                    html: '<a {(wizardStatus.completed || currentStepIndex >= 6) ? "href=#performance" : ""}>Performance</a>',
                    userCls: '{step === "performance" ? "current" : ""}'
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
            hidden: '{(step === "eula" && (!wizardStatus.completed && currentStepIndex <= 1)) || step === "complete"}'
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


