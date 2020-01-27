(function() {
    'use strict';

    var ensure = util.ensure;
    var isNonEmptyString = util.isNonEmptyString;
    var isNonEmptyArray = util.isNonEmptyArray;

    var $body = $('body');


    (function singleSelectExample() {
        var $selectContainer = $('<div>', { class: 'l-row' });
        $body.append($selectContainer);

        var items = [
            { value: 1, text: 'Foo' },
            { value: 2, text: 'Bar' },
            { value: 3, text: 'Baz' },
        ];

        var slzSelect = renderSelect(items, $selectContainer);
        slzSelect.setValue(_.sample(items).value);
    }());


    var items = _.times(100, function(i) {
        return {
            id: i,
            name: util.lorem(1, _.random(1, 5)),
            age: _.random(5, 100),
            salary: util.visuallyRandomNumber() * 1000,
        };
    });


    (function singleSelectExample2() {
        var $selectContainer = $('<div>', { class: 'l-row' });
        $body.append($selectContainer);

        var slzSelect = renderSelect(items, $selectContainer, null, 'id', 'name');
        slzSelect.setValue(_.sample(items).id);

        window.setTimeout(function() {
            var slzSelect = renderSelect(items, $selectContainer, null, 'id', 'salary');
            slzSelect.setValue(_.sample(items).id);
        }, 3000);
    }());


    (function caseInsensitiveSelectExample() {
        var items = _.times(50, function() {
            var val = util.lorem(1, _.random(1, 5));
            return { value: val, text: val };
        });

        var $selectContainer = $('<div>', { class: 'l-row' });
        var slzSelect = renderSelect(items, $selectContainer);

        var $input = $('<input>');
        $body.append($('<div>', { class: 'l-row' }).html($input));
        $body.append($selectContainer);

        $input.on('keyup', function() {
            var val = $(this).val().trim();
            var item = _.find(slzSelect.options, function(item) { return util.isSameStringI(item.value, val) });

            if (!_.isObject(item)) {
                slzSelect.clear();
                return;
            }

            slzSelect.setValue(item.value);
        });
    }());


    (function caseInsensitiveMultiselectExample() {
        var items = _.times(50, function() {
            var val = util.lorem(1, _.random(1, 5));
            return { value: val, text: val };
        });

        var $selectContainer = $('<div>', { class: 'l-row' });
        var slzSelect = renderSelect(items, $selectContainer, true);

        var $input = $('<input>');
        $body.append($('<div>', { class: 'l-row' }).html($input));
        $body.append($selectContainer);

        $input.on('keyup', function() {
            var values = $(this).val().split(',').map(function(s) { return s.trim() });

            var items = values
                .map(function(val) {
                    return _.find(slzSelect.options, function(item) { return util.isSameStringI(item.value, val) });
                })

                .filter(function(item) { return _.isObject(item) });

            ensure(Array.isArray(items), 'Array expected');

            if (items.length === 0) {
                slzSelect.clear();
                return;
            }

            slzSelect.setValue(_.map(items, 'value'));
        });
    }());


    (function multiselectExample() {
        var $selectContainer = $('<div>', { class: 'l-row' });
        $body.append($selectContainer);

        //var selectExtraConfig = {
        //    persist: false,
        //    plugins: ['restore_on_backspace'], // "drag_drop" plugin requires jQuery UI
        //
        //    create: function(text) {
        //        return {
        //            text: text,
        //            value: -Number(_.uniqueId()),
        //        }
        //    },
        //};

        var slzSelect = renderSelect(items, $selectContainer, true, 'id', 'name');
        slzSelect.setValue(_(items).sampleSize(3).map('id').v);
    }());


    (function singleMulticolumnSelectExample() {
        var $selectContainer = $('<div>', { class: 'l-row' });
        $body.append($selectContainer);
        var fieldNames = ['id', 'name', 'age', 'salary'];
        var slzSelect = renderSelect(items, $selectContainer, null, 'id', 'name', null, true, fieldNames, 'row', 'col');
        slzSelect.setValue(_(items).sampleSize(3).map('id').v);
    }());


    function renderSelect(items, $container, multiple, valueField, labelField, extraConfig, multicolumn, fieldNames, rowClass, colClass) {
        ensure(Array.isArray(items), 'Array expected');
        ensure($container instanceof $, 'jQuery element expected');
        ensure(typeof multiple === 'boolean' || multiple == null, 'Boolean or null-like expected');
        ensure(isNonEmptyString(valueField) || valueField == null, 'Non-empty string or null-like expected');
        ensure(isNonEmptyString(labelField) || labelField == null, 'Non-empty string or null-like expected');
        ensure(_.isPlainObject(extraConfig) || extraConfig == null, 'Plain object or null-like expected');
        ensure(typeof multicolumn === 'boolean' || multicolumn == null, 'Boolean or null-like expected');
        ensure(typeof rowClass === 'string' || rowClass == null, 'String or null-like expected');
        ensure(typeof colClass === 'string' || colClass == null, 'String or null-like expected');

        if (multicolumn)
            ensure(isNonEmptyArray(fieldNames), 'Non-empty array expected');

        var config = {};

        if (isNonEmptyString(valueField))
            config.valueField = valueField;

        if (isNonEmptyString(labelField)) {
            config.labelField = labelField;
            config.searchField = labelField;
        }

        var config = Object.assign(config, extraConfig); // TODO: Polyfill `Object.assign()`

        if (multicolumn) {
            config.searchField = fieldNames,

            config.render = {
                option: function(item) { return renderNewMulticolumnSelectRow(item, fieldNames, rowClass, colClass) },
            };
        }

        var $select = $('<select>', { attr: { multiple: multiple } });
        var slzSelect = $select.selectize(config).get(0).selectize;
        $container.html(slzSelect.$wrapper);
        slzSelect.addOption(items);

        $container.data('$select', $select);
        $container.data('slzSelect', slzSelect);

        return slzSelect;
    }

    function renderNewMulticolumnSelectRow(item, fieldNames, rowClass, colClass) {
        ensure(_.isPlainObject(item), 'Plain object expected');
        ensure(isNonEmptyArray(fieldNames), 'Non-empty array expected');
        ensure(typeof rowClass === 'string' || rowClass == null, 'String or null-like expected');
        ensure(typeof colClass === 'string' || colClass == null, 'String or null-like expected');

        var $row = $('<div>', { class: rowClass });

        return $row.html(fieldNames.map(function(fName) {
            ensure(isNonEmptyString(fName), 'Non-empty string expected');
            return $('<span>', { text: item[fName], class: colClass });
        }));
    }
}());
