Ext.define('Mfw.setup.WizardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.wizard',

    init: function () {
        var wizard = this.lookup('wizard'),
        	layout = wizard.getLayout(),
        	indicator = layout.getIndicator(),
        	bbar = this.lookup('bbar');

        // indicator.on('indicatortap', function (cmp, idx, item) {
        //     console.log(arguments);
        //     return false;
        // })

        bbar.insert(2, indicator);
        this.setSteps();
    },


    /**
     * Fetches the interfaces and creates the steps for each
     */
    setSteps: function () {
        var wizard = this.lookup('wizard'),
            steps = [
                { xtype: 'step-welcome' },
                { xtype: 'step-account' },
                { xtype: 'step-interfaces' }
            ],
            interfaces = Ext.getStore('interfaces');

        wizard.mask();

        interfaces.on('load', function (store, records) {
            store.each(function (interface) {
                steps.push({
                    xtype: 'step-interface',
                    viewModel: {
                        data: {
                            intf: interface
                        }
                    }
                })
            });
            steps.push({ xtype: 'step-upgrades' });
            steps.push({ xtype: 'step-complete' });

            wizard.add(steps);
            wizard.unmask();
            wizard.setActiveItem(3);
        })

        interfaces.load();
    },

    /**
     * Handler method when continuing to next step
     */
    onContinue: function (btn) {
        var wizard = this.lookup('wizard');
            navbar = btn.up('toolbar'),
            currentStep = wizard.getActiveItem(),
            layout = wizard.getLayout();
            controller = currentStep.getController();

        /**
         * If current step has a continue method used for posting data
         * wait for a callback from that action before moving to next step
         */
        if (controller && Ext.isFunction(controller.continue)) {
            // wizard.mask(); navbar.mask(); // mask components
            controller.continue(function () {
                layout.next();
                // view.unmask(); navbar.unmask(); // unmask components
            });
            return;
        }
        /**
         * Otherwise just move to next step
         */
        layout.next();
    },


    /**
     * Handler method when moving to previous step
     */
    onBack: function () {
        this.lookup('wizard').getLayout().previous();
    },

    /**
     * Handler method when canceling the Setup Wizard
     */
    onCancel: function () {
        var dialog = Ext.create({
            xtype: 'dialog',
            title: '<i class="x-fa fa-exclamation-triangle"></i> Exit Setup',

            defaultFocus: '#ok',

            bodyPadding: 20,
            maxWidth: 200,
            html: '<p style="font-weight: bold;">Are you sure you want exit setup wizard?</p> <p>If so, the setup will resume at the current stage!</p>',

            buttons: {
                no: {
                    text: 'NO',
                    ui: 'action',
                    handler: function (btn) {
                        btn.up('dialog').hide();
                    }
                },
                ok: {
                    text: 'Yes',
                    margin: '0 16 0 0',
                    handler: function (btn) {
                        Ext.Ajax.request({
                            url: '/account/logout',
                            callback: function () {
                                document.location.reload();
                            }
                        });
                    }
                }
            }
        });
        dialog.show();
        return;
    }
});

