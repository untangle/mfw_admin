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
                hidden: '{upgradeStatus.available}'
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
                hidden: '{!upgradeStatus.available}'
            }
        }]
    }, {
        xtype: 'formpanel',
        itemId: 'autoUpgradeCmp',
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
            activeBoxLabel: 'Automatically install upgrades',
            inactiveBoxLabel: 'Do not install upgrades automatically',
            bind: '{upgradeSettings.enabled}'
        }, {
            xtype: 'component',
            margin: '16 0 0 0',
            style: 'font-size: 14px;',
            html: 'Select the day and time to upgrade automatically'
        }, {
            xtype: 'containerfield',
            layout: 'hbox',
            defaults: {
                labelAlign: 'top',
                disabled: true,
                bind: {
                    disabled: '{!upgradeSettings.enabled}'
                }
            },
            items: [{
                xtype: 'selectfield',
                label: 'Day of the Week',
                width: 150,
                options: [
                    { text: 'Sunday', value: 0 },
                    { text: 'Monday', value: 1 },
                    { text: 'Tuesday', value: 2 },
                    { text: 'Wednesday', value: 3 },
                    { text: 'Thursday', value: 4 },
                    { text: 'Friday', value: 5 },
                    { text: 'Saturday', value: 6 }
                ],
                bind: {
                    value: '{upgradeSettings.dayOfWeek}'
                }
            }, {
                xtype: 'timefield',
                label: 'Time',
                width: 100,
                editable: false,
                margin: '0 16',
                listeners: {
                    change: 'onTimeChange'
                }
            }]
        }, {
            xtype: 'button',
            ui: 'action',
            margin: '16 0',
            text: 'Save Changes',
            handler: 'saveAutoUpgradeSettings'
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
            text: 'Upgrade',
            margin: '16 0 0 0',
            ui: 'action',
            handler: 'onSubmit'
        }]
    }],

    controller: {

        init: function (view) {
            var vm = view.getViewModel(),
                defaultUpgradeSettings = {
                    enabled: true,
                    dayOfWeek: 6,
                    // timeOfDay: '18:20'
                    hourOfDay: 0,
                    minuteOfHour: 0
                };

            Ext.Ajax.request({
                url: '/api/status/upgrade',
                success: function (response) {
                    var resp = Ext.decode(response.responseText);
                    vm.set('upgradeStatus', resp);
                },
                failure: function () {
                    console.error('Unable to get data');
                }
            });

            Ext.Ajax.request({
                url: '/api/settings/system/autoUpgrade',
                success: function (response) {
                    var resp = Ext.decode(response.responseText),
                        timeOfDay = new Date();

                    if (!resp) {
                        vm.set('upgradeSettings', defaultUpgradeSettings);
                        // settings.json not havinf auto upgrade settings set
                    } else {
                        vm.set('upgradeSettings', resp);
                    }

                    timeOfDay.setHours(vm.get('upgradeSettings.hourOfDay'), vm.get('upgradeSettings.minuteOfHour'), 0, 0);

                    view.down('timefield').setValue(timeOfDay);
                },
                failure: function () {
                    console.warn('Unable to get upgrade settings!');
                }
            });
        },

        onTimeChange: function () {
            var me = this,
                vm = me.getViewModel(),
                time = me.getView().down('timefield').getValue();

            vm.set('upgradeSettings.hourOfDay', time.getHours());
            vm.set('upgradeSettings.minuteOfHour', time.getMinutes());
        },


        saveAutoUpgradeSettings: function () {
            var vm = this.getViewModel();

            Sync.progress();

            Ext.Ajax.request({
                url: '/api/settings/system/autoUpgrade',
                method: 'POST',
                params: Ext.JSON.encode(vm.get('upgradeSettings')),
                success: function () {
                    Sync.success();
                },
                failure: function(response) {
                    console.log('server-side failure with status code ' + response.status);
                }
            });
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
