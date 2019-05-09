Ext.define('Ext.override.data.Batch', {
    override: 'Ext.data.Batch',

    onOperationComplete: function(operation) {
        var me = this,
            exception = operation.hasException();

        if (exception) {
            me.exception = true;
            me.exceptions.push(operation);
            me.fireEvent('exception', me, operation);

            // custom code
            Sync.exception(operation.getError().response);
            // end custom code

        }

        if (exception && me.getPauseOnException()) {
            me.pause();
        }
        else {
            me.fireEvent('operationcomplete', me, operation);
            me.runNextOperation();

            // add code to capture Warnings on batch operations
        }
    }
});
