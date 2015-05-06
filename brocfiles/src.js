var compileLess = require('broccoli-less-single')
  , babelTranspiler = require('broccoli-babel-transpiler')
  , browserify = require('broccoli-fast-browserify')
  , mergeTrees = require('broccoli-merge-trees')
  , funnel = require('broccoli-funnel')
  , scriptsDir = 'src'

// run all scripts through babel
babelScripts = babelTranspiler(funnel(scriptsDir), {sourceMap: 'inline'})

module.exports = mergeTrees([babelScripts])
