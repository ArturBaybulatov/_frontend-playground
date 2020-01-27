(function() {
    'use strict';


    getDataAsync()
        .then(function(data) {
            return validateDataAsync(data)
                .then(function() {
                    data.foo = 'Baz';

                    return saveDataAsync(data)
                        .then(function() {
                            window.alert('Successfully done');
                        })

                        .catch(function(err) {
                            window.alert("Couldn't save data");
                            console.error(err);
                            //throw err;
                        });
                })

                .catch(function(err) {
                    window.alert('Data invalid');
                    console.error(err);
                    //throw err; // Rethrow to reject (prevent further execution of) a promise chain
                });
        })

        .catch(function(err) {
            window.alert("Couldn't get data"); // Friendly report for an end user
            console.error(err); // Technical report for a developer
        });


    function getDataAsync() {
        return Promise.resolve().then(function() {
            console.log('Getting data...');

            return {foo: 'Bar'}; // Valid data
            //return 'Hello'; // Invalid data
            //throw new Error('403 Forbidden');
        });
    }

    function validateDataAsync(data) {
        return Promise.resolve().then(function() {
            console.log('Validating data...');

            if (data == null || typeof data !== 'object')
                throw new Error('Object expected');
        });
    }

    function saveDataAsync(data) {
        return Promise.resolve().then(function() {
            console.log('Saving data...');

            throw new Error('500 Internal server error');
        });
    }
}());
