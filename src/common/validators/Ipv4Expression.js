/**
 * Validates Ipv4 expression
 * | Name | Example | Description |
 * | Single Value | 1.2.3.4 | matches a single value |
 * | Range | 1.2.3.4-1.2.3.100 | matches any IP in the range |
 * | CIDR subnet | 1.2.3.4/24 | matches any IP in the subnet |
 * | List | 1.2.3.4/24,1.2.3.5-1.2.3.8 | matches any IP that matches any IPv4 Expression in the list |
 */
Ext.define('Ext.data.validator.Ipv4Expression', {
    extend: 'Ext.data.validator.Validator',
    alias: 'data.validator.ipv4expression',

    type: 'ipv4expression',

    validate: function (value) {
        var ip4Matcher = new RegExp('^(((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$'),
            cidrv4Matcher = new RegExp('^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))$'),

            message, list, range, rangeStart, rangeEnd;

        // remove all spaces
        value = value.replace(/ /g,'');
        // split list in expressions
        list = value.split(',');

        Ext.Array.each(list, function (expr) {
            range = expr.split('-');
            rangeStart = range[0];
            rangeEnd = range[1];

            if (rangeStart && rangeStart.length === 0) {
                message = 'Invalid IPv4 address: ' + rangeStart;
            }

            if (!ip4Matcher.test(rangeStart) && !cidrv4Matcher.test(rangeStart)) {
                message = 'Invalid IPv4 address: ' + rangeStart;
            }

            if (range.length === 2) {
                if (!rangeEnd) {
                    message = 'Unset IPv4 range end!';
                } else {
                    if (!ip4Matcher.test(rangeEnd) && !cidrv4Matcher.test(rangeEnd)) {
                        message = 'Invalid IPv4 range end address: ' + rangeEnd;
                    }
                }
            }
        });
        return message ? message : true;
    }
});
