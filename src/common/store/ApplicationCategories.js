/**
 * This list of categories can be generated from protolist.csv in the classd
 * repository with the following csvtool syntax:
 *
 * csvtool format "          { text: '%(5)', value: '%(5)' },\n" protolist.csv | sort | uniq
 *
 * Remember to remove the Category / Category entry that is created from
 * the column name header from the first line of the file.
*/
Ext.define('Mfw.store.ApplicationCategories', {
    extend: 'Ext.data.Store',
    storeId: 'applicationCategories',
    alias: 'store.applicationCategories',
    data: 
    [  
        { text: 'Collaboration', value: 'Collaboration' },
        { text: 'Database', value: 'Database' },
        { text: 'File Transfer', value: 'File Transfer' },
        { text: 'Games', value: 'Games' },
        { text: 'Mail', value: 'Mail' },
        { text: 'Messaging', value: 'Messaging' },
        { text: 'Network Monitoring', value: 'Network Monitoring' },
        { text: 'Networking', value: 'Networking' },
        { text: 'Proxy', value: 'Proxy' },
        { text: 'Remote Access', value: 'Remote Access' },
        { text: 'Social Networking', value: 'Social Networking' },
        { text: 'Streaming Media', value: 'Streaming Media' },
        { text: 'VPN and Tunneling', value: 'VPN and Tunneling' },
        { text: 'Web Services', value: 'Web Services' }
    ]
});
