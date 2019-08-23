Ext.define('Mfw.Auth', {
    extend: 'Ext.Container',
    alias: 'widget.auth',

    config: {
        redirectTo: null
    },

    layout: {
        type: 'vbox',
        align: 'center'
    },

    padding: '0 0 200 0',

    items: [{
        xtype: 'component',
        docked: 'top',
        margin: '24 0 0 0',
        style: 'text-align: center;',
        html: '<img src="/static/res/untangle-logo.svg" style="vertical-align: middle; margin-right: 16px; height: 64px;"/>'
    }, {
        xtype: 'component',
        width: 500,
        padding: '0 0 24 0',
        html: '<h1 style="text-align: center; font-weight: 100; font-size: 24px; color: #333;">Log In</h1><hr/>'
    }, {
        xtype: 'formpanel',
        scrollable: false,
        padding: 0,

        width: 300,
        keyMapEnabled: true,
        keyMap: {
            enter: {
                key: Ext.event.Event.ENTER,
                handler: 'onLogin'
            }
        },
        layout: {
            type: 'vbox',
            align: 'center'
        },
        defaults: {
            clearable: false,
            labelAlign: 'top',
            width: 250,
            autoComplete: false,
            errorTarget: 'side',
            userCls: 'x-custom-field',
            animateUnderline: false,
            required: true
        },
        items: [{
            xtype: 'component',
            itemId: 'error',
            hidden: true,
            html: '<p style="color: red; font-size: 12px; text-align: center;"><i class="x-fa fa-exclamation-triangle"></i> Invalid username or password!</p>'
        }, {
            xtype: 'textfield',
            name: 'username',
            label: 'Username',
            listeners: {
                painted: function (f) { f.focus(); }
            }
        }, {
            xtype: 'passwordfield',
            name: 'password',
            label: 'Password',
        }, {
            xtype: 'component',
            itemId: 'pending',
            hidden: true,
            style: 'text-align: center',
            margin: '32 0 0 0',
            html: '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>'
        }, {
            xtype: 'button',
            margin: '32 0 0 0',
            width: 120,
            text: 'Sign In',
            ui: 'action',
            handler: 'onLogin'
        }]
    }],

    listeners: {
        hide: 'onHide'
    },

    controller: {
        onLogin: function () {
            var me = this,
                form = me.getView().down('formpanel'),
                btn = form.down('button'),
                pending = form.down('#pending');

            if (!form.validate()) { return; }

            btn.hide();
            pending.show();

            Ext.Ajax.request({
                url: '/account/login',
                method: 'POST',
                params: form.getValues(),
                success: function () {
                    window.location.replace(me.getView().getRedirectTo());
                    window.location.reload();
                },
                failure: function () {
                    form.down('#error').show();
                    btn.show();
                    pending.hide();
                }
            });
        },

        onHide: function (view) {
            var form = view.down('formpanel');
            form.reset(true);
            form.down('#error').hide();
        }
    }
});
