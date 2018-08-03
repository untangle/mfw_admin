Ext.define('Mfw.util.Field', {
    alternateClassName: 'Field',
    singleton: true,

    postNatServer: {
        name: 'Post-Nat Server'.t(),
        type: 'string',
        validators: ['email']
    }

});

