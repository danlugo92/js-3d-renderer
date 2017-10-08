(function (root, factory) { 'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.returnExports = factory();
  }
}(this, function () { 'use strict';

  function Js3dRenderer (entities) {
    const glm = require('gl-matrix')
    const {Color} = require('app/primitive/Color')
    const cube = require('app/data/cube')
    const {io_render} = require('app/render/io_render')
    const {Model} = require('app/primitive/Model')

    const {rasterizer} = require('app/renderer/rasterizer')
    const {verticesOnly} = require('app/renderer/verticesOnly')
    const {Animator} = require('app/Animator');

    let defaults = Object.create(null)
    /*
      The position of the camera. You can change this using the slider in the UI.
      Initially, the world origin (0, 0, 0) is in the center of the screen but the
      position of the camera changes this.

      In a real app you'd also give the camera a direction (either using a "look at"
      vector or using rotation angles) but in this app you're always looking along
      the positive z axis.
      Note that we don't do any clipping in the z direction, so make sure cameraZ
      is far away enough from the vertices (or the app may act weird / crash).
    */
    defaults.camPos = glm.vec4.fromValues(11, 20, -10, 1)


    /* The following options control the lighting of the scene. The calculations to
       apply the light happen in the "fragment shader". */
    defaults.ambientLight = Color(1,1,1,0.2)

    defaults.diffuseLight = Object.create(null)

    defaults.diffuseLight.color = Color(1,1,1,0.8)
    defaults.diffuseLight.direction = glm.vec4.fromValues(0,0,1,0)
  // FIXME: setInterval callback before render object loaded
    setInterval(function () {
      if (running) {
        animator1.animate(clone)
        animator2.animate(clone2)
        let start = Date.now()


        io_render(
          [clone, clone2], defaults.camPos, canvas,
          rasterizer, defaults.diffuseLight, defaults.ambientLight, df
        )
        let end = Date.now()

        let elapsed = (end - start) / 1000
        console.log(`${elapsed} seconds`)
      }
    }, 100)

  } // constructor

  Js3dRenderer.prototype.toggle = function () {
    this.running = !this.running;
  };

  return {Js3dRenderer};
}));
