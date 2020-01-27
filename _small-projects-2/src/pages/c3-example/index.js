import './index.html';
import './index.less';


const { ensure } = util;

const log = function(val) { console.log(val); return val }; // Debug


const init = async function() {
    const data = _(24)
        .times(i => ({ date: dateFns.addHours(dateFns.startOfDay(new Date()), i), count: _.random(200000, 10000000) }))
        .sort((a, b) => dateFns.compareAsc(a.date, b.date)).v;


    const chart = c3.generate({
        bindto: '[js-chart]',
        size: { width: 500, height: 160 },

        data: {
            x: 'x',

            columns: [
                ['x', ..._.map(data, 'date')],
                ['data1', ..._.map(data, 'count')],
            ],

            type: 'area',
        },

        axis: {
            x: {
                label: { text: 'Часы', position: 'outer-center' },
                type: 'timeseries',

                tick: {
                    format: x => util.pad(x.getHours()),
                    culling: false,
                    outer: false,
                },
            },

            y: {
                label: { text: 'Показы', position: 'outer-middle' },
                tick: { format: d3.format('.2~s'), count: 4 },
            },
        },

        legend: { show: false },

        tooltip: {
            contents: d => `
                <div class="pad-xs" style="background-color: rgba(255, 255, 255, 0.9); border: 1px solid #ddd">
                    ${ util.formatTime(d[0].x) } – ${ d[0].value.toLocaleString('ru') }
                </div>
            `,
        },
    });
};


init();
