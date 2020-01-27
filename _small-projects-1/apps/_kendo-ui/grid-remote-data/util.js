(function() {
    'use strict';

    function setIfNone(obj, path, val) {
        if (_.get(obj, path) == null)
            _.set(obj, path, val);
    }

    function humanFileSize(size) {
        var i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
        return Number((size / Math.pow(1024, i)).toFixed(2)) + ' ' + ['B','kB','MB','GB','TB'][i];
    }

    function formatDate(date) {
        return [pad(date.getDate()), pad(date.getMonth() + 1), date.getFullYear()].join('.');
    }

    function pad(n) {
        return n < 10 ? "0" + n : n;
    }


    window.util = {
        setIfNone: setIfNone,
        humanFileSize: humanFileSize,
        formatDate: formatDate,
        pad: pad,
    };
}());
