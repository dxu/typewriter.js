var compileLess = require('broccoli-less-single')
  , babelTranspiler = require('broccoli-babel-transpiler')
  , browserify = require('broccoli-fast-browserify')
  , mergeTrees = require('broccoli-merge-trees')
  , funnel = require('broccoli-funnel')
  , lessDir = 'styles'
  , scriptsDir = 'scripts'
  , templatesDir = 'templates'

less = compileLess([funnel(lessDir)], 'styles.less', 'styles.css')
babelScripts = babelTranspiler(funnel(scriptsDir), {sourceMap: 'inline'})
browserifyScripts = browserify(babelScripts, {
  bundles: {
    'scripts.js': {
      entryPoints: ['scripts.js']
    }
  }
})
templates = funnel('templates', {
  destDir: 'templates'
})



module.exports = mergeTrees([less, browserifyScripts, templates])
