// other comnflicting item
define(function(require) {
"use strict";


const Util = require('Util')
const {nonRestNonDefaultArgCheck: argChk} = Util
const {Model} = require('app/primitive/Model')


const {np_transformAndProject} = require('./internal/transformAndProject/np_transformAndProject')
const {io_clearRenderBuffer} = require('./internal/clearRenderBufferImgData')
const {io_setPixelFillRect} = require('./internal/io_setPixelFillRect')


/*
  The coordinate system we use looks like this:

    y  z
    | /
    |/
    +--- x

  So x is positive to the right, y is postive going up, and z is
  positive going into the screen. This is a so-called left-handed
  coordinate system. (To get a right-handed coordinate system,
  simply flip z to -z everywhere.)
*/




/*
  This is where the magic happens!
  render() is called on every animation frame. This function takes
   the model's
  vertex data, its state (modelX, modelRotateY, etc), and the
   position of the
  camera, and draws a 2D rendition of the 3D scene.
  In a real game this would ideally be called 60 times per
   second (or more).
*/

const io_drawer = function io_drawer (setPixelFn, canvas, draw) {
  argChk(io_drawer, arguments)
  const {coord, color, insideViewport} = draw
  Util.notNull(insideViewport)
  if (!insideViewport) return;
  Util.notNull(coord, color)
  const [x, y] = coord
  const [r,g,b,a] = color
  setPixelFn(x,y,r,g,b,a, canvas)
}

const io_render = function io_render (
  models, camPos, canvas, renderFn,
  diffuseLight, ambientLight, depthBuffer
) { argChk(io_render, arguments)

  const {width, height} = canvas
  const context = canvas.getContext("2d")

  Util.notNull(width, height, context)
  Util.notNull(context.fillRect, context.fillStyle)

  const processedModels = models
                  .map(mod => Model.clone(mod))


  // Take the 3D cube, place it in the 3D world, adjust the
  // viewpoint for the
  // camera, and project everything to two-dimensional triangles...
  //

  processedModels.forEach(model => model.triangles.forEach(triangle => {
    triangle.forEach(vertex => {
      const {origin, scale, rotation, coord: modelCoord} = model
      const {coord: vertCoord, normal: vertNormal} = vertex

      np_transformAndProject(width, height, camPos, origin, scale,
      rotation, modelCoord, vertCoord, vertNormal)
    })
  }))

  // NOTE: need to change array to float32array
  const triangles = Array.prototype.concat.apply(
    [], processedModels.map(model => model.triangles)
  )

  /* Triangles that are further away (greater z value) need to be drawn before
  triangles that are closer to the camera. A simple way to do this is to
  sort the projected triangles on z-value. That's why the projected Vertex
  values still keep track of their original z position (from camera space).
  However, a much nicer way to do this is to use a depth buffer. */
  if ( !depthBuffer) {
    triangles.sort((t1,t2) => {
      let avg1 = (t1[0].coord[2] + t1[1].coord[2] + t1[2].coord[2]) / 3
      let avg2 = (t2[0].coord[2] + t2[1].coord[2] + t2[2].coord[2]) / 3
      //return avg2 < avg1
      return avg2 - avg1;
    })
  }

  // Also clear out the depth buffer, if enabled (fill with large
  // values).
  if (depthBuffer) {
    Util.notNull(depthBuffer.length)
    if (depthBuffer.length !== width * height) {
      throw new Error(
        `Bad length of depthBuffer, should be width * height
        (${width * height}) but instead it's ${depthBuffer.length}`
      )
    }
    for (let i = 0; i < width * height; i++) {
      depthBuffer[i] = Number.POSITIVE_INFINITY
    }
  }



  // Erase what we drew last time.
  io_clearRenderBuffer(0,0,0,0, canvas)


  triangles.forEach(triangle => {
    renderFn(triangle, width, height, ambientLight, diffuseLight, depthBuffer)
      .forEach(draw => io_drawer(io_setPixelFillRect, canvas, draw))
  })

  return canvas;
} // render



return {io_render};



});//endRequireJS
