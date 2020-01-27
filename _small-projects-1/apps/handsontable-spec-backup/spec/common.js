(function() {
    'use strict';

    var common = window.common = {};

    var ensure = util.ensure;
    var isNonEmptyString = util.isNonEmptyString;
    var isSameStringI = util.isSameStringI;
    var handleRejection = util.handleRejection;

    common.FieldTypes = {
        MULTIPLE_CHOICE: 1,
        CHOICE: 2,
        MULTI_KEY_VALUE: 3,
        VALUE: 4,
    };

    var SpecialFieldIds = common.SpecialFieldIds = {
        AGE: -118,
        BRAND: -100,
        COLOR: -106,
        DIRECTIONS: -120,
        GENDER: -116,
        RUS_SIZE: -119,
        SUBJECT: -105,
        TECH_SIZE: -113,
    };


    common.baseRenderer = function(htSheet, cell, rowIndex, colIndex, __, ___, field) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);

        var $tabView = ensure.jqElement($(htSheet.rootElement).closest('[js-tab-view]'));
        var spec = ensure.plainObject($tabView.data('spec'));
        var row = ensure.plainObject(htSheet.getSourceDataAtRow(rowIndex, colIndex));
        var extraRequiredFields = ensure.maybe.array(spec.RequiredFields);
        var $cell = $(cell);

        if (highlightNeeded(field, row, extraRequiredFields))
            $cell.css('backgroundColor', '#ffefd0').attr('title', 'Заполните поле');
        else
            $cell.css('backgroundColor', 'white').attr('title', '');

        var errorId = _.get(row, [field.Id, 'ErrorId']);

        if (util.isNumber(errorId)) {
            var errorMessagesStr = getErrorMessages(errorId, spec.Errors).join('\n');

            if (isNonEmptyString(errorMessagesStr))
                $cell.css('backgroundColor', '#fcc').attr('title', errorMessagesStr);
            else
                $cell.css('backgroundColor', 'white').attr('title', '');
        }
    };


    common.getDictionaryAsync = _.memoize(function(fieldId) {
        return $.when().then(function() {
            ensure.numeric(fieldId);

            return $.get('dictionary/' + fieldId).then(function(res) {
                ensure.plainObject(res);
                ensure(res.ResultCode === 0, res.Message);
                return ensure.nonEmptyArray(res.Data);
            });
        });
    });

    common.getRusSizeDictionaryAsync = _.memoize(function(brand, gender, age, subject) {
        return $.when().then(function() {
            ensure.nonEmptyString(brand, gender, age, subject);

            var url = [
                'wbsizemapping/',
                'brand=' + brand,
                '&gender=' + gender,
                '&age=' + age,
                '&subject=' + subject,
            ].join('');

            return $.get(url).then(function(res) {
                ensure.plainObject(res);
                ensure(res.ResultCode === 0, res.Message);

                var data = ensure.nonEmptyArray(_.get(res, ['Data', 'mappings']));
                var metadata = ensure.nonEmptyArray(_.get(res, ['Data', 'meas_fields']));

                data.forEach(function(item) {
                    metadata.forEach(function(meta) { item[meta.id] = item.meas[meta.id] });
                });

                return { data: data, metadata: metadata };
            });
        });
    });

    common.getDirectionsDictionaryAsync = _.memoize(function(brand) {
        return $.when().then(function() {
            ensure.nonEmptyString(brand);

            return $.get('directions/' + brand).then(function(res) {
                ensure.plainObject(res);
                ensure(res.ResultCode === 0, res.Message);

                var data = ensure.nonEmptyArray(res.Data);

                return data.map(function(item) {
                    ensure.plainObject(item);
                    return item.name;
                });
            });
        });
    });


    common.renderSelect = function(items, $container, multiple, valueField, labelField, extraConfig, multicolumn, fields, rowClass, colClass) {
        ensure.array(items);
        ensure.jqElement($container);
        ensure.maybe.boolean(multiple, multicolumn);
        ensure.maybe.nonEmptyString(valueField, labelField);
        ensure.maybe.plainObject(extraConfig);
        ensure.maybe.string(rowClass, colClass);

        if (multicolumn)
            ensure.nonEmptyArray(fields);

        var config = {};

        if (isNonEmptyString(valueField))
            config.valueField = valueField;

        if (isNonEmptyString(labelField)) {
            config.labelField = labelField;
            config.searchField = labelField;
        }

        var config = Object.assign(config, extraConfig); // TODO: Polyfill `Object.assign()`

        if (multicolumn) {
            config.searchField = _.map(fields, 'name');

            config.render = {
                option: function(item) { return renderNewMulticolumnSelectRow(item, fields, rowClass, colClass) },
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

    var renderNewMulticolumnSelectRow = function(item, fields, rowClass, colClass) {
        ensure.plainObject(item);
        ensure.nonEmptyArray(fields);
        ensure.maybe.string(rowClass, colClass);

        var $row = $('<div>', { class: rowClass });

        return $row.html(fields.map(function(field) {
            ensure.plainObject(field);
            ensure.nonEmptyString(field.name);

            var title = isNonEmptyString(field.title) ? field.title : field.name;
            var $col = $('<span>', { text: item[field.name], title: title, class: colClass });

            if (isNonEmptyString(field.width))
                $col.addClass(colClass + '--' + field.width); // Add BEM modifier

            return $col;
        }));
    };


    var highlightNeeded = function(field, row, extraRequiredFields) {
        ensure.object(field);
        ensure.plainObject(row);
        ensure.maybe.array(extraRequiredFields);

        if (!field.highlightable || field.IsReadonly || isNonEmptyString(_.get(row, [field.Id, '_initialValue'])))
            return false;

        if (field.IsRequired)
            return true;

        if (Array.isArray(extraRequiredFields)) {
            for (var i = 0; i < extraRequiredFields.length; i++) {
                var obj = extraRequiredFields[i];

                if (!_.isPlainObject(obj))
                    continue;

                var subjectName = _.get(row, [SpecialFieldIds.SUBJECT, 'Value']);

                if (isSameStringI(subjectName, obj.SubjectName) && ~obj.Fields.indexOf(field.Id))
                    return true;
            }
        }
    };

    var getErrorMessages = common.getErrorMessages = function(errorId, errorDescriptions) {
        ensure.number(errorId);
        ensure.nonEmptyArray(errorDescriptions);

        return errorDescriptions
            .filter(function(errDescr) {
                ensure.plainObject(errDescr);
                ensure.array(errDescr.Ids);
                return ~errDescr.Ids.indexOf(errorId);
            })

            .map(function(errDescr) { return ensure.nonEmptyString(errDescr.Msg) });
    };
}());
