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
                            return 'Saving ...';
                        }
                        if (get('exception')) {
                            return get('title');
                        }

                        if (get('warning')) {
                            return 'Saved with warnings <i class=\'x-fa fa-exclamation-triangle\'></i>';
                        }

                        if (get('success')) {
                            return 'Saved';
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
                    hidden: true,
                    bind: {
                        html: '<h2 style="font-weight: 100; margin: 0;">Please review the following</h2>',
                        hidden: '{!stack}'
                    }
                }, {
                    xtype: 'component',
                    style: 'font-size: 14px;',
                    bind: {
                        html: '<p>{exception.summary}</p>',
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
                        html: '<h2 style="font-weight: 100; margin: 0;">Please review the following</h2><p>{warning.summary}</p>'
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
                        title: 'Unable to perform operation',
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
            title: (opt && opt.title) ? opt.title :  'Unable to perform operation'
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

    /**
     * handleResponseOutput is used to route exceptions, warnings, errors, from any ajax calls for proper display when needed
     * 
     * @param {*} response 
     * @param {*} title 
     */
    handleResponseOutput: function(response, title) {
        // do not show error if license file non existent
        if (response.status === 500 && response.request.url.includes('/api/status/license')) {
            console.warn('License not found!');
            return;
        }

        // auth fail
        if (response.status === 403) {
            // avoid displaying the exception bottom sheet
            this.sheet.hide();

            /**
             * display auth fail message box
             * prevent showing more than a single dialog in case of multiple calls exceptions
             */
            if (!this.authExceptionDialog) {
                this.authExceptionDialog = Ext.create('Ext.MessageBox', {
                    title: 'Authentication failed',
                    message: 'Session has expired. Please login.',
                    width: 300,
                    showAnimation: null,
                    hideAnimation: null,
                    buttons: [{
                        text: 'OK',
                        ui: 'action',
                        handler: function () {
                            // reloading document will redirect to auth
                            document.location.reload();
                        }
                    }]
                }).show();
                this.authExceptionDialog.show();
            }
            return;
        }



        // if it's a sync API call
        if (response.request.url.includes('/api/settings')) {
            isSync = true;
        }

        // Handle Warnings and Confirmation errors
        if (response.responseJson) {
            if (response.responseJson.output) {
                if(response.responseJson.output.includes('WARNING')) {
                    return Sync.warning(response, title, isSync);
                }
                if(response.responseJson.output.includes('CONFIRM')) {
                    return Sync.confirm(response, title, isSync);
                }
            }
        }

        // At this point if there wasn't a server error, just return nothing.
        if(response.status != 200) {
            return Sync.exception(response, title, isSync);
        }

        return;
    },

    /**
     *  exception is used to display the exception type of dialog box in the exception actionsheet
     * 
     * 
     * @param {Object} response - The full response object from the confirm request/response
     * @param {String} title - A different title for display
     * @param {boolean} isSync - If this request is a sync-settings type of request
     */
    exception: function (response, title, isSync) {
        var exception, summary, stack;

        if (response.responseJson) {
            try {
                summary = response.responseJson.output.match(/Exception: (.*?)\n/g);
                if (Ext.isArray(summary)) {
                    summary = summary[0];
                } else {
                    summary = response.responseJson.error;
                }
                summary = summary.replace('Exception: ', '');
                stack = response.responseJson.output.replace(/\n/g, '</br>');
            } catch (e) {
                summary = Ext.JSON.encode(response.responseJson);
            }
        } else {
            if (response.responseText) {
                try {
                    var resp = Ext.JSON.decode(response.responseText, true);
                    summary = resp.error;
                    if (resp.output) {
                        stack = resp.output.replace(/\n/g, '</br>');
                    }
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
            sync: isSync,
            title: title || 'Unable to perform operation'
        });
        if (this.sheet.isHidden()) {
            this.sheet.show();
        }
    },

    /**
     * warning is used to display the warning type of dialog box in the exception actionsheet
     * 
     * 
     * @param {Object} response - The full response object from the confirm request/response
     * @param {String} title - A different title for display
     * @param {boolean} isSync - If this request is a sync-settings type of request
     */
    warning: function (response, title, isSync) {
        var regExp = /^(WARNING|Error)\:([\s\S]*?)$/gm, // ! to work it depends on how the backend sends output
            match, // the match against response output
            summary,
            stack,
            warning;


        if (response.responseJson) {
            match = regExp.exec(response.responseJson.output);
            summary = Ext.isArray(match) ? match[2] : 'Unknown - Check More Info to see what happened.';
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
            sync: isSync,
            title: title || 'Saved with warnings <i class=\'x-fa fa-exclamation-triangle\'></i>'
        });
        if (this.sheet.isHidden()) {
            this.sheet.show();
        }
    },

    /**
     * confirm is used to display the confirmation dialog box in the same location as the Exception actionsheet
     * 
     * @param {Object} response - The full response object from the confirm request/response
     * @param {String} title - A different title for display
     * @param {boolean} isSync - If this request is a sync-settings type of request
     */
    confirm: function(response, title, isSync) {
        var regExp = /^(.{0,11}CONFIRM)\:([\s\S]*?)$/gm,
        match,
        summary,
        stack,
        confirm;

        if (response.responseJson) {
            match = regExp.exec(response.responseJson.output);
            summary = Ext.isArray(match) ? match[2] : 'Unknown - Check More Info to see what happened.';
            stack = response.responseJson.output.replace(/\n/g, '</br>');
        }

        confirm = {
            summary: summary,
            stack: stack,
            requestOptions: response.request.options,
        };

        this.sheet.getViewModel().set({
            progress: false,
            success: false,
            exception: false,
            warning: false,
            confirm: confirm,
            sync: isSync,
            title: title || 'Please confirm the following...'
        });
        if (this.sheet.isHidden()) {
            this.sheet.show();
        }
    },

    hide: function () {
        this.sheet.hide();
    },
});

/**
 * Ext.Ajax.on requestexception hook allows sync to capture all exceptions from any AJAX calls and parse them appropriately for display
 * 
 * @param conn {Ext.data.Connection} - the connection of the request
 * @param response {Object} - The response object of the failed request
 */
Ext.Ajax.on('requestexception', function (conn, response) {
    // avoid showing exception when checking if user is authenticated in login screen
    var url = response.request.url;

    if ( url === '/account/status' ||
         url === '/account/login' ||
         url === '/api/sysupgrade' ||
         url.startsWith('/api/status/wantest') ) {
        return;
    }
    Sync.handleResponseOutput(response);
});

/**
 * Ext.Ajax.on requestcomplete hook allows sync to capture all requestcomplete backend calls, and parse them for any errors or messages
 *  
 *  @param conn {Ext.data.Connection} - the connection of the request
 *  @param response {Object} - The response object from the comleted request
 * */ 
Ext.Ajax.on('requestcomplete', function (conn, response) {
    if (response.request.method !== 'POST') { return; }

    Sync.handleResponseOutput(response);

});
