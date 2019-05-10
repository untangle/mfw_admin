Ext.define('Ext.override.data.Batch', {
    override: 'Ext.data.Batch',

    onOperationComplete: function(operation) {
        var me = this,
            exception = operation.hasException();

        if (exception) {
            me.exception = true;
            me.exceptions.push(operation);
            me.fireEvent('exception', me, operation);

            // custom code to capture exceptions
            Sync.exception(operation.getError().response);
            // end custom code

        }

        if (exception && me.getPauseOnException()) {
            me.pause();
        }
        else {
            // custom code to capture warnings
            var resp = operation.getResponse();
            if (resp && resp.responseJson) {
                if (resp.responseJson.output && resp.responseJson.output.includes('WARNING')) {
                    Sync.warning(resp);
                }
            }
            // end custom code

            me.fireEvent('operationcomplete', me, operation);
            me.runNextOperation();
        }
    }
});
