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
                    progress: true,
                    success: false,
                    exception: false,
                    warning: false,
                },
                formulas: {
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
                items: {
                    xtype: 'component',
                    html: '<i class="fa fa-upload"></i> &nbsp; Sync Settings',
                    // bind: {
                    //     html: '{!exception ? "Sync Settings ..." : "Sync Settings: " + exception.statusText + " ("exception.status + ")"}'
                    // }
                    // html: status + ' - ' + statusText
                },
                style: 'background: #519839; color: #FFF; font-weight: 600;'
                // bind: {
                //     style: '{toolbarStyle}',
                // }
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
                    flex: 1,
                    style: 'font-size: 16px;',
                    bind: {
                        html: '<p style="color: red; margin: 0;"><strong>Exception:</strong> {exception.statusText} ({exception.status})</p>'
                    }
                }, {
                    xtype: 'component',
                    flex: 1,
                    style: 'font-size: 14px;',
                    bind: {
                        html: '<p>{exception.summary}</p>'
                    }
                }, {
                    xtype: 'button',
                    ui: 'alt decline',
                    text: 'Show full stack',
                    bind: {
                        hidden: '{!exception.stack}',
                    },
                    // hidden
                    handler: function (btn) {
                        btn.up('actionsheet').down('#fullstack').setHidden(false);
                        btn.hide();
                    }
                }, {
                    xtype: 'component',
                    itemId: 'fullstack',
                    hidden: true,
                    flex: 1,
                    bind: {
                        html: '<p style="font-size: 16px; font-weight: bold;">Full stack:</p> <code>{exception.stack}</code>'
                    }

                }]
            }],

            listeners: {
                hide: function (sheet) {
                    sheet.getViewModel().set({
                        progress: true,
                        exception: false,
                        warning: false
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
        var sheet = this.sheet;
        sheet.getViewModel().set({
            progress: false,
            success: true
        });
        Ext.defer(function () {
            sheet.hide();
        }, 500);
    },

    exception: function (response) {
        var exception, summary, stack;

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
            exception: exception
        });
    },

    hide: function () {
        this.sheet.hide();
    },
});

// capture Ajax exceptions
Ext.Ajax.on('requestexception', function (conn, response) {
    /**
     * temporary fix to avoid showing exception when checking if user is authenticated in login screen
     * or invalid username or password
     */
    var url = response.request.url;
    if ( url === '/account/status' || url === '/account/login') {
        return;
    }
    Sync.exception(response);
    // Exception.show(response);
});
