(function() {
    'use strict';

    var ensure = util.ensure;
    var isNonEmptyString = util.isNonEmptyString;
    var isNonEmptyArray = util.isNonEmptyArray;
    var log = function(val) { console.log(val, null) }; // Debug

    var openPopup = function(onOpen, onClose) {
        ensure(typeof onOpen === 'function', 'Function expected');
        ensure(typeof onClose === 'function' || onClose == null, 'Function or null-like expected');

        var mfpPopup = $.magnificPopup.instance;
        var $popup = $('<div>', { class: 'popup' });

        mfpPopup.open({
            items: { src: $popup },
            showCloseBtn: false,

            callbacks: {
                open: onOpen.bind(null, $popup, mfpPopup),
                close: typeof onClose === 'function' ? onClose.bind(null, $popup, mfpPopup) : null,
            },
        });
    };

    var closePopup = function() {
        var mfpPopup = $.magnificPopup.instance;
        mfpPopup.close();
    };

    var renderSelect = function(items, $container, multiple, valueField, labelField) {
        ensure(Array.isArray(items), 'Array expected');
        ensure($container instanceof $, 'jQuery element expected');
        ensure(typeof multiple === 'boolean' || multiple == null, 'Boolean or null-like expected');
        ensure(isNonEmptyString(valueField) || valueField == null, 'Non-empty string or null-like expected');
        ensure(isNonEmptyString(labelField) || labelField == null, 'Non-empty string or null-like expected');

        valueField == null && (valueField = 'id');
        labelField == null && (labelField = 'name');

        var $select = $('<select>', { attr: { multiple: multiple } });
        $container.html($select);

        $container.data('$select', $select);

        return $select.html(items.map(function(item) {
            return $('<option>', { val: item[valueField], text: item[labelField] });
        }));
    };

    var holidays = [
        { id: 1, name: 'Thanksgiving' },
        { id: 2, name: 'New year' },
        { id: 3, name: 'Independence day' },
        { id: 4, name: 'Veterans day' },
        { id: 5, name: 'Halloween' },
    ];

    var items = _.times(10, function(i) {
        return {
            id: i + 1,

            name: {
                first: _('JohnJackPhilMikePeteJaneBobAliceKateChrisDan').startCase().split(' ').sample().v,
                middle: util.lorem(1, 1),
                last: util.lorem(1, 1),
            },

            salary: util.visuallyRandomNumber() * 1000,
            holidayId: _.sample(holidays).id,
        };
    });

    var itemFields = [
        { data: 'id', title: 'ID' },
        { data: 'name.first', title: 'First name' },
        { data: 'name.last', title: 'Last name' },
        { data: 'salary', title: 'Salary' },
        { data: 'holidayId', title: 'Holiday', type: 'custom.select' },

        //{
        //    data: function(item) { return utilInspect(item) },
        //    title: 'Special',
        //    className: 'ht_master__cell ht_master__cell--pre',
        //},
    ];

    (function registerCustomSelectType() {
        var CustomSelect = Handsontable.editors.BaseEditor.prototype.extend();
        var noop = function() { };
        $.extend(CustomSelect.prototype, { init: noop, setValue: noop, focus: noop, getValue: noop, close: noop });

        CustomSelect.prototype.open = function() {
            var self = this;
            var htSheet = self.instance;

            // Stop reacting to any input when popup is open:
            htSheet.updateSettings({ readOnly: true, disableVisualSelection: true });

            var $selectContainer = $('<div>');

            openPopup(
                function($popup) {
                    var $select = renderSelect(holidays, $selectContainer);
                    $popup.html($select);
                    var val = htSheet.getDataAtCell(self.row, self.col);
                    $select.val(val);
                },

                function() {
                    var $select = $selectContainer.data('$select');
                    var val = $select.val();
                    htSheet.setDataAtCell(self.row, self.col, val);
                    htSheet.updateSettings({ readOnly: false, disableVisualSelection: false });
                    htSheet.selectCell(self.row, self.col);
                }
            );
        };

        var customSelectRenderer = function(htSheet, cell, rowIndex, colIndex) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);

            var item = htSheet.getSourceDataAtRow(rowIndex, colIndex);

            if (item.salary > 50000) {
                var $cell = $(cell);
                $cell.css({ backgroundColor: '#ffefd0' });
            }
        };

        Handsontable.cellTypes.registerCellType('custom.select', { editor: CustomSelect, renderer: customSelectRenderer });
    }());

    (function init() {
        var $sheet = $('[js-sheet]').first();

        new Handsontable($sheet.get(0), {
            data: items,
            columns: itemFields,
            height: 600,
            manualColumnResize: true,
            modifyColWidth: function(width) { var max = 500; if (width > max) return max },
        });
    }());
}());
