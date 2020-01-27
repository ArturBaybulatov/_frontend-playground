(function() {
    'use strict';

    var PAGE_SIZE = 100;

    var BASE_URL = 'http://localhost:8080/notes/';

    var fields = [
        {name: 'id', title: 'ID', type: 'number', editable: false},
        {name: 'name', title: 'Name', type: 'string'},
        {name: 'share_count', title: 'Share count', type: 'number'},
        {name: 'private', title: 'Private', type: 'boolean'},
    ];

    var dataSource = new kendo.data.DataSource({
        pageSize: PAGE_SIZE,
        serverPaging: true,
        serverSorting: true,

        transport: {
            read: {
                url: BASE_URL,
                dataType: 'json', // Need?

                data: function(origParams) {
                    var params = $.extend({}, origParams);

                    for (var key in origParams)
                        delete origParams[key];

                    var ordering = _.get(params, 'sort[0].field');

                    if (ordering != null && _.get(params, 'sort[0].dir') === 'desc')
                        ordering = '-' + ordering;

                    $.extend(origParams, {
                        offset: PAGE_SIZE * params.page - PAGE_SIZE,
                        ordering: ordering,
                    });
                },
            },
        },

        schema: {
            data: 'results',
            total: 'count',

            model: {
                id: 'id',
                fields: _(fields).keyBy('name').mapValues(function(o) {return _.pick(o, ['type','editable'])}).v,
            },
        },

        change: function() {
            $list.html(kendo.render(listItemTpl, this.view()));
        },
    });

    var $toolbar = $('[js-toolbar]').first();
    var $list = $('[js-list]').first();
    var listItemTpl = kendo.template($('[js-list-item-tpl]').first().html());

    var toolbarVm = kendo.observable({
        page: 5,
        sortField: 'name',
        sortDir: 'asc',
        sortFields: fields,

        sortDirs: [
            {name: 'asc', title: 'Asc'},
            {name: 'desc', title: 'Desc'},
        ],
    });


    toolbarVm.bind('change', function(evt) {
        dataSource.query({page: toolbarVm.page, sort: {field: toolbarVm.sortField, dir: toolbarVm.sortDir}});
    });

    kendo.bind($toolbar, toolbarVm);

    dataSource.query({page: toolbarVm.page, sort: {field: toolbarVm.sortField, dir: toolbarVm.sortDir}});
}());
