Ext.define('Mfw.model.ReportRender', {
    extend: 'Ext.data.Model',
    alias: 'model.report_render',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'type', type: 'string' }, // ["spline","line","areaspline","area","pie","column"]
        { name: 'stacking', type: 'string', defaultValue: 'none' }, // normal, percent
        { name: 'colors', type: 'string' },

        { name: 'lineWidth', type: 'number', defaultValue: 2 },
        { name: 'borderWidth', type: 'number', defaultValue: 1 },
        { name: 'topAreaOpacity', type: 'number', defaultValue: 0.7 },
        { name: 'bottomAreaOpacity', type: 'number', defaultValue: 0.1 },

        { name: 'dashStyle', type: 'string', defaultValue: 'Solid' },

        { name: 'dataGroupingEnabled', type: 'boolean', defaultValue: true }, // ["average", "open", "high", "low", "close", "sum"],
        { name: 'dataGroupingApproximation', type: 'string', defaultValue: 'sum' }, // ["average", "open", "high", "low", "close", "sum"],
        { name: 'dataGroupingFactor', type: 'integer', defaultValue: 40 },

        { name: 'donutInnerSize', type: 'number', defaultValue: 0 }, // percent
        { name: '3dEnabled', type: 'boolean', defaultValue: false },
        { name: '3dAlpha', type: 'integer', defaultValue: 45 },
        // { name: '3dBeta', type: 'integer', defaultValue: 0 },
        { name: '3dDepth', type: 'integer', defaultValue: 40 },

        { name: 'slicesNumber', type: 'integer', defaultValue: 10 },

        {
            name: '_icon',
            calculate: function (rendering) {
                switch (rendering.type) {
                    case 'line':
                    case 'spline': return 'fa-line-chart';
                    case 'area':
                    case 'areaspline': return 'fa-area-chart';
                    case 'column': return 'fa-bar-chart';
                    case 'pie': return 'fa-pie-chart';
                    default: return;
                }
            }
        }
    ]
});
