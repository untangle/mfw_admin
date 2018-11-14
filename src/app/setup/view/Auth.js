Ext.define('Mfw.setup.Auth', {
    extend: 'Ext.Panel',
    alias: 'widget.setup-auth',

    shadow: true,
    width: 300,
    height: 'auto',
    bodyPadding: 24,

    style: 'border-radius: 8px;',

    items: [{
        xtype: 'toolbar',
        docked: 'top',
        style: 'background: none; font-size: 24px; font-weight: 100; color: #777;',
        shadow: false,
        padding: '16 24 0 16',
        items: [{
            xtype: 'component',
            html: '<img src="/static/res/untangle-logo.png" width=90 style="vertical-align: middle; margin-right: 16px;"/>'
        }, '->', {
            xtype: 'component',
            html: 'Setup'
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
            autoComplete: false
        },
        items: [{
            xtype: 'component',
            itemId: 'error',
            hidden: true,
            html: '<p style="color: red; font-size: 12px;"><i class="x-fa fa-exclamation-triangle"></i> Invalid username or password!'
        }, {
            xtype: 'textfield',
            name: 'username',
            label: 'Username',
            required: true
        }, {
            xtype: 'passwordfield',
            name: 'password',
            label: 'Password',
            required: true
        }, {
            xtype: 'button',
            ui: 'action',
            margin: '36 0',
            text: 'Log In',
            handler: 'onLogin'
        }]
    }, {
        xtype: 'component',
        html: '<p style="font-size: 14px;"><i class="x-fa fa-info-circle"></i> After first login you will be asked to change admin password!</p>'
    }],

    controller: {
        onLogin: function () {
            var me = this, view = me.getView(),
                form = view.down('formpanel'),
                btn = form.down('button'),
                err = form.down('#error');

            err.hide();
            if (!form.validate()) { return; }
            btn.setDisabled(true);

            Ext.Ajax.request({
                url: '/account/login',
                method: 'POST',
                params: form.getValues(),
                success: function () {
                    view.hide();
                    Mfw.app.checkAuth();
                },
                failure: function (response) {
                    err.show();
                },
                callback: function () {
                    btn.setDisabled(false);
                }
            });
        }
    }
});
