Ext.define('Mfw.settings.system.About', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-system-about',

    title: 'About'.t(),

    layout: 'vbox',

    items: [{
        xtype: 'container',
        itemId: 'build',
        style: 'font-size: 14px;',
        padding: 16,
    }],

    controller: {
        init: function (view) {
            Ext.Ajax.request({
                url: '/api/status/build',
                success: function (response) {
                    var build = Ext.decode(response.responseText), html;

                    // temporary to remove double quotes
                    Ext.Object.each(build, function(key, value) {
                        build[key] = value.replace(/"/g, '');
                    });

                    html = '<table cellspacing=10>' +
                           '<tr><td>Name: </td><td>' + build.name + '</td></tr>' +
                           '<tr><td>Build: </td><td>' + build.build_id + '</td></tr>' +
                           '<tr><td>JIRA: </td><td><a href="' + build.bug_url + '" target="_blank">' + build.bug_url + '</a></td></tr>' +
                           '<tr><td>Github: </td><td><a href="' + build.home_url + '" target="_blank">' + build.home_url + '</a></td></tr>' +
                           '<tr><td>Support: </td><td><a href="' + build.support_url + '" target="_blank">' + build.support_url + '</a></td></tr>' +
                           '</table>';
                    view.down('#build').setHtml(html);

                },
                failure: function () {
                    console.warn('Unable to get build!');
                }
            });
        }
    }

});
