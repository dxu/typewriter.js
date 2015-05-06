one = require('./one.js')

module.exports = two = function() {
  console.log('two');
}

one()
two()
