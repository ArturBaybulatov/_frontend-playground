(function() {
    'use strict';

    var call = Function.prototype.call.bind(Function.prototype.call);
    var slice = call.bind(Array.prototype.slice);
    var toString = call.bind(Object.prototype.toString);

    if (!('isNaN' in Number))
        Number.isNaN = function(val) {return val !== val};

    if (!('isArray' in Array))
        Array.isArray = function(val) {return toString(val) === '[object Array]'};
}());
