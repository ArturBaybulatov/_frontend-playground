(function() {
    'use strict';


    getDataAsync()
        .catch(function(err) {
            window.alert("Couldn't get data"); // Friendly report for an end user
            console.error(err); // Technical report for a developer
            throw err; // Rethrow to reject (prevent further execution of) a promise chain
        })

        .then(function(data) {
            validateData(data);
            return data;
        })

        .catch(function(err) {
            window.alert('Data invalid');
            console.error(err);
            throw err;
        })

        .then(function(data) {
            data.foo = 'Baz';
            saveData(data);
        })

        .catch(function(err) {
            window.alert("Couldn't save data");
            console.error(err);
            throw err;
        })

        .then(function() {
            window.alert('Successfully done');
        })


    function getDataAsync() {
        return Promise.resolve().then(function() {
            console.log('Getting data...');

            return {foo: 'Bar'}; // Valid data
            //return 'Hello'; // Invalid data
            //throw new Error('403 Forbidden');
        });
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
