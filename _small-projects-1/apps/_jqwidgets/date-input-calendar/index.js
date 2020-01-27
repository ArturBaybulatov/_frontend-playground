(function() {
    'use strict';

    var today = new Date();
    var $getValBtn = $('[js-get-val-btn]').first();
    var $setRndValBtn = $('[js-set-rnd-val-btn]').first();

    //var restrictedDates = _.times(3000, randomDate);


    // Calendar ------------------------------------------------

    var $calendar = $('[js-calendar]').first();

    $calendar.jqxCalendar({
        width: '250px',
        height: '250px',
        showFooter: true, // "Today" button
        culture: 'ru-RU',
        selectionMode: 'range',
        min: new Date(1970, 0, 1),
        max: new Date(2017, 11, 31),
        //restrictedDates: restrictedDates,
    });

    $calendar.jqxCalendar('addSpecialDate', addDays(today, -5), null, 'Lorem ipsum');
    $calendar.jqxCalendar('addSpecialDate', addDays(today, -3));
    $calendar.jqxCalendar('addSpecialDate', addDays(today, 2), null, 'Dolor sit amet');
    $calendar.jqxCalendar('addSpecialDate', addDays(today, 32));


    // Date input ------------------------------------------------

    var $dateInput = $('[js-date-input]').first();

    $dateInput.jqxDateTimeInput({
        showFooter: true,
        culture: 'ru-RU',
        selectionMode: 'range',
        min: new Date(1970, 0, 1),
        max: new Date(2017, 11, 31),
        //restrictedDates: restrictedDates,
    });

    //window.setTimeout(function() {
    //    $dateInput.jqxDateTimeInput('selectionMode', 'range');
    //    $dateInput.jqxDateTimeInput('setRange', randomDate(), randomDate());
    //}, 2000);

    //--------------------------------------------------


    $getValBtn.on('click', function() {
        console.log('Calendar:');

        //console.log($calendar.jqxCalendar('getDate'));

        console.log({
            from: $calendar.jqxCalendar('getRange').from,
            to: $calendar.jqxCalendar('getRange').to,
        });


        console.log('Date input:');

        //console.log($dateInput.jqxDateTimeInput('getDate'));

        console.log({
            from: $dateInput.jqxDateTimeInput('getRange').from,
            to: $dateInput.jqxDateTimeInput('getRange').to,
        });
    });

    $setRndValBtn.on('click', function() {
        // Calendar - - - - - - -

        //$calendar.jqxCalendar('setDate', randomDate());
        $calendar.jqxCalendar('setRange', randomDate(), randomDate());


        // Date input - - - - - -

        //$dateInput.jqxDateTimeInput('setDate', randomDate());
        $dateInput.jqxDateTimeInput('setRange', randomDate(), randomDate());
    });


    function randomDate() {
        return new Date(_.random(1970, 2017), _.random(11), _.random(1, 28));
    }

    function addDays(date, days) {
        var timestamp = cloneDate(date).setDate(date.getDate() + days);
        return new Date(timestamp);
    }

    function cloneDate(date) {
        return new Date(date.getTime());
    }
}());
