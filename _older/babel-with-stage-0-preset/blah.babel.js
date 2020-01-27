const _ = require('lodash')
const moment = require('moment')

const arr = 'abcdefghijk'.split('')

const upper = ::String.prototype.toUpperCase.call
console.log(arr.map(x => upper(x)))

const upper2 = String.prototype.toUpperCase
console.log(arr.map(x => x::upper2()))
