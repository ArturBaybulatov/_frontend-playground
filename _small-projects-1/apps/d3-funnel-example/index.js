(function() {
    'use strict';

    var log = _.unary(console.log); // Debug
    var __ = undefined;
    var ensure = util.ensure;

    var $plot = ensure.jqElement($('[js-plot]'));

    var data = [
        { label: 'Inquiries', value: 5000 },
        { label: 'Applicants', value: 2500 },
        { label: 'Admits', value: 500 },
        { label: 'Deposits', value: 200 },
    ];

    var options = {
        block: {
            dynamicHeight: true,
            minHeight: 30,
            fill: { type: 'gradient' },
        },
    };

    const funnel = new D3Funnel($plot.get(0));
    funnel.draw(data, options);

    var intervId = setInterval(function() {
        data.map(function(item) { item.value = _.random(100, 10000) });
        funnel.draw(data, options);
    }, 1000);

    setTimeout(clearInterval.bind(__, intervId), 10000);
}());
