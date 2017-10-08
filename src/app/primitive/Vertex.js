define(function(require) {
"use strict";

const Util = require('Util')
const {nonRestNonDefaultArgCheck: argChk} = Util
const glm = require('gl-matrix')
const {Color} = require('app/primitive/Color')



/*
  A triangle has three vertices. (Another common name for this is a "face".)

  The order of the vertices in the triangle is important when face culling is
  used, so that triangles that are facing away from the camera are not drawn.
  Get the order wrong and triangles won't show up at all!

  However, in this demo app we don't do face culling and so the vertex order
  doesn't really matter.

  And that's why we don't have a triangle factory
*/

/*
A vertex describes a position in 3D space (x, y, z), but also the color of
the triangle at that vertex, and a normal vector for lighting calculations.
You can also add extra information such as texture mapping coordinates, as
well as any other data you want to associate with a vertex.
*/

function Vertex (x, y, z, r, g, b, a, nx, ny, nz) { argChk(Vertex, arguments)
  return {
    coord : glm.vec4.fromValues(x,y,z, 1),
    color : Color(r,g,b, a),
    normal : glm.vec4.fromValues(nx,ny,nz, 1)
  };
}

Vertex.fromVectors = function (coord, color, normal) {
  argChk(Vertex.fromVectors, arguments)

  return {coord, color, normal};

}


Vertex.clone = function (another) { argChk(Vertex.clone, arguments)
  const [x,y,z] = another.coord
  const [r,g,b, a] = another.color
  const [nx,ny,nz] = another.normal

  Util.notNull(x, y, z, r, g, b, a, nx, ny, nz)

  return Vertex(x, y, z, r, g, b, a, nx, ny, nz);
}



return {Vertex};


});//endRequireJS
