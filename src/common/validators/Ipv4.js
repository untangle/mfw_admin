/**
 * Validates Ipv4 address including subnet
 */
Ext.define('Ext.data.validator.Ipv4', {
    extend: 'Ext.data.validator.Validator',
    alias: 'data.validator.ipv4',

    type: 'ipv4',

    validate: function (value) {
        var ip4Matcher = new RegExp('^(((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$'),
            cidrv4Matcher = new RegExp('^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))$');

        // if value dos not match any
        if (!ip4Matcher.test(value) && !cidrv4Matcher.test(value)) {
            return 'Invalid IPv4 address';
        }
        return true;
    }
});
