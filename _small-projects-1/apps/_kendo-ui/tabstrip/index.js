(function() {
    'use strict';

    window.g = window; // Debug
    var log = g.log = _.unary(console.log); // Debug

    var ensure = util.ensure;


    var init = function() {
        var $tabStrip = ensure.jqElement($('[js-tab-strip]'));

        var kTabStrip = $tabStrip.kendoTabStrip({
            dataTextField: 'text',
            dataContentField: 'content',

            dataSource: _.times(_.random(1, 5), function() {
                return {
                    text: util.lorem(1, _.random(1, 3)).toUpperCase(),
                    content: _.times(_.random(1, 100), function() { return '<p>' + util.lorem() + '</p>' }).join(''),
                };
            }),
        }).data('kendoTabStrip');

        kTabStrip.select(0);


        var $window = $(window);
        $window.on('resize', function() { kTabStrip.resize() });
    };


    init();
}());
