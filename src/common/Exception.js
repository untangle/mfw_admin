Ext.define('Mfw.Exception', {
    alternateClassName: 'Exception',
    singleton: true,

    show: function (error) {
        var exceptionText, fullStack,
            status = error.status,
            statusText = error.statusText;

        if (error.responseJson) {
            // store sync, model save
            exceptionText = error.responseJson.output.match(/Exception: (.*?)\n/g)[0];
            exceptionText = exceptionText.replace('Exception: ', '');
            fullStack = error.responseJson.output.replace(/\n/g, '</br>');
        } else {
            // ajax
            if (error.responseText) {
                exceptionText = Ext.JSON.decode(error.responseText).error;
            } else {
                return;
            }
        }


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
                hidden: !fullStack,
                handler: function (btn) {
                    btn.up('actionsheet').down('#fullstack').setHidden(false);
                    btn.hide();
                }
            }, {
                xtype: 'component',
                itemId: 'fullstack',
                hidden: true,
                flex: 1,
                html: '<p style="font-size: 16px; font-weight: bold;">Full stack:</p> <code>' + fullStack + '</code>'
            }],
            listeners: {
                hide: function (sheet) {
                    sheet.destroy();
                }
            }
        }).show();
    }

});

// capture Ajax exceptions

Ext.Ajax.on('requestexception', function (conn, response) {
    // temporary fix to avoid showing exception when checking if user is authenticated in login screen
    if (response.request.url === '/account/status') {
        return;
    }
    Exception.show(response);
});
