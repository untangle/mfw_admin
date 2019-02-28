Ext.define('Mfw.Exception', {
    alternateClassName: 'Exception',
    singleton: true,

    show: function (error) {
        var errorMsg = error.responseJson,
            status = error.status,
            exceptionText = errorMsg.output.match(/Exception: (.*?)\n/g)[0],
            statusText = error.statusText;

        exceptionText = exceptionText.replace('Exception: ', '');

        Ext.create({
            xtype: 'actionsheet',
            side: 'bottom',
            exit: 'bottom',

            viewModel: {},

            maxHeight: 500,
            scrollable: true,
            userSelectable: 'text',

            layout: {
                type: 'vbox',
                align: 'left'
            },

            items: [{
                xtype: 'toolbar',
                docked: 'top',
                style: 'background: #c62828; color: #FFF; font-weight: 600;',
                items: {
                    xtype: 'component',
                    html: status + ' - ' + statusText
                }
            }, {
                xtype: 'component',
                flex: 1,
                style: 'font-size: 16px;',
                html: '<p><strong>Exception:</strong> ' + exceptionText + '</p>'
            }, {
                xtype: 'button',
                ui: 'action',
                text: 'Show full stack',
                handler: function (btn) {
                    btn.up('actionsheet').down('#fullstack').setHidden(false);
                    btn.hide();
                }
            }, {
                xtype: 'component',
                itemId: 'fullstack',
                hidden: true,
                flex: 1,
                html: '<p style="font-size: 16px; font-weight: bold;">Full stack:</p> <code>' + errorMsg.output.replace(/\n/g, '</br>') + '</code>'
            }],
            listeners: {
                hide: function (sheet) {
                    sheet.destroy();
                }
            }
        }).show();
    }

});
