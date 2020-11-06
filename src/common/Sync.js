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
                    confirm: false, // confirm will retry the request with a force param
                    sync: true // is sync call
                },
                formulas: {
                    heading: function (get) {
                        return get('title');
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
                    hidden: '{exception || warning || confirm}',
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
            }, {
                xtype: 'container',
                hidden: true,
                bind: {
                    hidden: '{!confirm}'
                },
                items: [{
                    xtype: 'component',
                    style: 'font-size: 14px;',
                    bind: {
                        html: '<p>{confirm.summary}</p>'
                    }
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    defaults: {
                        xtype: 'button',
                        margin: '8 16 8 0'
                    },
                    items: [{
                        text: 'Confirm',
                        bind: {
                            ui: 'action'
                        },
                        handler: function(btn) {
                            Sync.confirmHandler(btn);
                        }
                    }, {
                        text: 'Cancel',
                        bind: {
                            ui: '{(!confirmStackBtn.hidden || !confirm.stack) ? "" : "action"}'
                        },
                        handler: function (btn) {
                            var vm = btn.up('sheet').getViewModel();
                            var requestOptions = vm.get('confirm.requestOptions');

                            // The interfaces grid removes the grid item
                            // and marks it as dirty before the actionsheet returns
                            // if this happens, then we need to reload the store
                            // on the grid before we show the editor again
                            if(requestOptions && requestOptions?.scope?.url?.includes('Mfw.model.Interface')) {
                                var intfGrid = Ext.ComponentQuery.query('[alias=widget.mfw-settings-network-interfaces]');
                                // Reload the grid 
                                if(intfGrid) {
                                   intfGrid[0].getController().onLoad();
                                }
                            }

                            btn.up('sheet').hide();
                        }
                    }, {
                        reference: 'confirmStackBtn',
                        text: 'More info ...',
                        hidden: true,
                        publishes: ['hidden'],
                        bind: {
                            hidden: '{!confirm || !confirm.stack}'
                        },
                        handler: function (btn) {
                            btn.hide();
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
                        hidden: '{!confirmStackBtn.hidden || !confirm.stack}',
                        html: '<p style="font-size: 16px; font-weight: bold; margin: 0;"></p> <code>{confirm.stack}</code>'
                    }

                }]
            }]
        });
    },

    /**
     * progress is called to display the progress dialog within the exception actionsheet during non synchronous ajax calls
     * 
     * @param {string} title - A different title for display
     */
    progress: function (title) {
        var sheet = this.sheet,
            vm = sheet.getViewModel();
        vm.set({
            progress: true,
            success: false,
            exception: false,
            warning: false,
            confirm: false,
            title: title ||  'Saving...'
        });
        sheet.show();
    },

    /**
     * success is called for successful ajax calls, to display the successful sync message
     * 
     * @param {string} title - A different title for display
     * 
     */
    success: function (title) {
        var sheet = this.sheet,
            vm = sheet.getViewModel();

        vm.set({
            progress: false,
            success: true,
            title: title ||  'Saved'
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
            CommonUtil.showReauthRequired(this);
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
                // Aborted responses can return the [Object object] error here
                if(response.aborted) {
                    return;
                }

                // Response status of 0 means the server has disconnected gracefully, send them to login screen
                if(response.status == 0) {
                    CommonUtil.showReauthRequired(this);
                    return;
                }

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
            confirm: false,
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
            confirm: false,
            warning: warning,
            sync: isSync,
            title: title || 'Saved with warnings <i class=\'x-fa fa-exclamation-triangle\'></i>'
        });
        if (this.sheet.isHidden()) {
            this.sheet.show();
        }
    },

    /**
     * parseConfirmSummary will comparse the summary we received from sync-settings and display it properly, to the best of our ability
     * 
     * 
     * @param {string} summary - the summary, if valid json then we can probably parse it
     */
    parseConfirmSummary: function(summary) {
        try {
            var testDecode = Ext.decode(summary);
            var retSum = "";

            if (testDecode) {
                testDecode.forEach(function(decodeItem) {
                    retSum += "The " + decodeItem.affectedType + ": '" + decodeItem.affectedValue.description + "' will be disabled because the dependent " + decodeItem.invalidReasonType + ": '" + decodeItem.invalidReasonValue+"' is deleted or disabled.<br/>";
                });
            }

            if(retSum) {
                return retSum;
            }
        } catch(error) {
            return summary;
        }

        return summary;
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
            // parse the summary to see if its something we can make look nicer
            summary = Sync.parseConfirmSummary(Ext.isArray(match) ? match[2] : 'Unknown - Check More Info to see what happened.');        
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

    /**
     * confirmHandler will handle the "confirm" button on the confirmation action sheet.
     * this button will resend the previous request to the calling API, but with "force:true" appended
     * to the request param.  It will also attempt to reload any grids that may have been affected
     * from the calling requests
     * 
     * 
     * @param {button} btn | the button being referenced from this handler
     */
    confirmHandler: function(btn) {
        //Here we need to load the previous request, and set the force property to true before sending it again
        var vm = btn.up('sheet').getViewModel();
        var requestOptions = vm.get('confirm.requestOptions');
        Sync.progress();

        requestOptions.params = {force: true};
        requestOptions.success = function() {
            Sync.success();

            // The next two statements are pretty hacky
            // We don't have any knowledge of the Grid that is being saved here, because the caller for the action sheet
            // display is just being handled for any requestExceptions. So depending on where the RequestOptions 
            // URL scope was pointing to, we need to find specific tables that Might be currently viewed, and reload them 
            // after sync settings finishes so that they load the most recent rules into the table for display.
            if(requestOptions.scope.url.includes('Mfw.model.Interface')) {
                var intfGrid = Ext.ComponentQuery.query('[alias=widget.mfw-settings-network-interfaces]');
                // Reload the grid 
                if(intfGrid) {
                   intfGrid[0].getController().onLoad();
                }
            }

            if(requestOptions.scope.url.includes('WanPolicy')) {
                var wanPoliciesTable = Ext.ComponentQuery.query('[alias=widget.mfw-settings-routing-wan-policies]');
                if(Array.isArray(wanPoliciesTable) && wanPoliciesTable.length > 0) {
                    wanPoliciesTable[0].getController().onLoad();
                }
            }

            if(requestOptions.scope.url.includes('Mfw.model.table.Chain')) {
                var wanRulesTable = Ext.ComponentQuery.query('[alias=widget.mfw-settings-routing-wan-rules]');
                if(Array.isArray(wanRulesTable) && wanRulesTable.length > 0) {
                    wanRulesTable[0].getController().onLoad();
                }
            }
        };
        requestOptions.failure = function () {
            console.error('Failure sending Force Confirmation from UI');
        };
        // Remove callbacks from the previous requestOptions
        requestOptions.callback = null;
        Ext.Ajax.request(requestOptions);
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
