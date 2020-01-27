(function() {
    'use strict';

    window.g = window; // Debug
    var log = g.log = _.unary(console.log); // Debug

    var ensure = util.ensure;


    var init = function() {
        var commonDpOpts = {
            dateFormat: 'dd.mm.yy',
            minDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 15),
            maxDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15),
        };


        var $startDate = ensure.jqElement($('[js-start-date]')).datepicker(commonDpOpts);
        $startDate.datepicker('setDate', new Date());


        var $endDate = ensure.jqElement($('[js-end-date]')).datepicker(commonDpOpts);
        $endDate.datepicker('setDate', new Date());
    };


    init();
}());
