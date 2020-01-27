(function() {
    'use strict';

    $.fn.dataTable.ext.type.order['natural-asc'] = compareNatural;
    $.fn.dataTable.ext.type.order['natural-desc'] = function(a, b) {return compareNatural(a, b) * -1};

    var data = _.times(10000, function() {
        return {
            alphanumString: 'Foo-' + randomNumber(),
            alphanumStringNatural: 'Foo-' + randomNumber(),
            date: randomDate(),
            string: moment(randomDate()).format('M/D/YYYY'),
            stringToDateAuto: moment(randomDate()).format('M/D/YYYY'),
            stringToDateManual: moment(randomDate()).format('DD.MM.YYYY'),
        };
    });

    var $table = $('[js-table]').first();

    var datatable = $table.DataTable({
        data: data, // You can add data later with: `datatable.rows.add(data).draw();`
        order: [[2, 'desc']],
        //pageLength: 25,
        deferRender: true, // For huge data sets
        //autoWidth: false, // Increase UI responsiveness
        scrollX: true,
        scrollY: 'calc(100vh - 150px)', // For "scroller" extension
        scroller: true,

        columns: [
            {title: 'Alphanum string', data: 'alphanumString'},
            {title: 'Alphanum string, natural', data: 'alphanumStringNatural', type: 'natural'},

            {title: 'Date', data: 'date', type: 'date', render: {
                display: function(date, __, item) {
                    //console.log(item.alphanumString); // Debug
                    return moment(date).format('MMMM Do YYYY');
                },
            }},

            {title: 'String', data: 'string', type: 'string'},

            {title: 'String to date, auto', data: 'stringToDateAuto', type: 'date', render: {
                display: function(str) {return moment(str, 'M/D/YYYY').format('MMMM Do YYYY')},
            }},

            {title: 'String to date, manual', data: 'stringToDateManual', type: 'date', render: {
                _: function(str) {return moment(str, 'DD.MM.YYYY').toDate()},
                display: function(str) {return moment(str, 'DD.MM.YYYY').format('MMMM Do YYYY')},
            }},
        ],

        //columnDefs: [
        //    {
        //        visible: true,
        //        targets: [0, 2],
        //    }, {
        //        visible: false,
        //        targets: '_all',
        //    },
        //],

        //columnDefs: [{
        //    render: {
        //        display: function(data) {
        //            data == null && (data = '');
        //            return '<div class="f">' + data + '</div>';
        //        },
        //    },
        //
        //    targets: '_all',
        //}],
    });

    datatable.on('click', 'tbody tr', function() {
        setTimeout(function() {
            window.alert(JSON.stringify(datatable.row(this).data(), null, 4));
        }.bind(this), 100);
    });


    function randomNumber() {
        return _.sample([_.random(1, 9), _.random(10, 99), _.random(100, 999)]);
    }

    function randomDate() {
        return new Date(_.random(1990, 2017), _.random(11), _.random(1, 28));
    }

    function compareNatural(a, b) {
        // http://www.davekoelle.com/alphanum.html

        function chunkify(t) {
            var tz = new Array();
            var x = 0, y = -1, n = 0, i, j;

            while (i = (j = t.charAt(x++)).charCodeAt(0)) {
                var m = (i == 46 || (i >=48 && i <= 57));

                if (m !== n) {
                    tz[++y] = "";
                    n = m;
                }

                tz[y] += j;
            }

            return tz;
        }

        var aa = chunkify(a.toLowerCase());
        var bb = chunkify(b.toLowerCase());

        for (var x = 0; aa[x] && bb[x]; x++) {
            if (aa[x] !== bb[x]) {
                var c = Number(aa[x]), d = Number(bb[x]);

                if (c == aa[x] && d == bb[x])
                    return c - d;
                else
                    return (aa[x] > bb[x]) ? 1 : -1;
            }
        }

        return aa.length - bb.length;
    }
}());
