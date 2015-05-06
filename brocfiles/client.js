var compileLess = require('broccoli-less-single')
  , babelTranspiler = require('broccoli-babel-transpiler')
  , browserify = require('broccoli-fast-browserify')
  , mergeTrees = require('broccoli-merge-trees')
  , funnel = require('broccoli-funnel')
  , clientLessDir = 'client/styles'
  , clientScriptsDir = 'client/scripts'
  , clientTemplatesDir = 'client/templates'

// compile all less into styles.css
less = compileLess([funnel(clientLessDir)], 'styles.less', 'styles.css')

// run all scripts through babel
babelScripts = babelTranspiler(funnel(clientScriptsDir), {sourceMap: 'inline'})

// run babelified scripts into browserify
browserifyScripts = browserify(babelScripts, {
  bundles: {
    'scripts.js': {
      entryPoints: ['scripts.js']
    }
  }
})

// copy all templates into dist under /templates
templates = funnel(clientTemplatesDir, {
  destDir: 'templates'
})

module.exports = mergeTrees([less, browserifyScripts, templates])
