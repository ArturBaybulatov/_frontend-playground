(function() {
    'use strict';

    var data = _.times(100000, function(i) {
        return {
            id: i,
            name: 'Foo-' + i,
            quantity: randomNumber(),
            active: _.sample([true, false, null]),
            size: randomFileSize(),
            expires: randomDate(),
        };
    });

    var fields = { // Old-style, see "datasource-remote-data" example
        id: {type: 'number'},
        name: {type: 'string'},
        quantity: {type: 'number'},
        active: {type: 'boolean'},
        size: {type: 'number'},
        expires: {type: 'date'},
    };

    var dataSource = new kendo.data.DataSource({
        data: data,
        pageSize: 100,
        inPlaceSort: true, // Optimize scrolling of sorted data
        schema: {model: {id: 'id', fields: fields}},
    });

    var columns = [
        {field: 'name', title: 'Name'},
        {field: 'quantity', title: 'Quantity'},
        {field: 'active', title: 'Active'},
        {field: 'size', title: 'Size', template: function(item) {return humanFileSize(item.size)}},
        {field: 'expires', title: 'Expires'},
    ];

    columns.forEach(function(column) {
        var fieldName = column.field;
        var columnType = _.get(fields[fieldName], 'type');

        if (columnType === 'date')
            setIfNone(column, 'template', function(item) {
                return formatDate(item[fieldName]);
            });

        if (columnType === 'number')
            setIfNone(column, 'filterable.ui', function($el) {
                $el.kendoNumericTextBox({format: 'n0'});
            });

        if (columnType === 'boolean')
            setIfNone(column, 'template', function(item) {
                if (item[fieldName] === true)
                    return 'Yes';
                else if (item[fieldName] === false)
                    return 'No';
                else
                    return 'Maybe';
            });
    });

    var $window = $(window);
    var $grid = $('[js-grid]').first();

    $grid.kendoGrid({
        sortable: true,
        filterable: true,
        height: '100%',
        dataSource: dataSource,
        columns: columns,
        scrollable: {virtual: true},

        filterMenuInit: function(evt) {
            var $filterMenu = evt.container;
            var fieldName = evt.field;
            var fieldType = _.get(fields[fieldName], 'type');

            adjustFilterMenuValues($filterMenu, fieldType);
        },
    });

    $window.on('resize', function() {kendo.resize($grid)});

    function adjustFilterMenuValues($filterMenu, fieldType) {
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

    function randomNumber() {
        return _.sample([_.random(1, 9), _.random(10, 99), _.random(100, 999)]);
    }

    function randomFileSize() {
        return _.sample([
            0,
            _.random(1, 9),
            _.random(10, 99),
            _.random(100, 999),
            _.random(1000, 9999),
            _.random(10000, 99999),
            _.random(100000, 999999),
            _.random(1000000, 9999999),
            _.random(10000000, 99999999),
            _.random(100000000, 999999999),
            _.random(1000000000, 9999999999),
        ]);
    }

    function randomDate() {
        return new Date(_.random(1990, 2017), _.random(11), _.random(1, 28));
    }

    function humanFileSize(size) {
        var i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
        return Number((size / Math.pow(1024, i)).toFixed(2)) + ' ' + ['B','kB','MB','GB','TB'][i];
    }

    function formatDate(date) {
        return [pad(date.getDate()), pad(date.getMonth() + 1), date.getFullYear()].join('.');
    }

    function pad(n) {
        return n < 10 ? "0" + n : n;
    }

    function setIfNone(obj, propPath, val) {
        if (_.get(obj, propPath) == null)
            _.set(obj, propPath, val);
    }
}());
