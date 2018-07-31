Ext.define('Mfw.view.monitor.Sessions', {
    extend: 'Ext.grid.Grid',
    alias: 'widget.mfw-monitor-sessions',

    items: [{
        xtype: 'toolbar',
        docked: 'top',
        shadow: false,
        items: [{
            xtype: 'component',
            html: 'Sessions'
        }, {
            xtype: 'searchfield',
            ui: 'faded',
            margin: '0 16',
            placeholder: 'Filter...'.t()
        }, {
            text: 'Show up to 100'.t(),
            // iconCls: 'x-fa fa-list-ol',
            menu: {
                items: [{
                    text: '100'.t()
                }, {
                    text: '500'.t()
                }, {
                    text: '1000'.t()
                }]
            }
        }, '->', {
            text: 'Refresh'.t(),
            iconCls: 'x-fa fa-refresh'
        }]
    }],

    columns: [{
        text: 'Creation Time'.t(),
        dataIndex: 'creationTime',
        hidden: true,
        // renderer: Renderer.timestamp,
        // filter: Renderer.timestampFilter
    }, {
        text: 'Session ID'.t(),
        dataIndex: 'sessionId',
        hidden: true,
        // filter: Renderer.numericFilter
    }, {
        text: 'Mark'.t(),
        dataIndex: 'mark',
        hidden: true,
        // filter: Renderer.numericFilter,
        // renderer: function(value) {
        //     if (value)
        //         return "0x" + value.toString(16);
        //     else
        //         return "";
        // }
    }, {
        text: 'Protocol'.t(),
        dataIndex: 'protocol',
        // filter: Renderer.stringFilter
    }, {
        text: 'Bypassed'.t(),
        dataIndex: 'bypassed',
        // width: Renderer.booleanWidth,
        // filter: Renderer.booleanFilter,
        // renderer: Renderer.boolean
    }, {
        text: 'Hostname'.t(),
        dataIndex: 'hostname',
        // width: Renderer.hostnameWidth,
        // filter: Renderer.stringFilter
    }, {
        text: 'Username'.t(),
        dataIndex: 'username',
        // width: Renderer.usernameWidth,
        // filter: Renderer.stringFilter
    }, {
        text: 'NATd'.t(),
        dataIndex: 'natted',
        // width: Renderer.booleanWidth,
        // filter: Renderer.booleanFilter,
        hidden: true
    }, {
        text: 'Port Forwarded'.t(),
        dataIndex: 'portForwarded',
        // width: Renderer.booleanWidth,
        // filter: Renderer.booleanFilter,
        hidden: true
    }, {
        hidden: true,
        text: 'Local Address'.t(),
        dataIndex: "localAddr",
        // width: Renderer.ipWidth,
        // filter: Renderer.stringFilter
    },{
        hidden: true,
        text: 'Remote Address'.t(),
        dataIndex: "remoteAddr",
        // width: Renderer.ipWidth,
        // filter: Renderer.stringFilter
    },{
        hidden: true,
        text: 'Bandwidth Control ' + 'Priority'.t(),
        dataIndex: "priority",
        // width: Renderer.messageWidth,
        // filter: Renderer.stringFilter
    },{
        hidden: true,
        text: 'QoS ' + 'Priority'.t(),
        dataIndex: "qosPriority",
        // width: Renderer.messageWidth,
        // filter: Renderer.stringFilter
    },{
        hidden: true,
        text: 'Pipeline'.t(),
        dataIndex: "pipeline",
        // width: Renderer.messageWidth,
        // filter: Renderer.stringFilter
    }, {
        text: 'Client'.t(),
        columns: [{
            text: 'Interface'.t(),
            dataIndex: 'clientIntf',
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        }, {
            text: 'Address'.t() + ' (' + 'Pre-NAT'.t() + ')',
            dataIndex: 'preNatClient',
            // width: Renderer.ipWidth,
            // filter: Renderer.stringFilter,
        }, {
            text: 'Port'.t() + ' (' + 'Pre-NAT'.t() + ')',
            dataIndex: 'preNatClientPort',
            // width: Renderer.portWidth,
            // filter: Renderer.numericFilter
        }, {
            text: 'Address'.t() + ' (' + 'Post-NAT'.t() + ')',
            dataIndex: 'postNatClient',
            // width: Renderer.ipWidth,
            // filter: Renderer.stringFilter,
            hidden: true
        }, {
            text: 'Port'.t() + ' (' + 'Post-NAT'.t() + ')',
            dataIndex: 'postNatClientPort',
            // width: Renderer.portWidth,
            // filter: Renderer.numericFilter,
            hidden: true
        }, {
            text: 'Country'.t(),
            dataIndex: 'clientCountry',
            // width: Renderer.booleanWidth,
            // filter: Renderer.stringFilter,
            hidden: true
        }, {
            text: 'Latitude'.t(),
            dataIndex: 'clientLatitude',
            // width: Renderer.locationWidth,
            // filter: Renderer.numericFilter,
            hidden: true
        }, {
            text: 'Longitude'.t(),
            dataIndex: 'clientLongitude',
            // filter: Renderer.numericFilter,
            hidden: true
        }]
    }, {
        text: 'Server'.t(),
        columns: [{
            text: 'Interface'.t(),
            dataIndex: 'serverIntf',
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        }, {
            text: 'Address'.t() + ' (' + 'Pre-NAT'.t() + ')',
            dataIndex: 'preNatServer',
            // width: Renderer.ipWidth,
            // filter: Renderer.stringFilter,
            hidden: true
        }, {
            text: 'Port'.t() + ' (' + 'Pre-NAT'.t() + ')',
            dataIndex: 'preNatServerPort',
            // width: Renderer.portWidth,
            // filter: Renderer.numericFilter,
            hidden: true
        }, {
            text: 'Address'.t() + ' (' + 'Post-NAT'.t() + ')',
            // width: Renderer.ipWidth,
            dataIndex: 'postNatServer',
            // filter: Renderer.stringFilter
        }, {
            text: 'Port'.t() + ' (' + 'Post-NAT'.t() + ')',
            dataIndex: 'postNatServerPort',
            // width: Renderer.portWidth,
            // filter: Renderer.numericFilter
        }, {
            text: 'Country'.t(),
            dataIndex: 'serverCountry',
            // width: Renderer.booleanWidth,
            // filter: Renderer.stringFilter
        }, {
            text: 'Latitude'.t(),
            dataIndex: 'serverLatitude',
            // width: Renderer.locationWidth,
            // filter: Renderer.numericFilter,
            hidden: true
        }, {
            text: 'Longitude'.t(),
            dataIndex: 'serverLongitude',
            // width: Renderer.locationWidth,
            // filter: Renderer.numericFilter,
            hidden: true
        }]
    }, {
        text: 'Speed (KB/s)'.t(),
        columns: [{
            text: 'Client'.t(),
            dataIndex: 'clientKBps',
            // width: Renderer.sizeWidth,
            // filter: Renderer.numericFilter,
            align: 'right'
        }, {
            text: 'Server'.t(),
            dataIndex: 'serverKBps',
            // width: Renderer.sizeWidth,
            // filter: Renderer.numericFilter,
            align: 'right'
        }, {
            text: 'Total'.t(),
            dataIndex: 'totalKBps',
            // width: Renderer.sizeWidth,
            // filter: Renderer.numericFilter,
            align: 'right'
        }]
    }, {
        text: 'Application Control Lite',
        hidden: true,
        columns: [{
            hidden: true,
            text: 'Protocol'.t(),
            dataIndex: "application-control-lite-protocol",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Category'.t(),
            dataIndex: "application-control-lite-category",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Description'.t(),
            dataIndex: "application-control-lite-description",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Matched?'.t(),
            dataIndex: "application-control-lite-matched",
            // width: Renderer.messageWidth,
            // filter: Renderer.booleanFilter
        }]
    }, {
        text: 'Application Control',
        columns: [{
            text: 'Protochain'.t(),
            dataIndex: "application-control-protochain",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            text: 'Application'.t(),
            dataIndex: "application-control-application",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Category'.t(),
            dataIndex: "application-control-category",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Detail'.t(),
            dataIndex: "application-control-detail",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Confidence'.t(),
            dataIndex: "application-control-confidence",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Productivity'.t(),
            dataIndex: "application-control-productivity",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Risk'.t(),
            dataIndex: "application-control-risk",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        }]
    }, {
        text: 'Web Filter',
        hidden: true,
        columns: [{
            hidden: true,
            text: 'Category Name'.t(),
            dataIndex: "web-filter-best-category-name",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Category Description'.t(),
            dataIndex: "web-filter-best-category-description",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Category Flagged'.t(),
            dataIndex: "web-filter-best-category-flagged",
            // width: Renderer.messageWidth,
            // filter: Renderer.booleanFilter
        },{
            hidden: true,
            text: 'Category Blocked'.t(),
            dataIndex: "web-filter-best-category-blocked",
            // width: Renderer.booleanWidth,
            // filter: Renderer.booleanFilter,
        },{
            hidden: true,
            text: 'Flagged'.t(),
            dataIndex: "web-filter-flagged",
            // width: Renderer.booleanWidth,
            // filter: Renderer.booleanFilter,
        }]
    }, {
        text: 'HTTP',
        hidden: true,
        columns: [{
            hidden: true,
            text: 'Hostname'.t(),
            dataIndex: "http-hostname",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'URL'.t(),
            dataIndex: "http-url",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'User Agent'.t(),
            dataIndex: "http-user-agent",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'URI'.t(),
            dataIndex: "http-uri",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Request Method'.t(),
            dataIndex: "http-request-method",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Request File Name'.t(),
            dataIndex: "http-request-file-name",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Request File Extension'.t(),
            dataIndex: "http-request-file-extension",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Request File Path'.t(),
            dataIndex: "http-request-file-path",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Response File Name'.t(),
            dataIndex: "http-response-file-name",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Response File Extension'.t(),
            dataIndex: "http-response-file-extension",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Content Type'.t(),
            dataIndex: "http-content-type",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Referer'.t(),
            dataIndex: "http-referer",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Content Length'.t(),
            dataIndex: "http-content-length",
            // width: Renderer.sizeWidth,
            // filter: Renderer.numericFilter
        }]
    }, {
        text: 'SSL',
        hidden: true,
        columns: [{
            hidden: true,
            text: 'Subject DN'.t(),
            dataIndex: "ssl-subject-dn",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Issuer DN'.t(),
            dataIndex: "ssl-issuer-dn",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Inspected'.t(),
            dataIndex: "ssl-session-inspect",
            // width: Renderer.booleanWidth,
            // filter: Renderer.booleanFilter
        },{
            hidden: true,
            text: 'SNI Hostname'.t(),
            dataIndex: "ssl-sni-host",
            // width: Renderer.hostnameWidth,
            // filter: Renderer.stringFilter
        }]
    }, {
        text: 'FTP',
        hidden: true,
        columns: [{
            hidden: true,
            text: 'Filename'.t(),
            dataIndex: "ftp-file-name",
            // width: Renderer.messageWidth,
            // filter: Renderer.stringFilter
        },{
            hidden: true,
            text: 'Data Session'.t(),
            dataIndex: "ftp-data-session",
            // width: Renderer.booleanWidth,
            // filter: Renderer.booleanFilter,
        }]
    }, {
        text: 'Tags'.t(),
        dataIndex: 'tags',
        // width: Renderer.tagsWidth,
        // renderer: Renderer.tags
    }]

});
