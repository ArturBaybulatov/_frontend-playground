(function() {
    'use strict';


    if (!('isNaN' in Number))
        Number.isNaN = function(val) {return val !== val};
}());
