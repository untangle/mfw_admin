Ext.define('Mfw.settings.system.Upgrade', {
    extend: 'Ext.form.Panel',
    alias: 'widget.mfw-settings-system-upgrade',

    title: 'Upgrade'.t(),

    viewModel: {
        data: {
            system: null,
            checkProgress: false,
            newUpgrade: false,
            validImageFile: null
        }
    },

    layout: 'vbox',

    bodyPadding: 0,

    items: [{
        xtype: 'container',
        layout: {
            type: 'vbox',
            align: 'left'
        },
        items: [{
            xtype: 'component',
            padding: 16,
            html: '<h2 style="font-weight: 100; margin: 0;"><i class="x-fa fa-check-circle fa-green"></i>&nbsp; The system is running the latest version!</h2>',
            hidden: true,
            bind: {
                hidden: '{upgradeCheck.available}'
            }
        }, {
            xtype: 'container',
            padding: 16,
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
                handler: function() {
                    Util.upgradeNow();
                }
            }],
            hidden: true,
            bind: {
                hidden: '{!upgradeCheck.available}'
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
            multiple: false,
            accept: '.img.gz, .img',
            label: 'Choose File'.t(),
            listeners: {
                change: 'onFileChange'
            }
        }, {
            xtype: 'component',
            bind: {
                html: '{validImageFile === false ? "Image file must be *" + imageFileExtension : ""}'
            }
        }, {
            xtype: 'button',
            text: 'Upgrade',
            margin: '16 0 0 0',
            ui: 'action',
            handler: 'onSubmit',
            disabled: true,
            bind: {
                disabled: '{!validImageFile}'
            }
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

            Ext.Ajax.request({
                url: '/api/status/hardware',
                success: function (response) {
                    var hardware = Ext.decode(response.responseText),
                        boardName = hardware.boardName;

                    vm.set('imageFileExtension', '.img.gz');

                    // linksys boxes require .img files, not .img.gz
                    if (boardName && boardName.match(/linksys/i)) {
                        vm.set('imageFileExtension', '.img');
                    }
                },
                failure: function () {
                    vm.set('imageFileExtension', '.img.gz');
                }
            });
        },

        onFileChange: function (field, value) {
            var me = this,
                vm = me.getViewModel(),
                extension = vm.get('imageFileExtension');

            me.getViewModel().set('validImageFile', Ext.String.endsWith(value, String(extension)));
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
         * Upgrade via file upload
         * @param {*} btn
         */
        onSubmit: function (btn) {
            var form = btn.up('formpanel'),
                uploadMsg = '<p style="text-align: center;"><i class="fa fa-spinner fa-spin fa-fw"></i> Uploading upgrade image ...</p>',
                errorMsg = '<p style="text-align: center;"><i class="fa fa-exclamation-triangle" style="color: red;"></i> {0}</p>';

            if (!form.validate()) { return; }

            var msg = Ext.create('Ext.MessageBox', {
                bodyStyle: 'font-size: 14px; color: #333; padding: 32px 16px 0 16px;',
                message: uploadMsg,
                width: 360,
                showAnimation: null,
                hideAnimation: null,
                buttons: [{
                    text: 'Close',
                    ui: 'action',
                    hidden: true,
                    handler: function () {
                        msg.close();
                        form.down('filefield').reset();
                    }
                }]
            });
            msg.show();


            /**
             * uploads the image file
             * which triggers upgrade process if the file is valid
             */
            form.submit({
                url: '/api/sysupgrade',
                method: 'POST',
                // Set the timout for 6 minutes (60 MB file on 1.5Mbps connection)
                // when uploading an img.gz over encrypted connections (vpn, ssl)
                // they can sometimes fail due to the timeout
                timeout: 360000,
                success: function (form, result) {
                    // display errors received from backend
                    if (result.error) {
                        msg.setMessage(Ext.String.format(errorMsg, result.error));
                        msg.down('button').setHidden(false);
                        return;
                    }
                    // otherwise show pending upgrade
                    msg.hide();
                    Mfw.app.viewport.add({
                        xtype: 'upgrade-pending',
                        type: 'FILEUPLOAD'
                    }).show();
                },
                failure: function (form, result) {
                    /**
                     * this is an actual success upload, after which upgrade process starts
                     * the servers returns:
                     * {"success":false,"message":"Blocked a frame with origin \"http://e3\" from accessing a cross-origin frame."}
                     */
                    msg.hide();
                    Mfw.app.viewport.add({
                        xtype: 'upgrade-pending',
                        type: 'FILEUPLOAD'
                    }).show();
                }
            });
        }
    }

});
