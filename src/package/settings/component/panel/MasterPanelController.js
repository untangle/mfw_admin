/**
 * MasterPanel controller
 * Methods can be overridden by child controllers extending this
 */
Ext.define('Mfw.cmp.grid.MasterPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.masterpanel',

    onInitialize: function (p) {
        var toolbarActions = [],
            toolbarMenu;

        if (p.getEnableSave()) {
            toolbarActions.push({
                xtype: 'button',
                text: 'Save'.t(),
                iconCls: 'md-icon-save',
                ui: 'action',
                align: 'right',
                handler: 'onSave'
            });
        }

        if (p.getEnableReload() || p.getEnableReset()) {
            toolbarMenu = {
                xtype: 'button',
                iconCls: 'md-icon-more-vert',
                arrow: false,
                ui: 'action',
                align: 'right',
                menu: {
                    items: []
                }
            };

            if (p.getEnableReload()) {
                toolbarMenu.menu.items.push( { text: 'Reload'.t(), iconCls: 'x-fa fa-undo', handler: 'onLoad' } );
            }

            if (p.getEnableReset()) {
                toolbarMenu.menu.items.push( { text: 'Reset to defaults'.t(), iconCls: 'x-fa fa-refresh', handler: 'onReset' } );
            }

            toolbarActions.push(toolbarMenu);
        }

        if (toolbarActions.length > 0) {
            p.getHeader().add(toolbarActions);
        }
        this.onLoad();
    },

    onLoad: function () {
        var me = this, panel = me.getView();

        panel.mask({xtype: 'loadmask'});

        me.getView().getRecordModel().load({
            success: function (rec) {
                me.getViewModel().set('rec', rec);
            },
            failure: function () {
                console.warn('Unable to load settings!');
            },
            callback: function () {
                panel.unmask();
            }
        });
    },

    onSave: function () {
        var me = this, panel = me.getView();

        panel.mask({xtype: 'loadmask'});

        if (panel.down('mastergrid')) {
            panel.down('mastergrid').fireEvent('beforesave');
            // commit changes so the records not dirty
            panel.down('mastergrid').getStore().commitChanges();
        }
        panel.getRecordModel().save({
            success: function () {
                Ext.toast('Settings saved!');
            },
            failure: function () {
                console.warn('Unable to save settings!');
            },
            callback: function () {
                panel.unmask();
            }
        });
    },

    onReset: function () {
        var me = this, panel = me.getView(),
            proxy = panel.getRecordModel().getProxy(),
            api = proxy.getApi();

        Ext.Msg.confirm('<i class="x-fa fa-exclamation-triangle"></i> Warning',
            '<strong>' + panel.getTitle() + '</strong> will be reset to factory defaults.  All non-default settings will be removed.<br/>Do you want to continue?',
            function (answer) {
                if (answer === 'yes') {
                    // update proxy api to support reset
                    proxy.setApi({ read: api.read.replace('/settings/', '/defaults/') });
                    // revert api to it's default values
                    panel.getRecordModel().load({
                        success: function (rec) {
                            // me.getViewModel().set('rec', rec);
                            console.log(rec.getData());
                            proxy.setApi(api);
                        }
                    });
                }
            });
    }

});
