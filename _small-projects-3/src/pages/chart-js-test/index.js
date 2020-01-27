import Chart from 'chart.js';

import * as util from '../../lib/baybulatov-util-js-0.7.0-beta';

import './index.html';
import './index.less';

import '../../modules/common';


const {ensure} = util;


const updateChartAxis = chart => {
    if (!_.isObject(chart)) throw new Error('Object expected');

    const leftYAxis = chart.scales['left-y-axis'];
    if (!_.isObject(leftYAxis)) throw new Error('Object expected');

    const rightYAxis = chart.options.scales.yAxes.find(axis => axis.id === 'right-y-axis');
    if (!_.isPlainObject(rightYAxis)) throw new Error('Plain object expected');

    rightYAxis.ticks.min = leftYAxis.min;
    rightYAxis.ticks.max = leftYAxis.max;

    chart.update();
};


const init = () => {
    const MAX_CHART_ITEMS_COUNT = 10;

    const $chart = ensure.jqElement($('[js-chart]'));

    const chart = new Chart($chart, {
        type: 'line',

        data: {
            labels: _.times(MAX_CHART_ITEMS_COUNT, i => `${util.lorem(1, 1)}-${i + 1}`),

            datasets: [
                {
                    backgroundColor: 'rgba(255, 0, 0, 0.3)',
                    borderColor: 'rgba(255, 0, 0, 0.8)',
                    data: _.times(MAX_CHART_ITEMS_COUNT, () => _.random(99)),
                    label: 'Foo',
                },

                {
                    backgroundColor: 'rgba(0, 255, 0, 0.3)',
                    borderColor: 'rgba(0, 255, 0, 0.8)',
                    data: _.times(MAX_CHART_ITEMS_COUNT, () => _.random(100, 199)),
                    label: 'Bar',
                },

                {
                    backgroundColor: 'rgba(0, 0, 255, 0.3)',
                    borderColor: 'rgba(0, 0, 255, 0.8)',
                    data: _.times(MAX_CHART_ITEMS_COUNT, () => _.random(200, 299)),
                    label: 'Baz',
                },
            ],
        },

        options: {
            maintainAspectRatio: false,

            scales: {
                yAxes: [
                    {
                        id: 'left-y-axis',
                    },

                    {
                        id: 'right-y-axis',
                        gridLines: {drawOnChartArea: false},
                        position: 'right',
                    },
                ],
            },

            legend: {
                onClick: (evt, legendItem) => {
                    Chart.defaults.global.legend.onClick.call(chart, evt, legendItem);
                    updateChartAxis(chart);
                },
            },
        },
    });


    updateChartAxis(chart);


    // const $chartWrap = ensure.jqElement($('[js-chart-wrap]'));
    //
    // setInterval(() => { $chartWrap.css({width: _.random(300, 1600), height: _.random(50, 600)}) }, 2000);
};


init();
