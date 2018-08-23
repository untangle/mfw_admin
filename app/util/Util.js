Ext.define('Mfw.util.Util', {
    alternateClassName: 'Util',
    singleton: true,

    // tmp remote vm api
    server: 'http://192.168.0.184:8080/settings/',

    tmpColumns: [
        { name: 'Protocol'.t(),    field: 'protocol' },
        { name: 'Username'.t(),    field: 'username' },
        { name: 'Hostname'.t(),    field: 'hostname' },
        { name: 'Client'.t(),      field: 'c_client_addr' },
        { name: 'Server'.t(),      field: 's_server_addr' },
        { name: 'Server Port'.t(), field: 's_server_port' },
    ],

    fieldOperators: [
        { name: 'equals [=]'.t(),            value: '=' },
        { name: 'not equals [!=]'.t(),       value: '!=' },
        { name: 'greater than [>]'.t(),      value: '>' },
        { name: 'less than [<]'.t(),         value: '<' },
        { name: 'greater or equal [>=]'.t(), value: '>=' },
        { name: 'less or equal [<=]'.t(),    value: '<='},
        { name: 'like'.t(),                  value: 'like' },
        { name: 'not like'.t(),              value: 'not like' },
        { name: 'is'.t(),                    value: 'is' },
        { name: 'is not'.t(),                value: 'is not' },
        { name: 'in'.t(),                    value: 'in' },
        { name: 'not in'.t(),                value: 'not in' }
    ],

    // adds timezone computation to ensure dates showing in UI are showing actual server date
    serverToClientDate: function (serverDate) {
        if (!serverDate) { return null; }
        return Ext.Date.add(serverDate, Ext.Date.MINUTE, new Date().getTimezoneOffset() / 60000);
    },

    // extracts the timezone computation from UI dates before requesting new data from server
    clientToServerDate: function (clientDate) {
        if (!clientDate) { return null; }
        return Ext.Date.subtract(clientDate, Ext.Date.MINUTE, new Date().getTimezoneOffset() / 60000);
    }

});


Ext.util.Format.dateFormatter = function (value, format) {
    if (!value) {
        return '';
    }

    if (!Ext.isDate(value)) {
        value = new Date(value);
    }
    return Ext.Date.dateFormat(value, format || 'Y-m-d H:i A');
};
