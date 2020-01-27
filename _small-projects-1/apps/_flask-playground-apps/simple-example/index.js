(function() {
    'use strict';

    window.g = window; // Debug
    var log = g.log = _.unary(console.log); // Debug

    var ensure = util.ensure;

    var BASE_URL = 'http://localhost:8666/';


    var init = function() {
        $.ajaxSetup({ contentType: 'application/json; charset=utf-8', processData: false });

        $.post(BASE_URL, JSON.stringify({ foo: 'bar' }))
            .then(function(res) { toastr.success(JSON.stringify(res)) })
            .catch(handleRejection('Request error'));
    };


    var handleRejection = function(msg) {
        ensure.nonEmptyString(msg);

        return function(err) {
            toastr.error(err.message, msg);
            console.error(err);
        };
    };


    init();
}());
