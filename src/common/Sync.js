Ext.define('Mfw.Sync', {
    alternateClassName: 'Sync',
    singleton: true,
    sheet: null,

    init: function () {
        this.sheet = Ext.create({
            xtype: 'actionsheet',
            side: 'bottom',
            exit: 'bottom',
            layout: 'vbox',
            showAnimation: false,
            hideAnimation: false,
            scrollable: false,
            maxHeight: 500,
            zIndex: 888,
            toFrontOnShow: true,
            viewModel: {
                data: {
                    progress: true, // progress state
                    success: false, // sucess response
                    exception: false, // exception data
                    warning: false, // warning data
                    sync: true // is sync call
                },
                formulas: {
                    heading: function (get) {
                        if (get('progress')) {
                            if (get('sync')) {
                                return '<i class=\'fa fa-upload\'></i> &nbsp; Sync Settings ...';
                            } else {
                                return '<i class=\'fa fa-upload\'></i> &nbsp; Saving ...';
                            }
                        }
                        // otherwise show warning or exception heading
                        if (get('exception')) {
                            if (get('sync')) {
                                return '<i class=\'fa fa-exclamation-triangle\'></i> &nbsp; Sync Settings ... failed!';
                            } else {
                                return '<i class=\'fa fa-exclamation-triangle\'></i> &nbsp; Failure!';
                            }
                        }

                        if (get('warning')) {
                            if (get('sync')) {
                                return '<i class=\'fa fa-check\'></i> &nbsp; Sync Settings ... saved!';
                            } else {
                                return '<i class=\'fa fa-check\'></i> &nbsp; Saving ... saved!';
                            }
                        }

                        if (get('success')) {
                            if (get('sync')) {
                                return '<i class=\'fa fa-check\'></i> &nbsp; Sync Settings ... saved!';
                            } else {
                                return '<i class=\'fa fa-check\'></i> &nbsp; Saving ... saved!';
                            }
                        }
                    },
                    headingStyle: function (get) {
                        if (get('exception')) {
                            return 'background: #c62828; color: #FFF; font-weight: 600;';
                        }
                        return 'background: #519839; color: #FFF; font-weight: 600;';
                    },
                    message: function (get) {
                        if (get('progress')) {
                            return '<p><i class="fa fa-spinner fa-spin fa-fw"></i> &nbsp; Applying changes. This may take a while! Please wait ...</p>';
                        }
                        if (get('success')) {
                            return '<p><i class="fa fa-check-circle" style="color: #519839;"></i> &nbsp; Success!</p>';
                        }
                    }
                }
            },

            bind: {
                scrollable: '{exception || warning}',
                hideOnMaskTap: '{exception || warning}',
                // height: '{!exception && !warning ? 100 : "auto"}'
            },

            items: [{
                xtype: 'toolbar',
                docked: 'top',
                items: [{
                    xtype: 'component',
                    bind: {
                        html: '{heading}'
                    }
                }],
                bind: {
                    style: '{headingStyle}'
                }
            }, {
                xtype: 'component',
                style: 'font-size: 14px; color: #555;',
                hidden: true,
                bind: {
                    hidden: '{exception || warning}',
                    html: '{message}',
                }
            }, {
                xtype: 'container',
                hidden: true,
                bind: {
                    hidden: '{!exception}'
                },
                items: [{
                    xtype: 'component',
                    style: 'font-size: 16px;',
                    bind: {
                        html: '<h2 style="font-weight: 400; margin: 0;">Exception: {exception.statusText} ({exception.status})</h2><p>{exception.summary}</p>'
                    }
                }, {
                    xtype: 'button',
                    reference: 'exceptionStackBtn',
                    ui: 'action',
                    text: 'More ...',
                    hidden: true,
                    publishes: ['hidden'],
                    bind: {
                        hidden: '{!exception || !exception.stack}'
                    },
                    handler: function (btn) {
                        btn.hide();
                    }
                }, {
                    xtype: 'component',
                    itemId: 'fullstack',
                    hidden: true,
                    flex: 1,
                    bind: {
                        hidden: '{!exceptionStackBtn.hidden || !exception.stack}',
                        html: '<hr style="margin: 32px 0;"/><p style="font-size: 16px; font-weight: bold;"></p> <code>{exception.stack}</code>'
                    }

                }]
            }, {
                xtype: 'container',
                hidden: true,
                bind: {
                    hidden: '{!warning}'
                },
                items: [{
                    xtype: 'component',
                    style: 'font-size: 16px;',
                    bind: {
                        html: '<h2 style="font-weight: 400; margin: 0;">Warning!</h2><p>{warning.summary}</p>'
                    }
                }, {
                    xtype: 'button',
                    reference: 'warningStackBtn',
                    ui: 'action',
                    text: 'More ...',
                    hidden: true,
                    publishes: ['hidden'],
                    margin: '16 0 0 0',
                    bind: {
                        hidden: '{!warning || !warning.stack}'
                    },
                    handler: function (btn) {
                        btn.hide();
                    }
                }, {
                    xtype: 'component',
                    itemId: 'fullstack',
                    hidden: true,
                    flex: 1,
                    bind: {
                        hidden: '{!warningStackBtn.hidden || !warning.stack}',
                        html: '<hr style="margin: 32px 0;"/><p style="font-size: 16px; font-weight: bold;"></p> <code>{warning.stack}</code>'
                    }

                }]
            }],

            listeners: {
                hide: function (sheet) {
                    sheet.getViewModel().set({
                        progress: false,
                        success: false,
                        exception: false,
                        warning: false,
                        sync: true // boolean to identify if it's a sync update
                    });
                }
            }
        });
    },

    progress: function () {
        this.sheet.getViewModel().set({
            progress: true,
            success: false,
            exception: false,
            warning: false
        });
        this.sheet.show();
    },

    success: function () {
        var sheet = this.sheet,
            vm = sheet.getViewModel();

        vm.set({
            progress: false,
            success: true
        });

        // if success but have to display a warning, keep sheet visible
        if (!vm.get('warning')) {
            Ext.defer(function () {
                sheet.hide();
            }, 1000);
        }
    },

    exception: function (response) {
        var exception, summary, stack, isSync = false;

        // if it's a sync API call
        if (response.request.url.includes('/api/settings')) {
            isSync = true;
        }

        if (response.responseJson) {
            // store sync, model save
            summary = response.responseJson.output.match(/Exception: (.*?)\n/g);

            if (Ext.isArray(summary)) {
                summary = summary[0];
            } else {
                summary = response.responseJson.error;
            }
            summary = summary.replace('Exception: ', '');
            stack = response.responseJson.output.replace(/\n/g, '</br>');
        } else {
            // ajax
            if (response.responseText) {
                summary = Ext.JSON.decode(response.responseText).error;
            } else {
                return;
            }
        }
        exception = {
            status: response.status,
            statusText: response.statusText,
            summary: summary,
            stack: stack
        };

        this.sheet.getViewModel().set({
            progress: false,
            success: false,
            exception: exception,
            warning: false,
            sync: isSync
        });
        if (this.sheet.isHidden()) {
            this.sheet.show();
        }
    },

    warning: function (response) {
        var regExp = /Error: ([\s\S]*?)\^\^\^\^\^/gm, // ! to work it depends on how the backend sends output
            match, // the match against response output
            summary,
            stack,
            isSync = false,
            warning;

        // if it's a sync API call
        if (response.request.url.includes('/api/settings')) {
            isSync = true;
        }

        if (response.responseJson) {
            match = regExp.exec(response.responseJson.output);
            summary = match[1] || 'Unknown';
            stack = response.responseJson.output.replace(/\n/g, '</br>');
        }

        warning = {
            statusText: 'Warning ...',
            summary: summary,
            stack: stack
        };

        this.sheet.getViewModel().set({
            progress: false,
            success: true,
            exception: false,
            warning: warning,
            sync: isSync
        });
        if (this.sheet.isHidden()) {
            this.sheet.show();
        }
    },

    hide: function () {
        this.sheet.hide();
    },
});

// capture all AJAX exceptions
Ext.Ajax.on('requestexception', function (conn, response) {
    // avoid showing exception when checking if user is authenticated in login screen
    console.log('exception');
    var url = response.request.url;
    if ( url === '/account/status' || url === '/account/login') {
        return;
    }
    Sync.exception(response);
});

// capture sync warnings
Ext.Ajax.on('requestcomplete', function (conn, response) {
    var output;

    if (response.request.method !== 'POST') { return; }

    if (response.responseJson) {
        output = response.responseJson.output;
    }

    if (output.includes('WARNING')) {
        Sync.warning(response);
    }
});
