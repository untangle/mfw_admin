Ext.define('Mfw.settings.system.Upgrade', {
    extend: 'Ext.form.Panel',
    alias: 'widget.mfw-settings-system-upgrade',

    title: 'Upgrade'.t(),

    viewModel: {
        data: {
            system: null,
            checkProgress: false,
            newUpgrade: false
        }
    },

    layout: 'vbox',

    bodyPadding: 0,

    items: [{
        xtype: 'container',
        hidden: true,
        padding: 16,
        layout: {
            type: 'vbox',
            align: 'left'
        },
        items: [{
            xtype: 'component',
            html: '<h2 style="font-weight: 100;"><i class="x-fa fa-check-circle fa-green"></i>&nbsp; The system is running the latest version!</h2>',
            hidden: true,
            bind: {
                hidden: '{newUpgrade}'
            }
        }, {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [{
                xtype: 'component',
                html: '<h2 style="font-weight: 100;"><i class="x-fa fa-exclamation-triangle fa-orange"></i>&nbsp; A new version is available.</h2>'
            }, {
                xtype: 'button',
                ui: 'action',
                margin: '0 0 0 16',
                text: 'UPGRADE NOW',
                handler: 'startUpgrade'
            }],
            hidden: true,
            bind: {
                hidden: '{!newUpgrade}'
            }
        }, {
            xtype: 'button',
            ui: 'action',
            margin: '16 0 8 0',
            disabled: true,
            bind: {
                text: '{checkProgress ? "<i class=\'fa fa-spinner fa-spin fa-fw\'></i> Checking ..." : "Check for Updates"}',
                disabled: '{checkProgress}'
            },
            handler: 'checkUpgrade'
        }, {
            xtype: 'component',
            html: 'Last check: 12/12/2019 10:20:20 PM'
        }]
    }, {
        xtype: 'formpanel',
        hidden: true,
        bodyPadding: 16,
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            shadow: false,
            items: [{
                xtype: 'component',
                html: 'Auto Upgrades'
            }]
        }, {
            xtype: 'togglefield',
            reference: 'toggle',
            boxLabel: 'Automatically Install Upgrades',
            bodyAlign: 'start',
            value: true
        }, {
            xtype: 'component',
            margin: '16 0 0 0',
            style: 'font-size: 14px;',
            html: 'Select day and time when automatically upgrade should start'
        }, {
            xtype: 'containerfield',
            layout: 'hbox',
            defaults: {
                labelAlign: 'top',
                disabled: true,
                bind: {
                    disabled: '{!toggle.value}'
                }
            },
            items: [{
                xtype: 'selectfield',
                label: 'Day of the Week',
                width: 150,
                value: 'SAT',
                options: [
                    { text: 'Sunday', value: 'SUN' },
                    { text: 'Monday', value: 'MON' },
                    { text: 'Tuesday', value: 'TUE' },
                    { text: 'Wednesday', value: 'WED' },
                    { text: 'Thursday', value: 'THU' },
                    { text: 'Friday', value: 'FRI' },
                    { text: 'Saturday', value: 'SAT' }
                ]
            }, {
                xtype: 'timefield',
                label: 'Time',
                width: 100,
                editable: false,
                margin: '0 16',
                value: '12:00 AM'
            }]
        }, {
            xtype: 'button',
            ui: 'action',
            margin: '16 0',
            text: 'Save Changes',
        }]
    }, {
        xtype: 'formpanel',
        enctype: 'multipart/form-data',
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            shadow: false,
            items: [{
                xtype: 'component',
                html: 'Upgrade from a file'
            }]
        }, {
            xtype: 'filefield',
            width: 400,
            name: 'file',
            required: true,
            label: 'Choose File'.t(),
            // labelAlign: 'top'
        }, {
            xtype: 'button',
            text: 'Upload',
            margin: '16 0 0 0',
            ui: 'action',
            handler: 'onSubmit'
        }]
    }],

    controller: {
        checkUpgrade: function () {
            var me = this, vm = me.getViewModel();
            vm.set('checkProgress', true);
            Ext.defer(function () {
                vm.set({
                    newUpgrade: !vm.get('newUpgrade'),
                    checkProgress: false
                });
            }, 5000);
        },

        /**
         * !!! todo, duplicated from main header, needs to be general accessible
         */
        startUpgrade: function () {
            Ext.Msg.show({
                title: '<i class="x-fa fa-exclamation-triangle"></i> Warning',
                message: 'The upgrade might take a few minutes!<br/>During this period the internet connection can be lost.<br/><br/>Do you want to continue?',
                // width: 300,
                showAnimation: null,
                hideAnimation: null,
                // closeAction: 'destroy',
                buttons: [{
                    text: 'NO',
                    handler: function () { this.up('messagebox').hide(); }
                }, {
                    text: 'YES',
                    ui: 'action',
                    margin: '0 0 0 16',
                    handler: function () {
                        this.up('messagebox').hide();
                        Mfw.app.viewport.add({
                            xtype: 'upgrade-dialog'
                        }).show();
                    }
                }]
            });
        },

        onSubmit: function (btn) {
            var form = btn.up('formpanel');

            if (!form.validate()) { return; }


            Ext.Msg.show({
                title: 'Uploading the upgrade image',
                message: '<p style="text-align: center;"><i class="fa fa-spinner fa-spin fa-fw"></i> Please wait ...</p>',
                buttons: []
            });

            /**
             * this will fail because some iframe cross origin issue returning
             * responseText: {"success":false,"message":"Blocked a frame with origin \"http://sdwan\" from accessing a cross-origin frame."}
             * even if the file is successfully uploaded and upgrade is done
             */
            form.submit({
                url: '/api/sysupgrade',
                method: 'POST',
                success: function () {
                    Ext.Msg.hide();
                },
                failure: function () {
                    // assume the upload is successful even response is failure
                    Ext.Msg.hide();
                    Mfw.app.viewport.add({
                        xtype: 'upgrade-dialog'
                    }).show();
                }
            });
        }
    }

});
