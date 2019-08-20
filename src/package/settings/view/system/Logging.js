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
            shadow: false,
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
                handler: 'fetchLogs'
            }]
        }, {
            xtype: 'component',
            itemId: 'logger',
            padding: 16,
            style: 'font-family: Courier, mono-spaced; font-size: 12px; color: #333;',
            scrollable: true,
            bind: {
                html: '{loginfo}'
            }
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
                logContainer.setHtml('');
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
                currentLog = logContainer.getHtml(),
                scrollEl = logContainer.el.dom, // scrollable dom element
                logtype = this.getViewModel().get('logtype');

            Ext.Ajax.request({
                url: '/api/logging/' + logtype.toLowerCase(),
                success: function (response) {
                    // append ar insert log result
                    logContainer.setHtml(currentLog + Ext.util.Base64.decode(Ext.decode(response.responseText).logresults));
                    // hopefully should scroll to bottom of log container
                    scrollEl.scrollTop = scrollEl.scrollHeight - scrollEl.clientHeight;
                },
                failure: function () {
                    // will fallback to the generic error handler, no need to set something
                }
            });
        }
    }

});
