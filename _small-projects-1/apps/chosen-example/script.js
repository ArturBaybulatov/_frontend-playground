(function () {
    var $select = $('.js-select').first();
    var url = 'http://localhost:8000/api/things/?limit=10000';

    return $.get(url).then(function (res) {
        var $options = _.map(res.results, function(item) {
            return $('<option>').val(item.id).text(item.text);
        });

        $select.html($options);

        $select.chosen(); // Requires a "<select>" with "<options>"
                          // Multiple choices are supported

        $select.on('change', function($evt) {
            console.log($(this).find(':selected').map(function(i, opt) {return $(opt).text()}));
        });
    });
}());
