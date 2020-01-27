(function() {
    'use strict';

    var holidaysFields = [
        { name: 'id', title: 'ID', readOnly: true },
        { name: 'name', title: 'Name' },
    ];

    var holidays = [
        { id: 1, name: 'Thanksgiving' },
        { id: 2, name: 'New year' },
        { id: 3, name: 'Independence day' },
        { id: 4, name: 'Veterans day' },
        { id: 5, name: 'Halloween' },
    ];

    var peopleFields = [
        { name: 'id', title: 'ID', type: 'numeric', readOnly: true },
        { name: 'name', title: 'Name', type: 'text' },
        { name: 'age', title: 'Age', type: 'numeric' },

        { name: 'holidayId', title: 'Holiday', type: 'numeric', editor: buildSelectEditor(), renderer: selectRenderer },

        { name: 'holidayIds', title: 'Holidays', type: 'text', editor: buildMultiselectEditor(), renderer: multiselectRenderer },
        { name: 'holidayIds', title: 'Holidays', type: 'text', editor: buildSelectizeEditor(), renderer: multiselectRenderer },
    ];

    var people = [
        { id: 5, name: 'Ted Right', age: 25, holidayId: 1 },
        { id: 6, name: 'Frank Honest', age: 31, holidayId: 3, holidayIds: JSON.stringify([1, 3, 5]) },
        { id: 7, name: 'Joan Well', age: 18, holidayId: 2 },
        { id: 8, name: 'Gail Polite', age: 60, holidayId: 2, holidayIds: JSON.stringify([4]) },
        { id: 9, name: 'Michael Fair', age: 22, holidayId: 5 },
    ];

    var muchData = _.times(1000, function(i) {
        var item = { id: i };

        Object.assign(item, _(100).times(function(j) {
            //return ['field' + j, util.lorem(1, _.random(1, 3))];
            return ['field' + j, util.random(1, 5)];
        }).fromPairs().v);

        return item;
    });

    var $sheet = $('[js-sheet]').first();

    var htSheet = new Handsontable($sheet.get(0), {
        data: muchData,
        //columns: peopleFields.map(function(f) { return $.extend({ data: f.name }, _.pick(f, ['title', 'type', 'renderer', 'editor'])) }),
        editor: buildSelectEditor(),
        renderer: inspectRenderer,
        height: 500,
        minSpareRows: 1,
    });


    function buildSelectEditor() {
        var editor = Handsontable.editors.BaseEditor.prototype.extend();

        editor.prototype.init = function() {
            this.$select = $('<select>', { css: { position: 'absolute' }, class: 'cell-select' });
            var $options = holidays.map(function(h) { return $('<option>', { val: h.id, text: h.name }) });
            this.$select.html($options);
        };

        editor.prototype.open = function() { $(this.TD).html(this.$select) };
        editor.prototype.close = function() { };
        editor.prototype.focus = function() { this.$select.focus() };
        editor.prototype.getValue = function() { return util.fromNumeric(this.$select.val()); };
        editor.prototype.setValue = function(val) { this.$select.val(val) };

        return editor;
    }

    function selectRenderer(sheet, td, rowIdx, colIdx, fieldName, val) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        $(td).text(_(holidays).find({ id: val }).get('name').v);
    }


    function buildMultiselectEditor() {
        var editor = Handsontable.editors.BaseEditor.prototype.extend();

        editor.prototype.init = function() {
            this.$select = $('<select>', { attr: { multiple: true }, css: { position: 'absolute' } });
            var $options = holidays.map(function(h) { return $('<option>', { val: h.id, text: h.name }) });
            this.$select.html($options);
        };

        editor.prototype.open = function() { $(this.TD).html(this.$select) };
        editor.prototype.close = function() { };
        editor.prototype.focus = function() { this.$select.focus() };
        editor.prototype.getValue = function() { return JSON.stringify(_.map(this.$select.val(), util.fromNumeric)) };
        editor.prototype.setValue = function(val) { this.$select.val(util.tryParseJsonOrNull(val)) };

        return editor;
    }

    function buildSelectizeEditor() {
        var editor = Handsontable.editors.BaseEditor.prototype.extend();

        editor.prototype.init = function() {
            this.$select = $('<select>', { attr: { multiple: true } });
            var $options = holidays.map(function(h) { return $('<option>', { val: h.id, text: h.name }) });
            this.$select.html($options);
            this.selectize = this.$select.selectize({ valueField: 'id', labelField: 'name' }).get(0).selectize;
        };

        editor.prototype.open = function() {
            $(this.TD).css('overflow', 'visible');
            this.selectize.$wrapper.css('width', 400);
            $(this.TD).html(this.selectize.$wrapper);
        };

        editor.prototype.close = function() { };
        editor.prototype.focus = function() { this.selectize.focus() };
        editor.prototype.getValue = function() { return JSON.stringify(_.map(this.selectize.getValue(), util.fromNumeric)) };
        editor.prototype.setValue = function(val) { this.selectize.setValue(util.tryParseJsonOrNull(val)) };

        return editor;
    }

    function multiselectRenderer(sheet, td, rowIdx, colIdx, fieldName, val) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        val = util.tryParseJsonOrNull(val);

        if (val == null || val.length === 0) {
            $(td).text('--');
            return;
        }

        if (!Array.isArray(val)) {
            $(td).text('...');
            return;
        }

        $(td).text(val.length + ' items');
    }


    function inspectRenderer(sheet, td, rowIdx, colIdx, fieldName, val) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        $(td).text(utilInspect(val));
    }
}());
