(function() {
    'use strict';

    var log = _.unary(console.log); // Debug
    var __ = undefined;
    var ensure = util.ensure;

    var $plot = ensure.jqElement($('[js-plot]'));

    var pointCount = 10;

    var trace = {
        y: _.times(pointCount, function() { return _.random(-100, 100) }),
        line: { shape: 'spline', smoothing: 0.8 },
        mode: 'lines',
    };

    var trace2 = {
        y: _.times(pointCount, function() { return _.random(-100, 100) }),
        type: 'bar',
    };

    Plotly.plot($plot.get(0), [trace, trace2], {
        xaxis: {
            showgrid: true,
            gridcolor: 'black',
            zerolinewidth: 2,
        },

        yaxis: {
            range: [-100, 100],
            //autorange: 'reversed',
            showgrid: true,
            gridcolor: 'black',
            zerolinewidth: 2,
        },
    });

    $(window).on('resize', function() { Plotly.Plots.resize($plot.get(0)) });

    var intervId = setInterval(function() {
        Plotly.extendTraces($plot.get(0), { y: [[_.random(-100, 100)], [_.random(-100, 100)]] }, [0, 1]);
    }, 1000);

    setTimeout(clearInterval.bind(__, intervId), 10000);
}());
