Ext.define('Mfw.settings.network.Routing', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-network-routing',

    title: 'Routing Table'.t(),

    layout: 'fit',

    viewModel: {
        routingTable: ''
    },

    items: [{
        xtype: 'toolbar',
        docked: 'top',
        items: [{
            xtype: 'component',
            html: 'Current Routes shows the current routing system\'s configuration and how all traffic will be routed.'
        }, '->', {
            xtype: 'button',
            text: 'Refresh',
            handler: 'fetchRoutes'
        }]
    }, {
        xtype: 'container',
        style: 'background: #FFF; font-family: Monospace;',
        padding: 10,
        bind: {
            html: '{routingTable}'
        }
    }],

    controller: {
        init() {
            this.fetchRoutes()
        },

        fetchRoutes() {
            // TODO add the api call which will fetch routing table
            var vm = this.getViewModel();
            var output = ' = IPv4 Rules = \n the output';
            vm.set('routingTable', output);
        }
    }
});
