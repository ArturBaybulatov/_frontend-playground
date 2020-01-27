(function() {
    'use strict';


    var util = window.util = {}; // Export to global scope


    function randomIdent(size) {
        if (size == null)
            size = 8;

        if (!isNumeric(size))
            return;

        size = Number(size);

        var alpha = 'abcdefghijklmnopqrstuvwxyz';
        var chars = alpha + alpha.toUpperCase() + '0123456789';

        if (size === 0)
            return '';

        if (size > 0)
            return _(alpha).sample().concat(_.sampleSize(chars, size - 1)).join('').v;
    }

    util.randomIdent = randomIdent;


    function isNumeric(val) {
        if (typeof val === 'number' && !Number.isNaN(val))
            return true;

        if (val == null)
            return false;

        if (typeof val !== 'string')
            return false;

        val = val.trim();

        if (val === '')
            return false;

        return !Number.isNaN(Number(val));
    }

    util.isNumeric = isNumeric;
}());
