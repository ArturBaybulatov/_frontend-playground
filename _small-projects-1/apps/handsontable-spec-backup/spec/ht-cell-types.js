(function() {
    'use strict';

    var ensure = util.ensure;
    var isNonEmptyString = util.isNonEmptyString;
    var isSameStringI = util.isSameStringI;
    var isNonEmptyArray = util.isNonEmptyArray;
    var isJqElement = util.isJqElement;
    var handleRejection = util.handleRejection;
    var popup = util.popup;
    var block = util.block;
    var unblock = util.unblock;

    var SpecialFieldIds = common.SpecialFieldIds;
    var baseRenderer = common.baseRenderer;
    var getDictionaryAsync = common.getDictionaryAsync;
    var getRusSizeDictionaryAsync = common.getRusSizeDictionaryAsync;
    var getDirectionsDictionaryAsync = common.getDirectionsDictionaryAsync;
    var renderSelect = common.renderSelect;


    (function registerCustomChoiceType() {
        var SelectEditor = Handsontable.editors.BaseEditor.prototype.extend();
        $.extend(SelectEditor.prototype, { init: noop, setValue: noop, focus: noop, getValue: noop, close: noop });

        SelectEditor.prototype.open = function() {
            var self = this;
            var htSheet = self.instance;
            htSheet.updateSettings({ readOnly: true, disableVisualSelection: true });
            var origVal = htSheet.getDataAtCell(self.row, self.col);
            var $selectContainer = $('<div>', { class: 'popup-content__field', attr: { 'js-select-container': '' } });
            var $popup = $('<div>', { class: 'popup-content', html: $selectContainer });

            popup('Выберите значение', $popup, {
                open: function() {
                    var field = self.cellProperties;
                    block();

                    getDictionaryAsync(field.Id)
                        .always(unblock)

                        .then(function(dictItems) {
                            var selectItems = dictItems
                                .map(function(s) {
                                    if (typeof s !== 'string') return null;
                                    s = s.trim();
                                    if (s === '') return null;
                                    return s;
                                })

                                .filter(function(val) { return val != null })
                                .map(function(s) { return { value: s, text: s } });

                            var slzSelect = renderSelect(selectItems, $selectContainer);

                            var val = htSheet.getDataAtCell(self.row, self.col);

                            if (!isNonEmptyString(val)) {
                                slzSelect.open();
                                $popup.data('ready', true);
                                return;
                            }

                            var item = _.find(slzSelect.options, function(item) { return isSameStringI(item.value, val) });

                            if (!_.isObject(item)) {
                                slzSelect.open();
                                $popup.data('ready', true);
                                return;
                            }

                            slzSelect.setValue(item.value);
                            slzSelect.open();
                            $popup.data('ready', true);
                        })

                        .catch(handleRejection('Извините, произошла ошибка при получении словарей'));
                },

                ok: function() {
                    if (!$popup.data('ready'))
                        return;

                    var slzSelect = ensure.object($selectContainer.data('slzSelect'));
                    htSheet.setDataAtCell(self.row, self.col, slzSelect.getValue());
                    $popup.data('dontReset', true);
                    $popup.dialog('close');
                },

                close: function() {
                    htSheet.updateSettings({ readOnly: false, disableVisualSelection: false });
                    htSheet.selectCell(self.row, self.col);

                    if (!$popup.data('dontReset'))
                        htSheet.setDataAtCell(self.row, self.col, origVal);
                },
            });
        };

        Handsontable.cellTypes.registerCellType('custom.choice', {
            editor: SelectEditor,
            renderer: baseRenderer,
        });
    }());

    (function registerCustomMultipleChoiceType() {
        var MultiselectEditor = Handsontable.editors.BaseEditor.prototype.extend();
        $.extend(MultiselectEditor.prototype, { init: noop, setValue: noop, focus: noop, getValue: noop, close: noop });

        MultiselectEditor.prototype.open = function() {
            var self = this;
            var htSheet = self.instance;
            htSheet.updateSettings({ readOnly: true, disableVisualSelection: true });
            var origVal = htSheet.getDataAtCell(self.row, self.col);
            var $selectContainer = $('<div>', { class: 'popup-content__field', attr: { 'js-select-container': '' } });
            var $popup = $('<div>', { class: 'popup-content', html: $selectContainer });

            popup('Выберите одно или несколько значений', $popup, {
                open: function() {
                    var field = self.cellProperties;
                    block();

                    getDictionaryAsync(field.Id)
                        .always(unblock)

                        .then(function(dictItems) {
                            var selectItems = dictItems
                                .map(function(s) {
                                    if (typeof s !== 'string') return null;
                                    s = s.trim();
                                    if (s === '') return null;
                                    return s;
                                })

                                .filter(function(val) { return val != null })
                                .map(function(s) { return { value: s, text: s } });

                            var slzSelect = renderSelect(selectItems, $selectContainer, true);

                            var val = htSheet.getDataAtCell(self.row, self.col);

                            if (!isNonEmptyString(val)) {
                                slzSelect.open();
                                $popup.data('ready', true);
                                return;
                            }

                            var values = val
                                .split(';')
                                .map(function(s) { s = s.trim(); if (s === '') return null; return s })
                                .filter(function(s) { return s != null });

                            var items = values
                                .map(function(val) {
                                    return _.find(slzSelect.options, function(item) { return isSameStringI(item.value, val) });
                                })

                                .filter(function(item) { return _.isObject(item) });

                            slzSelect.setValue(_.map(items, 'value'));
                            slzSelect.open();
                            $popup.data('ready', true);
                        })

                        .catch(handleRejection('Извините, произошла ошибка при получении словарей'));
                },

                ok: function() {
                    if (!$popup.data('ready'))
                        return;

                    var slzSelect = ensure.object($selectContainer.data('slzSelect'));
                    var items = slzSelect.getValue();
                    var val = isNonEmptyArray(items) ? items.join('; ') : null;
                    htSheet.setDataAtCell(self.row, self.col, val);
                    $popup.data('dontReset', true);
                    $popup.dialog('close');
                },

                close: function() {
                    htSheet.updateSettings({ readOnly: false, disableVisualSelection: false });
                    htSheet.selectCell(self.row, self.col);

                    if (!$popup.data('dontReset'))
                        htSheet.setDataAtCell(self.row, self.col, origVal);
                }
            });
        };

        Handsontable.cellTypes.registerCellType('custom.multiple-choice', {
            editor: MultiselectEditor,
            renderer: baseRenderer,
        });
    }());

    (function registerCustomDirectionsType() {
        var DirectionsEditor = Handsontable.editors.BaseEditor.prototype.extend();
        $.extend(DirectionsEditor.prototype, { init: noop, setValue: noop, focus: noop, getValue: noop, close: noop });

        DirectionsEditor.prototype.open = function() {
            var self = this;
            var htSheet = self.instance;

            var row = ensure.object(htSheet.getSourceDataAtRow(self.row));
            var brand = _.get(row, [SpecialFieldIds.BRAND, 'Value']);

            if (!isNonEmptyString(brand)) {
                toastr.error('Пожалуйста, заполните поле "бренд"');
                return;
            }

            htSheet.updateSettings({ readOnly: true, disableVisualSelection: true });
            var origVal = htSheet.getDataAtCell(self.row, self.col);
            var $selectContainer = $('<div>', { class: 'popup-content__field', attr: { 'js-select-container': '' } });
            var $popup = $('<div>', { class: 'popup-content', html: $selectContainer });

            popup('Выберите направление', $popup, {
                open: function() {
                    block();

                    getDirectionsDictionaryAsync(brand)
                        .always(unblock)

                        .then(function(dictItems) {
                            var selectItems = dictItems
                                .map(function(s) {
                                    if (typeof s !== 'string') return null;
                                    s = s.trim();
                                    if (s === '') return null;
                                    return s;
                                })

                                .filter(function(val) { return val != null })
                                .map(function(s) { return { value: s, text: s } });

                            var slzSelect = renderSelect(selectItems, $selectContainer);

                            var val = htSheet.getDataAtCell(self.row, self.col);

                            if (!isNonEmptyString(val)) {
                                slzSelect.open();
                                $popup.data('ready', true);
                                return;
                            }

                            var item = _.find(slzSelect.options, function(item) { return isSameStringI(item.value, val) });

                            if (!_.isObject(item)) {
                                slzSelect.open();
                                $popup.data('ready', true);
                                return;
                            }

                            slzSelect.setValue(item.value);
                            slzSelect.open();
                            $popup.data('ready', true);
                        })

                        .catch(handleRejection('Извините, произошла ошибка при получении словарей'));
                },

                ok: function() {
                    if (!$popup.data('ready'))
                        return;

                    var slzSelect = ensure.object($selectContainer.data('slzSelect'));
                    htSheet.setDataAtCell(self.row, self.col, slzSelect.getValue());
                    $popup.data('dontReset', true);
                    $popup.dialog('close');
                },

                close: function() {
                    htSheet.updateSettings({ readOnly: false, disableVisualSelection: false });
                    htSheet.selectCell(self.row, self.col);

                    if (!$popup.data('dontReset'))
                        htSheet.setDataAtCell(self.row, self.col, origVal);
                }
            });
        };

        Handsontable.cellTypes.registerCellType('custom.directions', {
            editor: DirectionsEditor,
            renderer: baseRenderer,
        });
    }());

    (function registerCustomRusSizeType() {
        var RusSizeEditor = Handsontable.editors.BaseEditor.prototype.extend();
        $.extend(RusSizeEditor.prototype, { init: noop, setValue: noop, focus: noop, getValue: noop, close: noop });

        RusSizeEditor.prototype.open = function() {
            var self = this;
            var htSheet = self.instance;

            var row = ensure.object(htSheet.getSourceDataAtRow(self.row));
            var brand = _.get(row, [SpecialFieldIds.BRAND, 'Value']);
            var gender = _.get(row, [SpecialFieldIds.GENDER, 'Value']);
            var age = _.get(row, [SpecialFieldIds.AGE, 'Value']);
            var subject = _.get(row, [SpecialFieldIds.SUBJECT, 'Value']);

            if (![brand, gender, age, subject].every(isNonEmptyString)) {
                toastr.error('Пожалуйста, заполните поля "бренд", "пол", "возраст" и "предмет"');
                return;
            }

            htSheet.updateSettings({ readOnly: true, disableVisualSelection: true });
            var origVal = htSheet.getDataAtCell(self.row, self.col);
            var $selectContainer = $('<div>', { class: 'popup-content__field', attr: { 'js-select-container': '' } });
            var $popup = $('<div>', { class: 'popup-content', html: $selectContainer });

            popup('Выберите российский размер', $popup, {
                open: function() {
                    block();

                    getRusSizeDictionaryAsync(brand, gender, age, subject)
                        .always(unblock)

                        .then(function(args) {
                            var data = args.data;
                            var metadata = args.metadata;

                            var selectFields = [ { name: 'size_name', title: 'Размер', width: 'wide' } ];

                            metadata.forEach(function(meta) {
                                selectFields.push({ name: meta.id, title: meta.name, width: 'wide' });
                            });

                            var slzSelect = renderSelect(data, $selectContainer, null, 'size_name', 'size_name', null, true, selectFields, 'row', 'col');

                            var val = htSheet.getDataAtCell(self.row, self.col);

                            if (!isNonEmptyString(val)) {
                                var techSize = _.get(row, [SpecialFieldIds.TECH_SIZE, 'Value']);

                                if (isNonEmptyString(techSize))
                                    slzSelect.setValue(techSize); // TODO: Filter by this value
                                else
                                    toastr.warning('Не удалось подставить технический размер автоматически');

                                slzSelect.open();
                                $popup.data('ready', true);
                                return;
                            }

                            var item = _.find(slzSelect.options, function(item) { return isSameStringI(item.size_name, val) });

                            if (!_.isObject(item)) {
                                slzSelect.open();
                                $popup.data('ready', true);
                                return;
                            }

                            slzSelect.setValue(item.size_name);
                            slzSelect.open();
                            $popup.data('ready', true);
                        })

                        .catch(handleRejection('Извините, произошла ошибка при получении словарей'));
                },

                ok: function() {
                    if (!$popup.data('ready'))
                        return;

                    var slzSelect = ensure.object($selectContainer.data('slzSelect'));
                    htSheet.setDataAtCell(self.row, self.col, slzSelect.getValue());
                    $popup.data('dontReset', true);
                    $popup.dialog('close');
                },

                close: function() {
                    htSheet.updateSettings({ readOnly: false, disableVisualSelection: false });
                    htSheet.selectCell(self.row, self.col);

                    if (!$popup.data('dontReset'))
                        htSheet.setDataAtCell(self.row, self.col, origVal);
                },
            });
        };

        Handsontable.cellTypes.registerCellType('custom.rus-size', {
            editor: RusSizeEditor,
            renderer: baseRenderer,
        });
    }());

    (function registerCustomMultiKeyValueType() {
        var MultiKeyValueEditor = Handsontable.editors.BaseEditor.prototype.extend();
        $.extend(MultiKeyValueEditor.prototype, { init: noop, setValue: noop, focus: noop, getValue: noop, close: noop });

        MultiKeyValueEditor.prototype.open = function() {
            var self = this;
            var htSheet = self.instance;
            htSheet.updateSettings({ readOnly: true, disableVisualSelection: true });
            var origVal = htSheet.getDataAtCell(self.row, self.col);
            var $popup = $(ensure.jqElement($('[js-multi-key-value-popup-tpl]')).html());

            popup('Выберите ключи и значения', $popup, {
                open: function() {
                    var val = htSheet.getDataAtCell(self.row, self.col);
                    var pairs = parseKeyValuePairsOrNull(val, ';', '%');
                    var field = self.cellProperties;
                    var $kvItemsContainer = ensure.jqElement($popup.find('[js-kv-items-container]'));

                    if (isNonEmptyArray(pairs)) {
                        pairs.forEach(function(pair) {
                            block();

                            addKeyValuePairAsync(pair, field, $kvItemsContainer, htSheet)
                                .always(unblock)
                                .catch(console.error);
                        });
                    } else {
                        block();

                        addKeyValuePairAsync(null, field, $kvItemsContainer, htSheet)
                            .always(unblock)
                            .catch(console.error);
                    }


                    var $addKvItemBtn = ensure.jqElement($popup.find('[js-add-btn]'));

                    $addKvItemBtn.on('click', function() {
                        // No need for UI blocking with a spinner here if the following async function is memoized:
                        addKeyValuePairAsync(null, field, $kvItemsContainer, htSheet).catch(console.error);
                    });


                    $kvItemsContainer.on('click', '[js-remove-btn]', function() {
                        var $kvItem = ensure.jqElement($(this).closest('[js-kv-item]'));
                        removeKeyValuePair($kvItem);
                    });
                },

                ok: function() {
                    var $kvItemsContainer = ensure.jqElement($popup.find('[js-kv-items-container]'));
                    var pairs = obtainKeyValuePairs($kvItemsContainer);

                    if (!keyValuePairsValid(pairs)) {
                        toastr.error('Количество должно быть заполнено либо везде, либо нигде. Возможны только числа');
                        return;
                    }

                    var val = serializeKeyValuePairs(pairs);
                    htSheet.setDataAtCell(self.row, self.col, val);
                    $popup.data('dontReset', true);
                    $popup.dialog('close');
                },

                close: function() {
                    htSheet.updateSettings({ readOnly: false, disableVisualSelection: false });
                    htSheet.selectCell(self.row, self.col);

                    if (!$popup.data('dontReset'))
                        htSheet.setDataAtCell(self.row, self.col, origVal);
                }
            });
        };

        Handsontable.cellTypes.registerCellType('custom.multi-key-value', {
            editor: MultiKeyValueEditor,
            renderer: baseRenderer,
        });


        function addKeyValuePairAsync(pair, field, $kvItemsContainer, htSheet) {
            return $.when().then(function() {
                ensure(_.isObject(field), 'Object expected');
                ensure(isJqElement($kvItemsContainer), 'jQuery element expected');

                var $kvItem = ensure.jqElement($($('[js-multi-key-value-popup-item-tpl]').first().html()));
                $kvItem.hide();
                $kvItemsContainer.append($kvItem);
                $kvItem.fadeIn();

                var $keyContainer = $kvItem.find('[js-key-container]').first();

                if (_.isObject(pair)) {
                    var $value = $kvItem.find('[js-value]').first();
                    $value.val(pair.value);

                    return renderKeyAsync(field, $keyContainer, htSheet)
                        .then(function() {
                            var slzKey = $keyContainer.data('slzSelect');
                            var item = _.find(slzKey.options, function(item) { return isSameStringI(item.value, pair.key) });

                            if (!_.isObject(item))
                                return;

                            slzKey.setValue(item.value);
                        })

                        .catch(console.error);
                } else {
                    return renderKeyAsync(field, $keyContainer, htSheet).catch(console.error);
                }
            });
        }

        function removeKeyValuePair($kvItem) {
            ensure(isJqElement($kvItem), 'jQuery element expected');
            $kvItem.fadeOut(function() { $kvItem.remove() });
        }

        function renderKeyAsync(field, $keyContainer, htSheet) {
            return $.when().then(function() {
                ensure(_.isObject(field), 'Object expected');
                ensure(isJqElement($keyContainer), 'jQuery element expected');

                return getDictionaryAsync(field.Id)
                    .then(function(dictItems) {
                        var selectItems = dictItems
                            .map(function(s) {
                                if (typeof s !== 'string') return null;
                                s = s.trim();
                                if (s === '') return null;
                                return s;
                            })

                            .filter(function(val) { return val != null })
                            .map(function(s) { return { value: s, text: s } });

                        renderSelect(selectItems, $keyContainer);

                        var val = htSheet.getDataAtCell(self.row, self.col);

                        if (typeof val !== 'string')
                            return;

                        var slzKey = $keyContainer.data('slzSelect');
                        slzKey.setValue(val.trim());
                    })

                    .catch(handleRejection('Извините, произошла ошибка при получении словарей'));
            });
        }

        function parseKeyValuePairsOrNull(val, itemSep, kvSep) {
            if (val == null || typeof val !== 'string')
                return null;

            ensure(typeof itemSep === 'string' && typeof kvSep === 'string', 'String expected');

            return _(val)
                .split(itemSep)

                .map(function(pairStr) {
                    pairStr = pairStr.trim();

                    if (~pairStr.indexOf(kvSep)) {
                        var pairArr = util.splitOnFirst(pairStr, kvSep);
                        var value = pairArr[0].trim();
                        var key = pairArr[1].trim();

                        if (key === '')
                            return null;

                        if (value === '')
                            return { key: key };

                        return { key: key, value: value };
                    } else {
                        var key = pairStr.trim();

                        if (key === '')
                            return null;

                        return { key: key };
                    }
                })

                .compact().v;
        }

        function obtainKeyValuePairs($kvItemsContainer) {
            ensure(isJqElement($kvItemsContainer), 'jQuery element expected');
            var $kvItems = $kvItemsContainer.find('[js-kv-item]');

            return _($kvItems)
                .map(function(kvItem) {
                    var $kvItem = $(kvItem);
                    var slzKey = $kvItem.find('[js-key-container]').first().data('slzSelect');
                    var $value = $kvItem.find('[js-value]').first();
                    var key = slzKey.getValue();
                    var value = $value.val();

                    if (typeof key !== 'string' || key.trim() === '')
                        return null;

                    if (typeof value !== 'string' || value.trim() === '')
                        value = null;

                    return { key: key, value: value };
                })

                .compact().v;
        }

        function keyValuePairsValid(pairs) {
            ensure(Array.isArray(pairs), 'Array expected');

            var allValuesPresent = pairs.every(function(p) { return util.isNumeric(p.value) });
            var allValuesAbsent = pairs.every(function(p) { return p.value == null });

            return allValuesPresent || allValuesAbsent;
        }

        function serializeKeyValuePairs(pairs) {
            ensure(Array.isArray(pairs), 'Array expected');

            return pairs
                .map(function(p) {
                    if (typeof p.value === 'string' && p.value.trim() !== '')
                        return p.value + '% ' + p.key;
                    else
                        return p.key;
                })

                .join('; ');
        }
    }());


    /** Заглушечная функция, которая ничего не делает */
    function noop() { };
}());
