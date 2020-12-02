Ext.define('Mfw.settings.system.About', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-system-about',

    title: 'About'.t(),
    layout: 'fit',

    viewModel: {
        store: null
    },

    items: [{
        xtype: 'grid',
        hideHeaders: true,
        columns:[{
            dataIndex: 'name'
        },{
            dataIndex: 'value',
            flex: 1,
            cell: {
                encodeHtml: false
            },
            renderer: 'valueRender'
        }],
        bind: {
            store: '{store}'
        }
    }, {
        xtype: 'panel',
        width: '50%',
        docked: 'right',
        resizable: {
            split: true,
            edges: 'west'
        },
        layout: 'fit',
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            items: [{
                xtype: 'component',
                html: 'SDWAN Packages'
            }]
        }, {
            xtype: 'component',
            itemId: 'packages',
            height: '100%',
            cls: 'x-iframe',
            padding: '0 0 0 8',
            html: 'Loading ...',
            bind: {
                html: '<iframe src="{build.lede_device_manufacturer_url}" width="100%" height="100%" style="border: none;"></iframe>'
            }
        }]
    }],

    controller: {
        init: function (view) {
            var vm = view.getViewModel();

            // Build default store.
            var store = Ext.create('Ext.data.Store',{
                fields: ['key', 'name', 'value'],
                data:[{
                    key: 'uid',
                    name: 'UID',
                    value: 'test'
                },{
                    key: 'build.name',
                    name: 'Name',
                    value: ''
                },{
                    key: 'build.build_id',
                    name: 'Build',
                    value: ''
                },{
                    key: 'build.home_url',
                    name: 'Github',
                    value: ''
                },{
                    key: 'build.support_url',
                    name: 'Support',
                    value: ''
                }]
            });

            // Get build information.
            Ext.Ajax.request({
                url: '/api/status/build',
                success: function (response) {
                    var build = Ext.decode(response.responseText);
                    for(var key in build){
                        store.findBy(function(record){
                            if(record.get('key') == 'build.' + key){
                                record.set('value', build[key]);
                            }
                        });
                    }
                },
                failure: function () {
                    console.warn('Unable to get build!');
                }
            });
            // Get UID
            Ext.Ajax.request({
                url: '/api/status/uid',
                success: function (response) {
                    var uid = response.responseText;
                    store.findBy(function(record){
                        if(record.get('key') == 'uid'){
                            record.set('value', response.responseText);
                        }
                    });
                },
                failure: function () {
                    console.warn('Unable to get uid!');
                }
            });
            // Get command account
            Ext.Ajax.request({
                url: '/api/status/command/find_account',
                success: function (response) {
                    var accountInformation = {
                        account: null
                    };
                    try{
                        accountInformation = JSON.parse(response.responseText);
                    }catch(e){
                        console.log("Unable to parse account");
                        console.log(e);
                    }
                    if(accountInformation.account != null){
                        // Only add Account record if we have a name.
                        // Find the uid record index to insert the Account record after.
                        // Otherwise it will be empty for any system not associated with CC.
                        var commandAccountRecord = null;
                        var uidPos = store.findBy(function(record){
                            if(record.get('key') == 'uid'){
                                return true;
                            }
                        });
                        store.findBy(function(record, index){
                            // Just in case something happens to refresh the store,
                            // prevent duplicates.
                            if(record.get('key') == 'account'){
                                commandAccountRecord = record;
                            }
                        });
                        if(commandAccountRecord == null){
                            // Add the Account record.
                            commandAccountRecord = store.insert(uidPos + 1, {
                                key: 'account',
                                name: 'Account',
                                value: ''
                            })[0];
                        }
                        commandAccountRecord.set('value', accountInformation.account);
                    }
                },
                failure: function () {
                    console.warn('Unable to get account!');
                }
            });
            vm.set('store', store);
        },
        // Render keys with "_url" as anchors.
        valueRender: function(value, record){
            if(record.get('key').indexOf('_url') > -1 ){
                value = '<a href="' + value + '" target="_blank">' + value + '</a>';
            }
            return value;
        }
    }
});
