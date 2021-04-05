
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./honeyswap-sdk.cjs.production.min.js')
} else {
  module.exports = require('./honeyswap-sdk.cjs.development.js')
}
