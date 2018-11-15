Ext.define('Mfw.setup.step.Account', {
    extend: 'Ext.Panel',
    alias: 'widget.step-account',

    style: 'color: #555;',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    bodyPadding: 24,

    items: [{
        xtype: 'component',
        padding: '0 0 24 0',
        html: '<h1>Admin Account</h1><br/><hr/>'
    }, {
        xtype: 'formpanel',
        padding: 0,
        layout: 'vbox',
        // disabled: true,
        // bind: {
        //     disabled: '{skip.checked}'
        // },
        items: [{
            xtype: 'component',
            html: '<p>Choose a new password for the <strong>admin</strong> account</p>'
        }, {
            xtype: 'passwordfield',
            id: 'password',
            name: 'password',
            width: 300,
            // ui: 'solo',
            label: 'Password',
            labelAlign: 'left',
            labelTextAlign: 'right',
            required: true
        }, {
            xtype: 'passwordfield',
            id: 'confirm',
            name: 'confirm',
            width: 300,
            // ui: 'solo',
            label: 'Confirm',
            labelAlign: 'left',
            labelTextAlign: 'right',
            required: true
        }, {
            xtype: 'component',
            margin: '24 0 0 0',
            html: '<p>Administrators receive email alerts and report summaries.</p>'
        }, {
            xtype: 'emailfield',
            width: 300,
            // ui: 'solo',
            label: 'Email',
            labelAlign: 'left',
            labelTextAlign: 'right'
        }]
    }, {
        xtype: 'checkbox',
        reference: 'skip',
        margin: '36 0 0 0',
        label: '&nbsp;',
        bodyAlign: 'start',
        boxLabel: '<strong>Skip this Step</strong>'
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
                    return 'Passwords do not match!'
                }
                return true;
            });
        },

        onActivate: function (view) {
            view.lookup('skip').setChecked(false);
            view.down('formpanel').reset(true);
        },

        continue: function (cb) {
            var me = this, skip = me.lookup('skip'),
                form = me.getView().down('formpanel');

            if (skip.getChecked()) {
                var dialog = Ext.create({
                    xtype: 'dialog',
                    title: '<i class="x-fa fa-exclamation-triangle"></i> Warning',

                    defaultFocus: '#ok',

                    bodyPadding: 20,
                    maxWidth: 200,
                    html: '<p>For security reasons is highly recommended to set a new password for the <strong>admin</strong> account.</p><p style="color: #333;">Do you still want to skip this step?</p>',

                    buttons: {
                        no: {
                            text: 'NO',
                            ui: 'action',
                            handler: function (btn) {
                                skip.setChecked(false);
                                btn.up('dialog').hide();
                            }
                        },
                        ok: {
                            text: 'Yes',
                            margin: '0 16 0 0',
                            handler: function (btn) {
                                btn.up('dialog').hide();
                                cb();
                            }
                        }
                    }
                });
                dialog.show();
                return;
            }

            if (!form.validate()) { return; }

            // to do update password and relogin
            cb();
        },


        validator: function () {
            console.log('aaa');
        },

        doLogin: function (cb) {
            Ext.Ajax.request({
                url: '/account/login',
                method: 'POST',
                params: { username: 'admin', password: 'passwd' },
                success: function () {
                    cb();
                },
                failure: function (response) {
                    console.log(response);
                }
            });
        }


        // onLogin: function () {
        //     Ext.Ajax.request({
        //         url: window.location.origin + '/api/settings/admin/credentials',
        //         method: 'POST',
        //         params: Ext.JSON.encode({"passwordHashMD5":"$1$5dd8CZop$tBHVegWM02BNyjh55xG2m0","passwordHashSHA256":"$5QpqS5Ai/r0A","passwordHashSHA512":"$6R1M/8IrkYtg","username":"admin"}),
        //         success: function(response, opts) {
        //             var obj = Ext.decode(response.responseText);
        //             console.dir(obj);
        //         },
        //         failure: function(response, opts) {
        //             console.log('server-side failure with status code ' + response.status);
        //         }
        //     });
        // }
    }


});
