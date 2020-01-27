var _context;

const _ = require('lodash');
const moment = require('moment');

const arr = 'abcdefghijk'.split('');

const upper = (_context = String.prototype.toUpperCase).call.bind(_context);
console.log(arr.map(x => upper(x)));

const upper2 = String.prototype.toUpperCase;
console.log(arr.map(x => upper2.call(x)));
