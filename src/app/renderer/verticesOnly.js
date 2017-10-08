define(function(require) {
"use strict";

const Util = require('Util')
const {nonRestNonDefaultArgCheck: argChk} = Util
const {partiallyInsideViewport} = require('./internal/partiallyInsideViewport')
const {inCanvas} = require('./internal/inCanvas')
const glm = require('gl-matrix')
const {Color} = require('app/primitive/Color')

// MARK: - Triangle rasterization
/* OK, so far what we've done is put our 3D model into the world, adjusted for
   the camera's viewpoint, and converted to 2D space. What we have now is the
   same list of triangles but their vertex coordinates now represent specific
   pixels on the screen (instead of points in some imaginary three-dimensional
   space).
   We can draw these pixels but that only gives us the vertices, not the entire
   triangle. You can use the following function for that: it just plots three
   pixels for each triangle. (It's useful for debugging but it doesn't really
   make things look very exciting...)
*/

const verticesOnly = function verticesOnly (triangle, width, height,
  // these 3 args get ignored, to conform to the renderFn interface
  ambientLight, diffuseLight, depthBuffer
) {
  argChk(verticesOnly, arguments)

  let draws = [];
  // HACK:jshint
  Util.notNull(ambientLight, diffuseLight, depthBuffer)

  if (triangle.length !== 3) {
    throw new TypeError("wrong data type passed in")
  }
  triangle.forEach(vert => {
    Util.notNull(vert.coord)
    Util.notNull(vert.color)
    Util.notNull(vert.normal)
  })




  if (partiallyInsideViewport(triangle, width, height)) {
    draws.push(...triangle.map( vert => ({
      coord: glm.vec2.fromValues(vert.coord[0], vert.coord[1]),
      color: Color.clone(vert.color),
      insideViewport: inCanvas(width, height, vert.coord[0], vert.coord[1])
    })))
  }

  return draws;
}



return {verticesOnly};

});//endRequireJS
