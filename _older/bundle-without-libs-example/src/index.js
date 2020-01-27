var _ = require('lodash')
var moment = require('moment')

// Configure Lodash:
_.mixin(_, {chain: true}); Object.defineProperty(_.prototype, 'v', {get: _.prototype.value})


var arr = 'abcdefghijk'.split('')

console.log(_(arr).map(_.upperCase).sampleSize(5).v)
console.log(moment().format('YYYY-MM-DD'))
