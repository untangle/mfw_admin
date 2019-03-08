Ext.define('Mfw.setup.step.Account', {
    extend: 'Ext.Panel',
    alias: 'widget.step-account',

    style: 'color: #555;',

    layout: {
        type: 'vbox',
        align: 'middle'
    },

    // bodyPadding: 24,

    items: [{
        xtype: 'component',
        width: 500,
        padding: '0 0 24 0',
        html: '<h1 style="text-align: center;">Admin Account</h1><hr/>'
    }, {
        xtype: 'formpanel',
        padding: 0,

        width: 300,
        layout: {
            type: 'vbox',
            align: 'center'
        },

        // disabled: true,
        // bind: {
        //     disabled: '{skip.checked}'
        // },
        items: [{
            xtype: 'container',
            layout: {
                type: 'vbox',
                pack: 'center'
            },
            // flex: 1,
            defaults: {
                clearable: false,
                labelAlign: 'top',
                // labelTextAlign: 'right'
            },
            items: [{
                xtype: 'component',
                style: 'font-size: 14px;',
                html: 'Choose a new password for the <strong>admin</strong> account'
            }, {
                xtype: 'passwordfield',
                userCls: 'x-custom-field',
                id: 'password',
                autoComplete: false,
                animateUnderline: false,
                name: 'password',
                label: 'Password',
                required: true,
                value: 'passwd'
            }, {
                xtype: 'passwordfield',
                userCls: 'x-custom-field',
                id: 'confirm',
                name: 'confirm',
                label: 'Confirm',
                required: true,
                value: 'passwd'
            }, {
                xtype: 'emailfield',
                userCls: 'x-custom-field',
                name: 'email',
                margin: '16 0 0 0',
                // width: 300,
                // ui: 'solo',
                label: 'Email',
            }, {
                xtype: 'component',
                style: 'color: #777; line-height: 1; padding: 3px;',
                html: 'Administrators receive email alerts and report summaries.'
            }]
        }, {
            xtype: 'component',
            margin: '32 0 0 0',
            html: '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>',
            hidden: true,
            bind: { hidden: '{!processing}' }
        }, {
            xtype: 'button',
            margin: '32 0 0 0',
            width: 120,
            text: 'Continue',
            ui: 'action',
            handler: 'onContinue',
            bind: { hidden: '{processing}' }
        }]
    }],

    listeners: {
        activate: 'onActivate'
    },

    controller: {
        init: function (view) {
            // set validation on confirm field
            var passField = view.down('#password'),
                confirmField = view.down('#confirm');

            confirmField.setValidators(function (value) {
                if (value !== passField.getValue()) {
                    return 'Passwords do not match!';
                }
                return true;
            });
        },

        onActivate: function (card) {
            var me = this,
                vm = me.getViewModel();

            card.down('formpanel').reset(true);

            me.accountsStore = Ext.create('Ext.data.Store', {
                model: 'Mfw.model.Account'
            });


            vm.set('processing', true);
            me.accountsStore.load(function (records) {
                me.adminAccount = me.accountsStore.findRecord('username', 'admin');

                if (!me.adminAccount) {
                    me.adminAccount = Ext.create('Mfw.model.Account', {
                        username: 'admin'
                    });
                    me.accountsStore.add(me.adminAccount);
                }
                Ext.defer(function () {
                    vm.set('processing', false);
                }, 300);
            });
        },

        onContinue: function (cb) {
            var me = this,
                vm = me.getViewModel(),
                form = me.getView().down('formpanel'), values,
                wzCtrl = me.getView().up('setup-wizard').getController();

            if (!form.validate()) { return; }

            values = form.getValues();

            me.adminAccount.set({
                passwordCleartext: values.password,
                email: values.email
            });

            vm.set('processing', true);
            me.accountsStore.sync({
                success: function () {
                    wzCtrl.update();
                }
            });
        }
    }


});
