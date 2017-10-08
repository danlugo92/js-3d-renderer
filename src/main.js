require.config({
  paths: {
    "gl-matrix" : "../node_modules/gl-matrix/dist/gl-matrix-min"
  },
  nodeRequire: require
})

require(['app/run'], function (run) { 'use strict'
  run();
});
