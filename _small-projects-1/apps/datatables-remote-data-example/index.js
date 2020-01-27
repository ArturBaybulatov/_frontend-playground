(function() {
    'use strict';

    var $table = $('[js-table]').first();

    var datatable = $table.DataTable({
        serverSide: true,
        deferRender: true, // For huge data sets
        searchDelay: 1000,
        scrollX: true,
        scrollY: 'calc(100vh - 150px)', // For "scroller" extension
        scroller: true,

        ajax: {
            url: 'http://localhost:8080/notes/',
            //beforeSend: function(xhr) {xhr.setRequestHeader('foo', bar)},
            //complete: function(xhr) {console.log(xhr.getResponseHeader('baz'))},

            data: function(params) {
                var ordering = params.columns[params.order[0].column].name;

                if (params.order[0].dir === 'desc')
                    ordering = '-' + ordering;

                return {
                    offset: params.start,
                    limit: params.length, // TODO: Is this required?
                    ordering: ordering,
                    name__icontains: params.search.value,
                };
            },

            dataSrc: function(res) {
                res.recordsFiltered = res.count;
                res.recordsTotal = res.count;

                return res.results;
            },
        },

        columns: [
            {title: 'ID', data: 'id', name: 'id'},
            {title: 'Name', data: 'name', name: 'name'},
            {title: 'Private', data: 'private', name: 'private'},
            {title: 'Share count', data: 'share_count', name: 'share_count'},
            {title: 'Category name', data: 'category.name', name: 'category__name'},
        ],
    });
}());
