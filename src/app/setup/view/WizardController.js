Ext.define('Mfw.setup.WizardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.wizard',

    completed: false,

    init: function () {
        var wizard = this.lookup('wizard'),
            layout = wizard.getLayout();
            // indicator = layout.getIndicator(),
            // bbar = this.lookup('bbar');

        // indicator.on('indicatortap', function (cmp, idx, item) {
        //     console.log(arguments);
        //     return false;
        // })

        // bbar.insert(2, indicator);
        // this.setSteps();
    },


    /**
     * Fetches the interfaces and creates the steps for each
     */
    setSteps: function () {
        var me = this,
            view = me.getView(),
            wizard = view.lookup('wizard'),
            steps = [
                { xtype: 'step-welcome' },
                { xtype: 'step-account' }
                // { xtype: 'step-interfaces' }
            ],
            interfaces = Ext.getStore('interfaces');

        view.mask({xtype: 'loadmask' });
        view.lookup('bbar').mask();

        interfaces.on('load', function (store) {
            store.each(function (interface) {
                // do not add hidden or OpenVPN interfaces to setup
                if (interface.get('hidden') || interface.get('type') === 'OPENVPN') {
                    return;
                }
                steps.push({
                    xtype: 'step-interface',
                    viewModel: {
                        data: {
                            intf: interface
                        }
                    }
                });
            });
            steps.push({ xtype: 'step-upgrades' });
            steps.push({ xtype: 'step-complete' });

            wizard.add(steps);

            Ext.Ajax.request({
                url: window.location.origin + '/api/settings/system/setupWizard',
                success: function(response) {
                    var obj = Ext.decode(response.responseText);
                    me.completed = obj.completed;
                    wizard.setActiveItem(obj.currentStep);
                },
                failure: function(response) {
                    console.log('server-side failure with status code ' + response.status);
                }
            });

            view.unmask();
            view.lookup('bbar').unmask();

        });

        interfaces.load();
    },

    /**
     * Handler method when continuing to next step
     */
    onContinue: function (btn) {
        console.log('on_continue');
        var wizard = this.lookup('wizard'),
            layout = wizard.getLayout(),
            currentStep = wizard.getActiveItem(),
            controller = currentStep.getController();



        if (controller && Ext.isFunction(controller.continue)) {
            controller.continue(function () {
                layout.next();

                // var step = wizard.getActiveItem().xtype;

                // Ext.Ajax.request({
                //     url: window.location.origin + '/api/settings/system/setupWizard',
                //     method: 'POST',
                //     params: Ext.JSON.encode({
                //         currentStep: step === 'step-complete' ? '' : step,
                //         completed: me.completed || step === 'step-complete'
                //     }),
                //     success: function(response) {
                //         var obj = Ext.decode(response.responseText);
                //     },
                //     failure: function(response) {
                //         console.log('server-side failure with status code ' + response.status);
                //     }
                // });
            });
            return;
        }

        // /**
        //  * If current step has a continue method used for posting data
        //  * wait for a callback from that action before moving to next step
        //  */
        // if (controller && Ext.isFunction(controller.continue)) {
        //     controller.continue(function () {
        //         layout.next();

        //         var step = wizard.getActiveItem().xtype;

        //         Ext.Ajax.request({
        //             url: window.location.origin + '/api/settings/system/setupWizard',
        //             method: 'POST',
        //             params: Ext.JSON.encode({
        //                 currentStep: step === 'step-complete' ? '' : step,
        //                 completed: me.completed || step === 'step-complete'
        //             }),
        //             success: function(response) {
        //                 var obj = Ext.decode(response.responseText);
        //             },
        //             failure: function(response) {
        //                 console.log('server-side failure with status code ' + response.status);
        //             }
        //         });
        //     });
        //     return;
        // }
        // /**
        //  * Otherwise just move to next step
        //  */
        layout.next();
    },


    /**
     * Handler method when moving to previous step
     */
    onBack: function () {
        var me = this,
            wizard = this.lookup('wizard'),
            layout = this.lookup('wizard').getLayout(),
            step;

        layout.previous();

        step = wizard.getActiveItem().xtype;

        Ext.Ajax.request({
            url: window.location.origin + '/api/settings/system/setupWizard',
            method: 'POST',
            params: Ext.JSON.encode({
                currentStep: step === 'step-complete' ? '' : step,
                completed: me.completed || step === 'step-complete'
            }),
            success: function(response) {
                var obj = Ext.decode(response.responseText);
            },
            failure: function(response) {
                console.log('server-side failure with status code ' + response.status);
            }
        });

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

