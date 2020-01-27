import './index.html';
import './index.less';


const { ensure } = util;

const log = function(val) { console.log(val); return val }; // Debug


const init = function() {
    const svg = d3.select('[js-svg]');


    let circles = create(svg, 10);


    const updateIntervalId = setInterval(() => update(circles), 800);


    let createTimeoutId;

    const recreateIntervalId = setInterval(function() {
        clearTimeout(createTimeoutId);

        remove(svg);

        createTimeoutId = setTimeout(() => circles = create(svg, 10), 800);
    }, 3000);


    setTimeout(function() {
        clearInterval(updateIntervalId);
        clearInterval(recreateIntervalId);
    }, 60000);
};


const create = function(svg, count) {
    ensure.object(svg);
    ensure.nonNegativeInteger(count);


    return svg
        .selectAll('circle')
        .data(_.times(count, x => x * 100))
        .enter()
        .append('circle')
        .attr('r', () => _.random(10, 50))
        .attr('cx', () => _.random(50, 450))
        .attr('cy', () => _.random(50, 450))
        .attr('fill', 'transparent')

        .each(function(__, i) {
            d3
                .select(this)
                .transition()
                .delay(() => i * 20)
                .attr('fill', 'yellow');
        });
};


const update = function(circles) {
    ensure.object(circles);


    circles.each(function(__, i) {
        d3
            .select(this)
            .transition()
            .delay(() => i * 20)
            .attr('fill', () => `rgb(${ _.random(100, 255) }, ${ _.random(100, 255) }, ${ _.random(100, 255) })`)
            .attr('r', () => _.random(10, 50))
            .attr('cx', () => _.random(50, 450))
            .attr('cy', () => _.random(50, 450));
    });
};


const remove = function(svg) {
    ensure.object(svg);


    svg
        .selectAll('circle')
        .data([])
        .exit()

        .each(function(__, i) {
            return d3.select(this)
                .transition()
                .delay(() => i * 20)
                .attr('fill', 'transparent')
                .remove();
        });
};


init();
