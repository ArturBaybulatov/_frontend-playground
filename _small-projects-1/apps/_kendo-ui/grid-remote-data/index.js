(function() {
    'use strict';

    var PAGE_SIZE = 100;

    var ODATA_DJANGO_OPERATORS = [
        {name: 'eq', value: 'iexact'},
        {name: 'neq', value: 'iexact', negative: true},

        {name: 'isnull', value: 'isnull'},
        {name: 'isnotnull', value: 'isnull', negative: true},

        {name: 'lt', value: 'lt'},
        {name: 'lte', value: 'lte'},
        {name: 'gt', value: 'gt'},
        {name: 'gte', value: 'gte'},

        {name: 'startswith', value: 'istartswith'},
        {name: 'endswith', value: 'iendswith'},

        {name: 'contains', value: 'icontains'},
        {name: 'doesnotcontain', value: 'icontains', negative: true},

        //{name: 'isempty', value: 'xxx'},
        //{name: 'isnotempty', value: 'xxx', negative: true},
    ];

    var BASE_URL = 'http://localhost:8080/notes/';

    var fields = [
        {name: 'id', title: 'ID', type: 'number', editable: false},
        {name: 'name', title: 'Name', type: 'string', validation: {required: true}},
        {name: 'private', title: 'Private', type: 'boolean'},
        {name: 'share_count', title: 'Share count', type: 'number'},
        {name: 'category.name', title: 'Category name', type: 'string', editable: false},
        {name: '_author.username', title: 'Author username', type: 'string', editable: false},
    ];

    var dataSource = new kendo.data.DataSource({
        //type: 'odata-v4',
        pageSize: PAGE_SIZE,
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,

        transport: {
            read: {
                url: BASE_URL,
                dataType: 'json',

                data: function(origParams) {
                    var params = $.extend({}, origParams);

                    for (var key in origParams)
                        delete origParams[key];

                    var ordering = _.get(params, 'sort[0].field');

                    if (ordering != null && _.get(params, 'sort[0].dir') === 'desc')
                        ordering = '-' + ordering;

                    var filterParams = filtersToDjango(_.get(params, 'filter.filters', []));

                    $.extend(
                        origParams,
                        filterParams,

                        {
                            offset: params.skip,
                            limit: params.take,
                            ordering: ordering,
                        }
                    );
                },
            },

            create: {url: BASE_URL, type: 'POST', dataType: 'json'},
            update: {url: function(item) {return BASE_URL + item.id + '/'}, type: 'PUT', dataType: 'json'},
            destroy: {url: function(item) {return BASE_URL + item.id + '/'}, type: 'DELETE', dataType: 'json'},
        },

        schema: {
            total: 'count',

            data: function(res) {
                if (!Array.isArray(res) && 'results' in res)
                    return res.results;

                return res;
            },

            model: {
                id: 'id',
                fields: _(fields).keyBy('name').mapValues(function(o) {return _.pick(o, ['type','editable'])}).v,
            },
        },
    });

    var gridColumns = fields.map(function(field) {
        var gridCol = {field: field.name, title: field.title};

        if (field.template != null)
            gridCol.template = field.template;

        if (field.type === 'date')
            util.setIfNone(gridCol, 'template', function(item) {
                return util.formatDate(item[field.name]);
            });

        if (field.type === 'number')
            util.setIfNone(gridCol, 'filterable.ui', function($el) {
                $el.kendoNumericTextBox({format: 'n0'});
            });

        if (field.type === 'boolean')
            util.setIfNone(gridCol, 'template', function(item) {
                if (item[field.name] === true)
                    return 'Yes';
                else if (item[field.name] === false)
                    return 'No';
                else
                    return 'Maybe';
            });

        return gridCol;
    });

    gridColumns.push({command: ['edit','destroy'], attributes: {style: 'white-space: nowrap'}});

    var $window = $(window);
    var $grid = $('[js-grid]').first();

    var kendoGrid = $grid.kendoGrid({
        sortable: true,
        filterable: true,
        //selectable: true,
        scrollable: {virtual: true},
        //pageable: true,
        editable: 'inline', // Not really working with virtual scrolling
        height: '100%',
        dataSource: dataSource,
        columns: gridColumns,
        toolbar: ['create'],
        filterMenuInit: function(args) {customizeGridFilterMenu(args.container, args.field)},
    }).data('kendoGrid');

    $window.on('resize', function() {kendo.resize($grid)});


    function customizeGridFilterMenu($filterMenu, fieldName) {
        var fieldType = _(fields).find({name: fieldName}).get('type').v;

        if (fieldType === 'string') {
            var dropdown1 = $filterMenu.find('select[data-role="dropdownlist"]').first().data('kendoDropDownList');
            dropdown1.value('contains');
            dropdown1.trigger('change');

            var dropdown2 = $filterMenu.find('select[data-role="dropdownlist"]').last().data('kendoDropDownList');
            dropdown2.value('doesnotcontain');
            dropdown2.trigger('change');
        }

        if (fieldType === 'number' || fieldType === 'date') {
            var dropdown1 = $filterMenu.find('select[data-role="dropdownlist"]').first().data('kendoDropDownList');
            dropdown1.value('gte');
            dropdown1.trigger('change');

            var dropdown2 = $filterMenu.find('select[data-role="dropdownlist"]').last().data('kendoDropDownList');
            dropdown2.value('lte');
            dropdown2.trigger('change');
        }
    }

    function filtersToDjango(filters) {
        var filterParams = {};

        flattenFilters(filters).forEach(function(filter) {
            var fieldName = filter.field;
            var fieldType = _(fields).find({name: fieldName}).get('type').v;

            if (fieldType === 'boolean') {
                filterParams[filter.field] = filter.value;
                return;
            }

            var djangoOper = _.find(ODATA_DJANGO_OPERATORS, {name: filter.operator});

            if (djangoOper != null) {
                if (djangoOper.negative)
                    filterParams[filter.field + '__' + djangoOper.value + '!'] = filter.value;
                else
                    filterParams[filter.field + '__' + djangoOper.value] = filter.value;
            }
        });

        return filterParams;
    }

    function flattenFilters(filters) {
        filters
            .filter(function(filter) {return filter.filters != null})
            .forEach(function(filter) {filters.push.apply(filters, filter.filters)});

        return filters;
    }
}());
