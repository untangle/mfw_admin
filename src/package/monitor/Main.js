Ext.define('Mfw.monitor.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.monitor',

    controller: 'monitor',

    layout: 'card',

    items: [
        { xtype: 'container' }, // empty container
        { xtype: 'monitor-sessions' },
        { xtype: 'monitor-hosts' },
        { xtype: 'monitor-devices' },
        { xtype: 'monitor-users' }
    ],

    listeners: {
        deactivate: function (view) {
            view.setActiveItem(0);
        }
    }

});
