/**
 * Validates single port number
 */
Ext.define('Ext.data.validator.Port', {
    extend: 'Ext.data.validator.Format',
    alias: 'data.validator.port',

    type: 'port',

    message: 'Inavlid port',
    matcher: new RegExp('^()([1-9]|[1-5]?[0-9]{2,4}|6[1-4][0-9]{3}|65[1-4][0-9]{2}|655[1-2][0-9]|6553[1-5])$'),
});
