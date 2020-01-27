(function() {
    'use strict';

    var data = _.times(10, function() {
        var quantity = randomNumber();

        return {
            name: 'Foo-' + randomNumber(),
            quantity: quantity,
            quantityStr: String(quantity),
            c: moment(randomDate()).format('DD.MM.YYYY'),
        };
    });

    var columns = [
        {title: 'Name', data: 'name', name: 'name', _editable: true},
        {title: 'Quantity', data: 'quantity', name: 'quantity', type: 'num', _editable: true},
        {title: 'Quantity', data: 'quantity', name: 'quantity', type: 'num', _editable: true},

        {title: 'Created', data: 'created', name: 'created', type: 'date', render: {
            _: function(dateStr) {return moment(dateStr, 'DD.MM.YYYY', true).toDate()},
            display: formatData,
        }},

        {title: 'Expires', data: 'expires', name: 'expires', type: 'date', _editable: true, render: {
            _: function(dateStr) {return moment(dateStr, 'DD.MM.YYYY', true).toDate()},
            display: formatData,
        }},
    ];

    var $table = $('[js-table]').first();
    var $addBtn = $('[js-add-btn]').first();
    var $clearBtn = $('[js-clear-btn]').first();


    var datatable = $table.DataTable({
        data: data,
        paging: false,
        searching: false,
        info: false,
        columns: columns,
        columnDefs: [{render: {display: formatData}, targets: '_all'}],
    });

    datatable.on('change', 'tbody input', function() {
        var $input = $(this);
        var $cell = $input.closest('td');
        var colMeta = columns[datatable.column($cell).index()];
        var cell = datatable.cell($cell);

        if (colMeta.type === 'date') {
            if ($input.val().trim() === '') {
                cell.data(null).draw();
                return;
            }

            var newDate = moment($input.val(), 'DD.MM.YYYY', true).toDate();

            if (!dateValid(newDate)) {
                cell.data(null).draw();
                return;
            }
        }

        cell.data($input.val()).draw();
    });

    $addBtn.on('click', function() {datatable.rows.add({}).draw()});
    $clearBtn.on('click', function() {datatable.clear().draw()});


    function parseData(str) {

    }

    function formatData(val, __, ___, meta) {
        var colMeta = uploadFileListColumns[meta.col];

        if (val == null)
            return '<input type="text">';

        if (colMeta.type === 'date') {
            var dateStr = moment(val, 'DD.MM.YYYY', true).format('DD.MM.YYYY');
            return '<input type="text" value="' + dateStr + '">';
        }

        return '<input type="text" value="' + val + '">';
    }

    function formatDate(date) {
        return moment(date).format('DD.MM.YYYY');
    }

    function stringifyDate(date) {
        return date.toISOString(); // TODO: Is this ok?
    }

    function randomNumber() {
        return _.sample([_.random(1, 9), _.random(10, 99), _.random(100, 999)]);
    }

    function randomDate() {
        return new Date(_.random(1990, 2017), _.random(11), _.random(1, 28));
    }

    function isNumeric(str) {
        return !isNan(Number(str));
    }

    function dateValid(date) {
        return !isNan(date.getTime());
    }

    function isNan(val) {
        return typeof val === 'number' && val !== val;
    }
}());
