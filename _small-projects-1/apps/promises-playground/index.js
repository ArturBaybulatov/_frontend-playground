import './index.html';

const { ensure, handleRejection } = util;

const API_BASE_URL = 'http://localhost:8666';

const log = function(val) { console.log(val); return val }; // Debug


const init = function() {
    getDataAsync()
        .catch(handleRejection( "Couldn't get data"))

        .then(function(data) {
            const $data = $('<div>', { text: JSON.stringify(data, null, 4), css: { whiteSpace: 'pre' } });
            toastr.success($data, 'Data successfully fetched');
        })

        .catch(console.error);
};


const getDataAsync = function() {
    return $.get(`${API_BASE_URL}/`)
    //return $.get(`${API_BASE_URL}/fail`) // Should fail
        .catch(util.responseToError)
        .then(data => ensure.plainObject(data));
};


init();
