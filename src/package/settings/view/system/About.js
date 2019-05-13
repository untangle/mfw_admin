Ext.define('Mfw.settings.system.About', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-system-about',

    title: 'About'.t(),
    layout: 'fit',

    viewModel: {},

    items: [{
        xtype: 'container',
        itemId: 'build',
        style: 'font-size: 14px;',
        padding: 16,
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            items: [{
                xtype: 'component',
                html: 'Build'
            }]
        }, {
            xtype: 'component',
            bind: {
                html: '<table cellspacing=10>' +
                '<tr><td>Name: </td><td>{build.name}</td></tr>' +
                '<tr><td>UID: </td><td>{uid}</td></tr>' +
                '<tr><td>Build: </td><td>{build.build_id}</td></tr>' +
                '<tr><td>JIRA: </td><td><a href="{build.bug_url}" target="_blank">{build.bug_url}</a></td></tr>' +
                '<tr><td>Github: </td><td><a href="{build.home_url}" target="_blank">{build.home_url}</a></td></tr>' +
                '<tr><td>Support: </td><td><a href="{build.support_url}" target="_blank">{build.support_url}</a></td></tr>' +
                '</table>'
            }
        }]
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
            Ext.Ajax.request({
                url: '/api/status/build',
                success: function (response) {
                    vm.set('build', Ext.decode(response.responseText));

                    // get UID
                    Ext.Ajax.request({
                        url: '/api/status/uid',
                        success: function (response) {
                            vm.set('uid', response.responseText);
                        },
                        failure: function () {
                            console.warn('Unable to get uid!');
                        }
                    });
                },
                failure: function () {
                    console.warn('Unable to get build!');
                }
            });
        }
    }

});
