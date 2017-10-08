define(function(require) {
"use strict";

const Util = require('Util')
const {nonRestNonDefaultArgCheck: argChk} = Util
const glm = require('gl-matrix')
const {Vertex} = require('app/primitive/Vertex')

/* The model has a position in the 3D world, a scale, and an orientation that
 is given by 3 rotation angles. Because we're using a left-handed coordinate
 system, positive rotation is clockwise about the axis of rotation. */

/* Typically, the origin (0, 0, 0) is at the center of the model. If not, you
  can fix this with modelOriginX/Y/Z. Rotations happen about this origin, so
  if you want to rotate around one of the corners of the cube instead of the
  center, you can set modelOriginX and Z to 10. */

function Model (x,y,z, sx,sy,sz, rx,ry,rz, ox,oy,oz, triangles) {
  argChk(Model, arguments)
  const allSameLength = (arr, message) => arr.reduce((prevLength, currentItem) => {
    if (prevLength === null) {
      prevLength = currentItem.length
    }
    if (prevLength !== currentItem.length) {
      throw new Error(message)
    }
    return currentItem.length;
  }, null)

  triangles.forEach(triangle => {
    allSameLength(triangle);
  })

  allSameLength(triangles);


  return {
    coord : glm.vec4.fromValues(x,y,z, 1),
    scale : glm.vec4.fromValues(sx,sy,sz, 1),
    rotation : glm.vec4.fromValues(rx,ry,rz, 1),
    origin: glm.vec4.fromValues(ox,oy,oz, 1),
    triangles
  };
}




Model.clone = function (another) { argChk(Model.clone, arguments)
  const [x,y,z] = another.coord
  const [sx,sy,sz] = another.scale
  const [rx,ry,rz] = another.rotation
  const [ox,oy,oz] = another.origin
  const triangles = another.triangles

  Util.notNull(x,y,z, sx,sy,sz, rx,ry,rz, ox,oy,oz, triangles)

  const newTriangles = triangles.map(triang => triang.map(
    vert => Vertex.clone(vert)
  ))

  return Model(x,y,z, sx,sy,sz, rx,ry,rz, ox,oy,oz, newTriangles);
}





return {Model};


});//endRequireJS
