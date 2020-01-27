(function() {
    'use strict';

    var $select = $('[js-select]').first();

    $select.selectize({
        valueField: 'id',
        labelField: 'name',
        preload: true,

        load: function(query, callback) {
            $.get('http://localhost:8080/products/', {name__icontains: query})
                .then(function(res) {
                    callback(res.results);
                })

                .catch(function(err) {
                    console.warn(err);
                    callback();
                });
        },
    });

    // No pagination supported?
}());
