'use strict';
var path = require('path');

module.exports = {
  name: 'torii',
  treeFor: function treeFor(name) {
    this.replace = this.replace || require('broccoli-string-replace');

    if (name === 'vendor') {
      var tree = this.treeGenerator(path.join('node_modules', 'torii', 'dist', 'addon', name));

      // Use a build-time check to output a warning if Torii is not
      // conigured.
      var config = this.project.config(this.app.env);
      if (!config.torii) {
        console.warn("Torii is installed but not configured in config/environment.js!");
      } else {
        // Use run-time lookup of the ENV via require. This is better than
        // build-time configuration since this code will not be run again if
        // config/environment changes.
        tree = this.replace(tree, {
          files: ['torii/torii.amd.js'],
          patterns: [{
            match: /get\(window, 'ENV\.torii'\)/,
            replacement: 'require("'+this.app.name+'/config/environment")["default"].torii'
          }]
        });
      }
      return tree;
    }

    if (name === 'app') {
      return this.treeGenerator(path.join('node_modules', 'torii', 'dist', 'addon', name));
    }

  },
  included: function included(app) {
    app.import('vendor/torii/torii.amd.js', {
      exports: {
        'torii/torii': ['default'],

        // These are all exports that the torii initializers must import
        'torii/session': ['default'],
        'torii/bootstrap/session': ['default'],
        'torii/bootstrap/torii': ['default'],
        'torii/configuration': ['default'],
        'torii/redirect-handler': ['default']
      }
    });
  }
};
