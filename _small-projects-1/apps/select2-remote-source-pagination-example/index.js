(function() {
    'use strict';

    var PAGE_SIZE = 100;

    var $select = $('[js-select]').first();

    $select.select2({
        ajax: {
            url: 'http://localhost:8080/notes/',

            data: function(params) {
                if (params.page == null)
                    params.page = 1;

                return {
                    name__icontains: params.term,
                    //page: params.page,
                    offset: (params.page * PAGE_SIZE) - PAGE_SIZE, // For offset-limit pagination
                };
            },

            processResults: function(data, params) {
                data.results.forEach(function(item) {item.text = item.name});

                return {
                    results: data.results,
                    //pagination: {more: data.next != null},
                    pagination: {more: params.page * PAGE_SIZE <= data.count}, // For offset-limit pagination
                };
            },
        },
    });
}());
