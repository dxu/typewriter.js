var compileLess = require('broccoli-less-single')
  , babelTranspiler = require('broccoli-babel-transpiler')
  , browserify = require('broccoli-fast-browserify')
  , mergeTrees = require('broccoli-merge-trees')
  , funnel = require('broccoli-funnel')
  , lessDir = 'styles'
  , scriptsDir = 'scripts'
  , templatesDir = 'templates'

// compile all less into styles.css
less = compileLess([funnel(lessDir)], 'styles.less', 'styles.css')

// run all scripts through babel
babelScripts = babelTranspiler(funnel(scriptsDir), {sourceMap: 'inline'})

// run babelified scripts into browserify
browserifyScripts = browserify(babelScripts, {
  bundles: {
    'scripts.js': {
      entryPoints: ['scripts.js']
    }
  }
})

// copy all templates into dist under /templates
templates = funnel('templates', {
  destDir: 'templates'
})

module.exports = mergeTrees([less, browserifyScripts, templates])
