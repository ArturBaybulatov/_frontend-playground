(function() {
    'use strict';

    var call = Function.prototype.call.bind(Function.prototype.call);
    var toString = call.bind(Object.prototype.toString);

    if (!('isArray' in Array))
        Array.isArray = function(val) {return toString(val) === '[object Array]'};

    if (!('isNaN' in Number))
        Number.isNaN = function(val) {return val !== val};
}());
