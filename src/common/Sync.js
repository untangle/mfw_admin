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
            alwaysOnTop: true,
            hideOnMaskTap: false,
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
                            return '<i class=\'x-fa fa-upload\'></i> &nbsp; Saving ...';
                        }
                        if (get('exception')) {
                            return '<i class=\'x-fa fa-ban\'> ' + get('errTitle');
                        }

                        if (get('warning')) {
                            return '<i class=\'x-fa fa-check fa-orange\'></i> &nbsp; Saved with warnings';
                        }

                        if (get('success')) {
                            return '<i class=\'x-fa fa-check\'></i> &nbsp; Successfully saved';
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
                            return '<p><i class="x-fa fa-spinner fa-spin fa-fw"></i> &nbsp; Applying changes. This may take a while! Please wait ...</p>';
                        }
                        if (get('success')) {
                            return '<p><i class="x-fa fa-check-circle" style="color: #519839;"></i> &nbsp; Success!</p>';
                        }
                    }
                }
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
                    style: 'font-size: 14px;',
                    bind: {
                        html: '<h2 style="font-weight: 100;">Please review the following:</h2><p><i class="x-fa fa-ban fa-red"></i> {exception.summary}</p>'
                    }
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    defaults: {
                        xtype: 'button',
                        margin: '8 16 8 0'
                    },
                    items: [{
                        reference: 'exceptionStackBtn',
                        ui: 'action',
                        text: 'More info ...',
                        hidden: true,
                        publishes: ['hidden'],
                        bind: {
                            hidden: '{!exception || !exception.stack}'
                        },
                        handler: function (btn) {
                            btn.hide();
                        }
                    }, {
                        text: 'Close',
                        bind: {
                            ui: '{exceptionStackBtn.hidden ? "action" : ""}'
                        },
                        handler: function (btn) {
                            btn.up('sheet').hide();
                        }
                    }]
                }, {
                    xtype: 'component',
                    hidden: true,
                    maxHeight: 300,
                    scrollable: true,
                    flex: 1,
                    margin: '8 0 0 0',
                    style: 'background: #f1f1f1;',
                    padding: 16,
                    bind: {
                        hidden: '{!exceptionStackBtn.hidden || !exception.stack}',
                        html: '<p style="font-size: 16px; font-weight: bold; margin: 0;"></p> <code>{exception.stack}</code>'
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
                    style: 'font-size: 14px;',
                    bind: {
                        html: '<h2 style="font-weight: 100;">Please review the following:</h2><p><i class="x-fa fa-exclamation-triangle fa-orange"></i> {warning.summary}</p>'
                    }
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    defaults: {
                        xtype: 'button',
                        margin: '8 16 8 0'
                    },
                    items: [{
                        reference: 'warningStackBtn',
                        ui: 'action',
                        text: 'More info ...',
                        hidden: true,
                        publishes: ['hidden'],
                        bind: {
                            hidden: '{!warning || !warning.stack}'
                        },
                        handler: function (btn) {
                            btn.hide();
                        }
                    }, {
                        text: 'Close',
                        bind: {
                            ui: '{(!warningStackBtn.hidden || !warning.stack) ? "" : "action"}'
                        },
                        handler: function (btn) {
                            btn.up('sheet').hide();
                        }
                    }]
                }, {
                    xtype: 'component',
                    hidden: true,
                    maxHeight: 300,
                    scrollable: true,
                    flex: 1,
                    margin: '8 0 0 0',
                    style: 'background: #f1f1f1;',
                    padding: 16,
                    bind: {
                        hidden: '{!warningStackBtn.hidden || !warning.stack}',
                        html: '<p style="font-size: 16px; font-weight: bold; margin: 0;"></p> <code>{warning.stack}</code>'
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
                        errTitle: 'Unable to save',
                        sync: true // boolean to identify if it's a sync update
                    });
                }
            }
        });
    },

    progress: function (opt) {
        this.sheet.getViewModel().set({
            progress: true,
            success: false,
            exception: false,
            warning: false,
            errTitle: (opt && opt.errTitle) ? opt.errTitle :  'Unable to save'
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
                try {
                    summary = Ext.JSON.decode(response.responseText, true).error;
                } catch(e) {
                    summary = response.responseText;
                }
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
        var regExp = /Error: ([\s\S]*?)\^/gm, // ! to work it depends on how the backend sends output
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
            summary = Ext.isArray(match) ? match[1] : 'Unknown';
            stack = response.responseJson.output.replace(/\n/g, '</br>');
        }

        warning = {
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
    var url = response.request.url;
    if ( url === '/account/status' || url === '/account/login' || url === '/api/sysupgrade') {
        return;
    }
    Sync.exception(response);
});

// capture sync warnings
Ext.Ajax.on('requestcomplete', function (conn, response) {
    if (response.request.method !== 'POST') { return; }

    if (response.responseJson) {
        if (response.responseJson.output && response.responseJson.output.includes('WARNING')) {
            Sync.warning(response);
        }
    }
});
