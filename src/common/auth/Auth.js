Ext.define('Mfw.Auth', {
    extend: 'Ext.Container',
    alias: 'widget.auth',

    style: 'background: #999',

    config: {
        redirectTo: null
    },

    layout: 'center',

    padding: '0 0 200 0',

    items: [{
        xtype: 'panel',
        shadow: true,
        width: 320,
        height: 'auto',
        bodyPadding: 16,

        keyMapEnabled: true,
        keyMap: {
            enter: {
                key: Ext.event.Event.ENTER,
                handler: 'onLogin'
            }
        },

        style: 'border-radius: 8px;',

        items: [{
            xtype: 'toolbar',
            docked: 'top',
            style: 'background: none; font-size: 24px; font-weight: 100; color: #777;',
            shadow: false,
            padding: '16 16 0 16',
            items: [{
                xtype: 'component',
                html: '<img src="/static/res/untangle-logo.png" width=90 style="vertical-align: middle; margin-right: 16px;"/>'
            }, '->', {
                xtype: 'component',
                html: 'Login'
            }]
        }, {
            xtype: 'formpanel',
            bodyPadding: 0,
            layout: 'vbox',
            keyMapEnabled: true,
            keyMap: {
                enter: {
                    key: Ext.event.Event.ENTER,
                    handler: 'onLogin'
                }
            },
            defaults: {
                autoComplete: false,
                labelAlign: 'left',
                labelTextAlign: 'right'
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
                clearable: false,
                required: true,
                listeners: {
                    painted: function (f) { f.focus(); }
                }
            }, {
                xtype: 'passwordfield',
                name: 'password',
                label: 'Password',
                clearable: false,
                required: true
            }, {
                xtype: 'button',
                text: 'Log In',
                ui: 'action',
                margin: '48 0 0 0',
                handler: 'onLogin'
            }]
        }]
    }],

    listeners: {
        hide: 'onHide'
    },

    controller: {
        onLogin: function () {
            var me = this,
                form = me.getView().down('formpanel'),
                btn = form.down('button');

            if (!form.validate()) { return; }

            btn.setDisabled(true);
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
                    btn.setDisabled(false);
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
