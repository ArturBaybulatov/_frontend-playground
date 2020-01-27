import './index.html';
import './index.less';


const { ensure } = util;

const log = function(val) { console.log(val); return val }; // Debug


// https://bl.ocks.org/mbostock/b418a040bb28295e4a78581fe8e269d1


const init1 = function() {
    const svg = d3.select('[js-svg-1]');


    const points = d3
        .range(2000)
        .map(phyllotaxis(10, +svg.attr('width'), +svg.attr('height')));


    const g = svg.append('g');


    g
        .selectAll('circle')
        .data(points)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 2.5)


        // // Drag individual dots:
        //
        // .call(
        //     d3
        //         .drag()
        //
        //         .on('drag', function(d) {
        //             d3
        //                 .select(this)
        //                 .attr('cx', d.x = d3.event.x)
        //                 .attr('cy', d.y = d3.event.y);
        //         }),
        // );


    svg.call(
        d3
            .zoom()
            .scaleExtent([1 / 2, 8])
            .on('zoom', () => g.attr('transform', d3.event.transform)),
    );
};


const init2 = function() {
    const svg = d3.select('[js-svg-2]');


    const points = d3
        .range(2000)
        .map(phyllotaxis(10, +svg.attr('width'), +svg.attr('height'), true));


    const circles = svg
        .selectAll('circle')
        .data(points)
        .enter()
        .append('circle')
        .attr('transform', x => `translate(${ x[0] }, ${ x[1] })`)
        .attr('r', 2.5);


    svg
        .append('rect')
        .attr('width', +svg.attr('width'))
        .attr('height', +svg.attr('height'))
        .style('fill', 'none')
        .style('pointer-events', 'all')

        .call(
            d3
                .zoom()
                .scaleExtent([1 / 2, 4])

                .on('zoom', function() {
                    const t = d3.event.transform;
                    circles.attr('transform', x => `translate(${ t.applyX(x[0]) }, ${ t.applyY(x[1]) })`);
                }),
        );
};


const init3 = function() {
    // TODO: Refactor:


    var canvas = d3.select('[js-canvas-1]'),
        context = canvas.node().getContext("2d"),
        width = canvas.property("width"),
        height = canvas.property("height"),
        radius = 2.5;

    var points = d3.range(2000).map(phyllotaxis(10, width, height, true));

    canvas
        .call(
            d3
                .zoom()
                .scaleExtent([1 / 2, 4])
                .on("zoom", zoomed),
        );

    drawPoints();

    function zoomed() {
        context.save();
        context.clearRect(0, 0, width, height);
        context.translate(d3.event.transform.x, d3.event.transform.y);
        context.scale(d3.event.transform.k, d3.event.transform.k);
        drawPoints();
        context.restore();
    }

    function drawPoints() {
        context.beginPath();
        points.forEach(drawPoint);
        context.fill();
    }

    function drawPoint(point) {
        context.moveTo(point[0] + radius, point[1]);
        context.arc(point[0], point[1], radius, 0, 2 * Math.PI);
    }
};


const phyllotaxis = function(radius, width, height, asArray) {
    const theta = Math.PI * (3 - Math.sqrt(5));

    return function(i) {
        const r = radius * Math.sqrt(i);
        const a = theta * i;

        const x = width / 2 + r * Math.cos(a);
        const y = height / 2 + r * Math.sin(a);

        if (asArray) return [x, y];

        return { x, y };
    };
};


init1();

init2();

init3();
