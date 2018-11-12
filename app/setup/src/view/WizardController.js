Ext.define('Mfw.setup.WizardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.wizard',

    init: function () {
        var wizard = this.getView(),
        	layout = wizard.getLayout(),
        	indicator = layout.getIndicator(),
        	bbar = wizard.lookup('bbar');

        // indicator.on('indicatortap', function (cmp, idx, item) {
        //     console.log(arguments);
        //     return false;
        // })

        bbar.insert(2, indicator);

        // get network settings
        this.setSteps();

    },


    // to know all the steps it is required to fetch network interfaces
    setSteps: function () {
        var me = this, view = me.getView(),
            steps = [
                { xtype: 'step-welcome' },
                { xtype: 'step-account' },
                { xtype: 'step-interfaces' }
            ], interfaces = Ext.getStore('interfaces');

        view.mask();

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

            view.add(steps);
            view.unmask();
            view.setActiveItem(3);
        })

        interfaces.load();
    },

    onNext: function () {
        var currentStep = this.getView().getActiveItem(),
            layout = this.getView().getLayout();
            controller = currentStep.getController();

        if (controller && Ext.isFunction(controller.next)) {
            controller.next(function () {
                layout.next();
            });
        } else {
            layout.next();
        }

    },

    onPrevious: function () {
        this.getView().getLayout().previous();
    },

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

