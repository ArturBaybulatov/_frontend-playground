(function() {
    'use strict';


    try {
        var data = getData();
    } catch (err) {
        window.alert("Couldn't get data"); // Friendly report for an end user
        throw err; // Technical report for a developer; Rethrow to prevent further execution
    }

    try {
        validateData(data);
    } catch (err) {
        window.alert('Data invalid');
        throw err;
    }

    data.foo = 'Baz';

    try {
        saveData(data);
    } catch (err) {
        window.alert("Couldn't save data");
        throw err;
    }

    window.alert('Successfully done');


    function getData() {
        console.log('Getting data...');

        return {foo: 'Bar'}; // Valid data
        //return 'Hello'; // Invalid data
        //throw new Error('403 Forbidden');
    }

    function validateData(data) {
        console.log('Validating data...');

        if (data == null || typeof data !== 'object')
            throw new Error('Object expected');
    }

    function saveData(data) {
        console.log('Saving data...');

        throw new Error('500 Internal server error');
    }
}());
