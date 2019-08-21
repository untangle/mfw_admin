Ext.define('Mfw.settings.system.Logging', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-system-logging',

    title: 'Logging',
    layout: 'fit',

    viewModel: {
        data: {
            logtype: 'LOGREAD' // 'LOGREAD' or 'DMESG'
        }
    },

    items: [{
        xtype: 'container',
        style: 'font-size: 14px;',
        layout: 'fit',
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            items: [{
                xtype: 'button',
                bind: {
                    ui: '{logtype === "LOGREAD" ? "action" : ""}'
                },
                text: 'Logread',
                handler: 'switchLogType',
                value: 'LOGREAD'
            },
            {
                xtype:'button',
                text: 'Dmesg',
                bind: {
                    ui: '{logtype === "DMESG" ? "action" : ""}'
                },
                handler: 'switchLogType',
                value: 'DMESG',
                margin: '0 0 0 16'
            }, {
                xtype: 'toolbarseparator',
                style: 'background: #CCC',
                margin: '0 16'
            }, {
                xtype:'button',
                iconCls: 'md-icon-refresh',
                tooltip: 'Refresh',
                handler: 'fetchLogs',
                margin: '0 8 0 0'
            }, {
                xtype:'button',
                iconCls: 'x-fa fa-floppy-o',
                tooltip: 'Save',
                handler: 'saveLogs'
            }]
        }, {
            // use textarea to avoid converting new-line chars into line break (<br>) tags
            xtype: 'textareafield',
            editable: false,
            cls: 'mfw-logger', // custom class to style the content
            itemId: 'logger',
            value: ''
        }]
    }],

    listeners: {
        activate: 'onActivate'
    },
    controller: {
        onActivate: function (view) {
            var me = this, logContainer = view.down('#logger');

            // when switching from LOGREAD to DMESG, clear log container and refetch
            this.getViewModel().bind('{logtype}', function () {
                logContainer.setValue('');
                me.fetchLogs();
            });
        },

        /**
         * logtype switcher
         */
        switchLogType: function (btn) {
            this.getViewModel().set('logtype', btn.getValue());
        },

        /**
         * fetches the logs for the selected logtype and appends content to existing rendered logs
         */
        fetchLogs: function () {
            var logContainer = this.getView().down('#logger'),
                currentLog = logContainer.getValue(),
                scrollEl = logContainer.ariaEl.dom, // textarea dom element to scroll at bottom
                logtype = this.getViewModel().get('logtype');

            Ext.Ajax.request({
                url: '/api/logging/' + logtype.toLowerCase(),
                success: function (response) {
                    // append or insert log result
                    logContainer.setValue(currentLog + Ext.util.Base64.decode(Ext.decode(response.responseText).logresults));
                    // hopefully should scroll to bottom of textarea
                    scrollEl.scrollTop = scrollEl.scrollHeight;
                },
                failure: function () {
                    // will fallback to the generic error handler, no need to set something
                }
            });
        },

        saveLogs: function () {
            var log = this.getView().down('#logger').getValue(),
                logtype = this.getViewModel().get('logtype'),
                time = moment.tz(Mfw.app.tz.displayName).format('DD-MM-YY-hhmmA'), // timestamp used in file name
                link = document.createElement('a');

            // create a link with log content and save to a file
            link.setAttribute('href', 'data:text;charset=utf-8,' + log);
            link.setAttribute('download', logtype.toLowerCase() + '_' + time + '.log');
            link.click();
        }
    }

});
