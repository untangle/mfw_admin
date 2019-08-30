Ext.define('Mfw.setup.WizardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.wizard',

    completed: false,

    // navigation names
    navNames: {
        system: 'System',
        wifi: 'WiFi',
        lte: 'LTE/4G',
        interfaces: 'Interfaces',
        performance: 'Performance'
    },

    init: function () {
        var me = this;
        Ext.Ajax.request({
            url: '/api/settings/system/setupWizard',
            success: function(response) {
                var obj = Ext.decode(response.responseText);
                me.completed = obj.completed;
                me.setSteps(obj.currentStep);
            },
            failure: function(response) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    },

    /**
     * generate steps based on interfaces
     * @param {String} currentStep
     */
    setSteps: function (currentStep) {
        var me = this,
            vm = me.getViewModel(),
            steps = ['step-welcome', 'step-system'],
            // add an empty card on initial load
            cardSteps = [{
                xtype: 'container',
                layout: 'fit'
            }],
            routes = {}, navItems = [],
            wifiStep = false,
            lteStep = false;

        Ext.getStore('interfaces').load(function (interfaces) {
            Ext.Array.each(interfaces, function (intf) {
                if (intf.get('type') === 'WWAN' && !lteStep) {
                    steps.push('step-lte');
                }
                if (intf.get('type') === 'WIFI' && !wifiStep) {
                    steps.push('step-wifi');
                    wifiStep = true;
                }
            });

            steps.push('step-interfaces');
            steps.push('step-performance');
            steps.push('step-complete');


            // set routes for each step
            Ext.Array.each(steps, function (step) {
                var _step = step.replace('step-', '');

                cardSteps.push({ xtype: step });

                routes[_step] = 'onStep';

                if (_step === 'welcome' || _step === 'complete') {
                    return;
                }

                navItems.push({
                    xtype: 'component',
                    itemId: 'nav-' + _step,
                    margin: '0 18',
                    cls: 'step-link',
                    bind: {
                        html: '<a href="#' + _step + '">' + me.navNames[_step] + '</a>'
                    }
                });
            });

            vm.set('steps', steps);

            me.setRoutes(routes);
            me.getView().add(cardSteps);
            me.getView().down('#nav').setItems(navItems);

            Mfw.app.redirectTo(currentStep || 'welcome');
            Ext.route.Router.resume();

        });
    },

    onStep: function () {
        var me = this,
            step = window.location.hash.replace('#', '');
        me.getViewModel().set('step', step);

        me.getView().down('#nav').getItems().items.forEach(function (cmp) {
            if (cmp.getItemId() === 'nav-' + step) {
                cmp.setUserCls('current');
            } else {
                cmp.setUserCls('');
            }
        });
    },

    /**
     * Handler method when continuing to next step
     */
    onContinue: function () {
        var me = this,
            vm = me.getViewModel(),
            wizard = this.getView(),
            layout = wizard.getLayout(),
            currentStep = wizard.getActiveItem(),
            nextStepName = layout.getNext().xtype.replace('step-', '');

        vm.set('processing', true);

        currentStep.getController().continue(function () {
            // update wizard
            Ext.Ajax.request({
                url: '/api/settings/system/setupWizard',
                method: 'POST',
                params: Ext.JSON.encode({
                    currentStep: nextStepName === 'complete' ? '' : nextStepName,
                    completed: me.completed || nextStepName === 'complete'
                }),
                success: function() {
                    layout.next();
                },
                failure: function(response) {
                    console.log('server-side failure with status code ' + response.status);
                },
                callback: function () {
                    Ext.defer(function () {
                        vm.set('processing', false);
                    }, 250);
                }
            });

        });

    }

});

