(function() {
    'use strict';

    window.g = window; // Debug
    var log = _.unary(console.log); // Debug

    var ensure = util.ensure;
    var addBemModifier = util.addBemModifier;


    var init = function() {
        var $funnel = ensure.jqElement($('[js-funnel]'));
        var args = getData();
        var headings = args.headings;
        var items = args.items;

        drawFunnel($funnel, headings, items);
    };

    var getData = function() {
        var headings = {
            leftSidebar: 'События',
            rightSidebar1: '% от предыдущего',
            rightSidebar2: '% от общего',
        };

        var labels = sampleData.funnelLabels;

        var items = _(_.random(3, 10))
            .times(function() {
                var lbl = _.sample(labels);

                return {
                    abbr: lbl.abbr,
                    name: lbl.name,
                    value: _.random(10, 100000),
                    colorClass: _.sample('abcdefghijklmno'),
                };
            })

            .sort(function(a, b) { return b.value - a.value }).v;

        var firstItem = items[0];

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var prevItem = i > 0 ? items[i - 1] : null;
            item.percentageRel = _.isPlainObject(prevItem) ? 100 * item.value / prevItem.value : 100;
            item.percentageAbs = _.isPlainObject(prevItem) ? item.value / firstItem.value * 100 : 100;
        }

        return { headings: headings, items: items };
    };

    var drawFunnel = function($funnel, headings, items) {
        ensure.jqElement($funnel);
        ensure.plainObject(headings);
        ensure.array(items);


        var $labels = ensure.jqElement($funnel.find('[js-labels]'));

        $labels.html($('<div>', {
            text: headings.leftSidebar,
            class: 'u-dark ' + addBemModifier('funnel__legend-label-container', 'heading'),
        }));

        $labels.append(items.map(function(item, i) {
            return $('<div>', {
                class: [i % 2 !== 0 ? 'u-dark' : '', 'funnel__legend-label-container'].join(' '),

                html: [
                    $('<div>', {
                        text: item.abbr,
                        class: [item.colorClass, 'funnel__legend-label-icon'].join(' '),
                    }),

                    $('<div>', {
                        text: item.name,
                        class: ['funnel__legend-label-name'].join(' '),
                    }),
                ],
            });
        }));


        var $chart = ensure.jqElement($funnel.find('[js-chart]'));
        $chart.html($('<div>', { class: 'u-dark funnel__chart-block-container' }));

        $chart.append(items.map(function(item, i) {
            return $('<div>', {
                class: [i % 2 !== 0 ? 'u-dark' : '', 'funnel__chart-block-container'].join(' '),

                html: $('<div>', {
                    text: item.value.toLocaleString(),
                    class: item.colorClass + ' funnel__chart-block',
                    css: { width: item.percentageAbs + '%' },
                }),
            });
        }));


        var $relPercentages = ensure.jqElement($funnel.find('[js-rel-percentages]'));

        $relPercentages.html($('<div>', {
            text: headings.rightSidebar1,
            class: 'u-dark ' + addBemModifier('funnel__right-sidebar-block', 'heading'),
        }));

        $relPercentages.append(items.map(function(item, i) {
            return $('<div>', {
                text: item.percentageRel.toFixed(1) + '%',
                class: [i % 2 !== 0 ? 'u-dark' : '', 'funnel__right-sidebar-block'].join(' '),
            });
        }));


        var $absPercentages = ensure.jqElement($funnel.find('[js-abs-percentages]'));

        $absPercentages.html($('<div>', {
            text: headings.rightSidebar2,
            class: 'u-dark ' + addBemModifier('funnel__right-sidebar-block', 'heading'),
        }));

        $absPercentages.append(items.map(function(item, i) {
            return $('<div>', {
                text: item.percentageAbs.toFixed(1) + '%',
                class: [i % 2 !== 0 ? 'u-dark' : '', 'funnel__right-sidebar-block'].join(' '),
            });
        }));
    };


    init();
}());
