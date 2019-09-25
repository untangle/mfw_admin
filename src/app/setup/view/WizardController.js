Ext.define('Mfw.setup.WizardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.wizard',

    init: function (wizard) {
        var me = this;
        Ext.Ajax.request({
            url: '/api/settings/system/setupWizard',
            success: function(response) {
                var resp = Ext.decode(response.responseText);
                wizard.getViewModel().set('wizardStatus', {
                    completed: resp.completed || false,
                    currentStep: resp.currentStep || ''
                });
                me.setSteps();
            },
            failure: function(response) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    },

    /**
     * adds the steps views based on interfaces
     */
    setSteps: function () {
        var me = this,
            vm = me.getViewModel(),
            steps = ['welcome', 'eula', 'system', 'lte', 'wifi', 'interfaces', 'performance', 'complete'],
            // add an empty card on initial load
            cardSteps = [{
                xtype: 'container',
                layout: 'fit'
            }],
            routes = {},
            wifiStep = false,
            lteStep = false;

        Ext.getStore('interfaces').load(function (interfaces) {
            Ext.Array.each(interfaces, function (intf) {
                if (intf.get('type') === 'WWAN' && !lteStep) {
                    lteStep = true;
                    vm.set('lteStep', true);
                }
                if (intf.get('type') === 'WIFI' && !wifiStep) {
                    wifiStep = true;
                    vm.set('wifiStep', true);
                }
            });

            /**
             * add each step view and route
             * prevent adding lte & wifi if not present
             */
            Ext.Array.each(steps, function (step) {
                if ((step === 'lte' && !lteStep) ||
                    (step === 'wifi' && !wifiStep)
                ) { return; }
                cardSteps.push({ xtype: 'step-' + step });
                routes[step] = 'onStep';
            });

            vm.set('steps', steps);
            me.setRoutes(routes);
            me.getView().add(cardSteps);
            Mfw.app.redirectTo(vm.get('wizardStatus.currentStep') || 'welcome');
            Ext.route.Router.resume();
        });
    },

    onStep: function () {
        var me = this,
        step = window.location.hash.replace('#', '');
        me.getViewModel().set('step', step);
    },

    /**
     * Handler method when continuing to next step
     */
    onContinue: function () {
        var me = this,
            vm = me.getViewModel(),
            currentStep = this.getView().getActiveItem();

        vm.set('processing', true);
        if (currentStep.getController() && Ext.isFunction(currentStep.getController().continue)) {
            // process the step action
            currentStep.getController().continue(function () {
                me.updateWizard();
            });
        } else {
            // or just move to next step
            me.updateWizard();
        }

    },

    updateWizard: function () {
        var me = this,
            vm = me.getViewModel(),
            wizard = this.getView(),
            layout = wizard.getLayout(),
            nextStepName = layout.getNext().xtype.replace('step-', ''),
            currentStep = nextStepName === 'complete' ? '' : nextStepName,
            completed = vm.get('wizardStatus.completed') || (nextStepName === 'complete');

        vm.set('processing', true);

        // update wizard
        Ext.Ajax.request({
            url: '/api/settings/system/setupWizard',
            method: 'POST',
            params: Ext.JSON.encode({
                completed: completed,
                currentStep: currentStep
            }),
            success: function() {
                Mfw.app.redirectTo(nextStepName);
                vm.set('wizardStatus', {
                    completed: completed,
                    currentStep: currentStep
                });
            },
            failure: function(response) {
                console.log('server-side failure with status code ' + response.status);
            },
            callback: function () {
                vm.set('processing', false);
            }
        });
    }

});

