import './index.html';
import './index.less';


const { ensure } = util;

const log = function(val) { console.log(val); return val }; // Debug


const init = async function() {
    const data = await d3.csv("../../assets/d3-example-3/sp500.csv", function(d) {
        d.date = d3.timeParse("%b %Y")(d.date);
        d.price = +d.price;

        return d;
    });


    // const data = _.times(20, function() {
    //     return {
    //         date: new Date(_.random(new Date('2000-01-01').getTime(), new Date('2000-12-31').getTime())),
    //         price: _.random(1, 999) * _.sample([10, 100]),
    //     };
    // }).sort((a, b) => a.date - b.date);


    const svg = d3.select('[js-svg]');


    const margin = { top: 20, right: 20, bottom: 30, left: 60 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;


    const scaleX = d3.scaleTime().range([0, width]).domain(d3.extent(data, x => x.date));

    const scaleY = d3.scaleLinear().range([height, 0]).domain([0, d3.max(data, x => x.price)]);


    const area = d3
        .area()
        .curve(d3.curveMonotoneX)
        .x(x => scaleX(x.date))
        .y0(height)
        .y1(x => scaleY(x.price));


    svg
        .append("defs")

        .append("clipPath")
        .attr("id", "clip")

        .append("rect")
        .attr("width", width)
        .attr("height", height);


    const g = svg
        .append("g")
        .attr("transform", `translate(${ margin.left }, ${ margin.top })`);


    g
        .append("path")
        .datum(data)
        .attr("js-area", "")
        .attr("class", "area")
        .attr("d", data => area(data));


    const xAxis = d3.axisBottom(scaleX);

    g
        .append("g")
        .attr("js-axis-x", "")
        .attr("transform", `translate(0, ${ height })`)
        .call(xAxis);


    g
        .append("g")
        .call(d3.axisLeft(scaleY));


    svg.call(
        d3
            .zoom()
            .scaleExtent([1, 32])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])

            .on("zoom", function() {
                const rescaleX = d3.event.transform.rescaleX(scaleX);

                g.select("[js-area]").attr("d", area.x(x => rescaleX(x.date)));
                g.select("[js-axis-x]").call(xAxis.scale(rescaleX));
            }),
    );
};


init();
