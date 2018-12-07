Ext.define('Mfw.Renderer', {
    alternateClassName: 'Renderer',
    singleton: true,

    time_stamp: function (value) {
        var date = new Date(value),
            day = Ext.Date.format(date, 'd.m.Y'),
            hour = Ext.Date.format(date, 'h:i:s a');

        return '<span style="color: #999;">' + day + '</span> &nbsp;' + hour;
    },

    ip_protocol: function (value) {
        var protocol = Globals.protocolsMap[value];
        if (protocol) {
            return protocol.text + ' <span style="color: #999;">[ ' + protocol.value + ' ]</span>';
        }
        return value;
    }

});
