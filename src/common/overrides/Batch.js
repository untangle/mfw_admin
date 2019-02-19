Ext.define('Ext.override.data.Batch', {
    override: 'Ext.data.Batch',

    onOperationComplete: function(operation) {
        var me = this,
            exception = operation.hasException();

        if (exception) {
            var response = operation.getError().response,
                errorMsg = response.responseJson,
                status = response.status,
                statusText = response.statusText;

            Ext.create({
                xtype: 'actionsheet',
                side: 'bottom',
                exit: 'bottom',

                maxHeight: 500,
                scrollable: true,
                userSelectable: 'text',
                // title: 'Exception: ' + status + ' - ' + statusText,

                layout: 'vbox',

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
                    style: 'font-size: 14px;',
                    html: '<p><strong>Error:</strong> ' + errorMsg.error + '</p>'
                }, {
                    xtype: 'component',
                    flex: 1,
                    // style: 'font-family: "Courier New", sans-serif;',
                    html: '<p style="font-size: 14px; font-weight: bold;">Full stack:</p> <code>' + errorMsg.output.replace(/\n/g, '</br>') + '</code>'
                }],
                listeners: {
                    hide: function (sheet) {
                        sheet.destroy();
                    }
                }
            }).show();

            // Ext.Viewport.add();


            me.exception = true;
            me.exceptions.push(operation);
            me.fireEvent('exception', me, operation);
        }

        if (exception && me.getPauseOnException()) {
            me.pause();
        } else {
            me.fireEvent('operationcomplete', me, operation);
            me.runNextOperation();
        }
    }
});
