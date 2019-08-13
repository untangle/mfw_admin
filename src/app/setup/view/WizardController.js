Ext.define('Mfw.setup.WizardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.wizard',

    completed: false,

    steps: [
        'step-welcome',
        'step-account',
        'step-timezone',
        // 'step-wifi',
        // 'step-lte',
        'step-interfaces',
        'step-performance',
        // 'step-upgrades',
        'step-complete'
    ],

    init: function () {
        var me = this,
            wizard = this.lookup('wizard');

        Ext.Ajax.request({
            url: '/api/settings/system/setupWizard',
            success: function(response) {
                var obj = Ext.decode(response.responseText);
                me.completed = obj.completed;
                wizard.setActiveItem(obj.currentStep || 1);
            },
            failure: function(response) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    },


    update: function () {
        var me = this,
            vm = me.getViewModel(),
            wizard = me.lookup('wizard'),
            layout = wizard.getLayout(),
            currentStep = wizard.getActiveItem().xtype,
            nextStep = me.steps[me.steps.indexOf(currentStep) + 1];

        Ext.Ajax.request({
            url: '/api/settings/system/setupWizard',
            method: 'POST',
            params: Ext.JSON.encode({
                currentStep: nextStep === 'step-complete' ? '' : nextStep,
                completed: me.completed || nextStep === 'step-complete'
            }),
            success: function() {
                layout.next();
                Ext.defer(function () {
                    vm.set('processing', false);
                }, 300);
            },
            failure: function(response) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    },


    /**
     * Handler method when continuing to next step
     */
    onContinue: function (btn) {
        console.log('on_continue');
        var me = this,
            vm = me.getViewModel(),
            wizard = this.lookup('wizard'),
            layout = wizard.getLayout(),
            currentStep = wizard.getActiveItem(),
            controller = currentStep.getController();



        if (controller && Ext.isFunction(controller.continue)) {
            controller.continue(function () {
                layout.next();
                vm.set('processing', false);
            });
            return;
        }
        layout.next();
    }

});

