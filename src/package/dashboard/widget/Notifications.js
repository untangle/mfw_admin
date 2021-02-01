Ext.define('Mfw.dashboard.widget.Notifications', {
    extend: 'Ext.Panel',
    alias: 'widget.widget-notifications',

    cls: 'mfw-widget',
    margin: 8,
    layout: 'fit',
    minWidth: 450,
    hidden: true,

    viewModel: {
        data: {
            widget: null
        },
        store: null,
        active: false
    },

    items: [{
        xtype: 'toolbar',
        style: { background: 'transparent' },
        docked: 'top',
        shadow: false,
        padding: '0 8 0 16',
        items: [{
            xtype: 'container',
            style: 'font-weight: 100;',
            bind: {
                html: '<span style="color: #333; display: inline-block;">Notifications</span>'
            }
        }, '->', {
            xtype: 'component',
            itemId: 'timer',
            margin: '0 5 0 0',
            hidden: true,
            bind: {
                hidden: '{widget.interval === 0}'
            }
        }, {
            iconCls: 'md-icon-refresh',
            ui: 'round',
            handler: 'reload'
        }]
    }, {
        xtype: 'grid',
        columns:[{
            dataIndex: 'type',
            width: 14,
            cell: {
                encodeHtml: false
            },
            renderer: 'typeRender'
        },{
            dataIndex: 'message',
            flex: 1,
            cell: {
                encodeHtml: false
            }
        }],
        bind: {
            hideHeaders: '{active}',
            store: '{store}'
        }
    }],
    listeners: {
        removed: function (widget) {
            if (widget.tout) {
                clearTimeout(widget.tout);
            }
        },
    },

    controller: {
        active: false,
        init: function (widget) {
            var me = this,
                vm = widget.getViewModel();

            var store = Ext.create('Ext.data.Store',{
                fields: ['type', 'message']
            });
            vm.set('store', store);

            widget.tout = null;
            WidgetsPipe.add(widget);

        },
        // Each time dashboard is refreshed.
        loadData: function(cb){

            this.checkForNotifications();

            if (cb) { cb(); }
        },

        reload: function () {
            this.checkForNotifications();
        },

        lastCheckedForNotifications: 0,
        lastCheckedForNotificationsMaxWait: 30 * 1000,
        checkForNotifications: function () {
            var me = this,
                widget = me.getView(),
                vm = me.getViewModel(),
                now = Date.now();

            if(me.lastCheckedForNotifications != 0 &&
                ( now - me.lastCheckedForNotifications ) < me.lastCheckedForNotificationsMaxWait){
                return;
            }
            me.lastCheckedForNotifications = now;

            Ext.Ajax.request({
                url: '/api/status/diagnostics',
                success: function (response) {
                    if(!me){
                        return;
                    }
                    var diagnostics = Ext.decode(response.responseText),
                        widget = me.getView(),
                        analyzers = widget.analyzers,
                        vm = me.getViewModel(),
                        grid = widget.down('grid'),
                        store = vm.get('store');

                    me.lastCheckedForNotifications = 0;

                    var data = [];
                    Ext.Object.each( diagnostics, function( key, results ){
                        analyzers.each( function(analyzer){
                            if(analyzer.get('key') == key){
                                results.forEach(function(result){
                                    var report = analyzer.get('analyzer')(result);
                                    if(report != null){
                                        data.push(report);
                                    }
                                })
                            }
                        })
                    });
                    store.loadData(data);

                    var active = store.count() > 0 ? true : false;
                    if(active != vm.get('active')){
                        vm.set('active', active);
                        widget.setHidden(!active);
                    }
                    me.checkForNotificationsRefresh.delay(me.checkForNotificationsRefreshInterval, null, me, me);
                },
                failure: function () {
                    if(!me){
                        return;
                    }
                    me.lastCheckedForNotifications = 0;
                    me.checkForNotificationsRefresh.delay(me.checkForNotificationsRefreshInterval, null, me. me);
                    console.error('Unable to get diagnostics!');
                }
            });
        },

        // Refresh task.
        checkForNotificationsRefreshInterval: 60 * 1000,
        checkForNotificationsRefresh: new Ext.util.DelayedTask( function(){
            this.checkForNotifications();
        }),

        // Render error or alert icon.
        typeRender: function(value, record){
            var valueIcon = '';
            if(value == 'error'){
                valueIcon = '<i class="x-fa fa-exclamation-circle fa-2x" style="color: #FAA; margin: 0 -8px;"></i>';
            }else if(value == 'alert'){
                valueIcon = '<i class="x-fa fa-exclamation-triangle fa-2x" style="color: #DD2; margin: 0 -8px;"></i>';
            }
            return valueIcon;
        }
    },
    analyzers: Ext.create('Ext.data.ArrayStore', {
        fields: [ 'key', 'analyzer'],
        data: [[
            'dnsResolver',
            function(result){
                if( result['pass'] == false){
                    return {
                        'type': 'error',
                        'message': Ext.String.format('No response from DNS server {0} on interface {1}', result['resolverAddress'], result['name'])
                    };
                }
                return null;
            },
        ]]
    })
});
