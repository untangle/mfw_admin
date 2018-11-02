Ext.define('Mfw.auth.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-pkg-auth',

    config: {
        redirectRoute: null
    },

    layout: {
        type: 'vbox',
        pack: 'center',
        align: 'middle'
    },

    style: 'background: rgba(0, 0, 0, 0.2)',

    padding: '0 0 200 0',
    items: [{
        xtype: 'formpanel',
        keyMapEnabled: true,
        keyMap: {
            enter: {
                key: Ext.event.Event.ENTER,
                handler: 'onLogin'
            }
        },
        padding: 16,
        width: 250,
        // title: 'Log in...',
        // border: true,
        // margin: '0 0 100 0',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        defaults: {
            autoComplete: false,
            // labelAlign: 'left',
            // labelTextAlign: 'right',
            // margin: '16 0'
        },
        items: [{
            xtype: 'component',
            style: 'text-align: center;',
            margin: '0 0 0 0',
            html: '<img src="' + Mfw.app.getResourcesPath() + '/untangle-logo.png">'
        }, {
            xtype: 'component',
            html: '<h2 style="color: #777; font-weight: normal; text-align: center;">Please sign in ...</h3>'
        }, {
            xtype: 'component',
            style: 'color: red; text-align: center;',
            itemId: 'error'
        }, {
            xtype: 'textfield',
            name: 'username',
            label: 'Username'.t(),
            required: true
        }, {
            xtype: 'passwordfield',
            name: 'password',
            label: 'Password'.t(),
            required: true
        }, {
            xtype: 'button',
            ui: 'action',
            text: 'Log in',
            margin: '32 0 0 0',
            handler: 'onLogin'
        }],
    }],

    listeners: {
        hide: 'onHide'
    },

    controller: {
        onLogin: function () {
            var me = this,
                form = me.getView().down('formpanel'),
                btn = form.down('button'),
                redirectRoute = Mfw.app.getRouteAfterAuth() || '';

            console.log(redirectRoute);

            if (!form.validate()) { return; }

            btn.setDisabled(true);
            Ext.Ajax.request({
                url: '/account/login',
                method: 'POST',
                params: form.getValues(),
                success: function () {
                    // if (redirectRoute === '#auth') {
                    //     Mfw.app.redirectTo('#');
                    // } else {
                    //     Mfw.app.redirectTo(redirectRoute);
                    // }
                    Mfw.app.redirectTo(redirectRoute);
                    document.location.reload();
                    // btn.setDisabled(false);
                },
                failure: function (response) {
                    var obj = Ext.decode(response.responseText);
                    form.down('#error').setHtml(obj.error);
                    btn.setDisabled(false);
                }
            });
        },

        onHide: function (view) {
            var form = view.down('formpanel');
            form.reset(true);
            form.down('#error').setHtml('');
        }
    }
});
