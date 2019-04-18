Ext.define('Ext.override.data.Model', {
    override: 'Ext.data.Model',

    save: function(options) {
        options = Ext.apply({}, options);

        /* eslint-disable-next-line vars-on-top */
        var me = this,
            phantom = me.phantom,
            dropped = me.dropped,
            action = dropped ? 'destroy' : (phantom ? 'create' : 'update'),
            scope = options.scope || me,
            callback = options.callback,
            proxy = me.getProxy(),
            operation;

        options.records = [me];

        options.internalCallback = function(operation) {
            var args = [me, operation],
                success = operation.wasSuccessful();

            if (success) {
                Ext.callback(options.success, scope, args);
            }
            else {
                // custom code
                Sync.exception(operation.getError().response);
                // end custom code
                Ext.callback(options.failure, scope, args);
            }

            args.push(success);
            Ext.callback(callback, scope, args);
        };

        delete options.callback;

        operation = proxy.createOperation(action, options);

        // Not a phantom, then we must perform this operation on the remote datasource.
        // Record will be removed from the store in the callback upon a success response
        if (dropped && phantom) {
            // If it's a phantom, then call the callback directly with a dummy successful ResultSet
            operation.setResultSet(Ext.data.reader.Reader.prototype.nullResultSet);
            me.setErased();
            operation.setSuccessful(true);
        }
        else {
            operation.execute();
        }

        return operation;
    },
});
