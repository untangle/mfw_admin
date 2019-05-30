/**
 * Validates single Ipv4 address
 */
Ext.define('Ext.data.validator.Ipv4', {
    extend: 'Ext.data.validator.Format',
    alias: 'data.validator.ipv4',

    type: 'ipv4',

    message: 'Inavlid IPv4 address format',
    matcher: new RegExp('^(((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$')
});
