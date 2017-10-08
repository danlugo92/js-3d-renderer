define(function(require) { "use strict";


const Util = require('Util')
const {nonRestNonDefaultArgCheck: argChk} = Util

/* Clipping is an important feature of a rasterizer. You don't want to draw
   pixels that are not visible anyway. We do some basic clipping in this demo
   app but nothing fancy. Metal does clipping for you. */
/* TRANSFORMED AND PROJECTED TRIANGLES ONLY*/
// Only draw the triangle if it is at least partially inside the viewport.

const partiallyInsideViewport = function partiallyInsideViewport (
  triangle, contextWidth, contextHeight
) {
  argChk(partiallyInsideViewport, arguments)


  Util.notNull(triangle)

  if (triangle.length !== 3) throw new Error("illegal triangle length")


  function vertexInsideViewport (vertexCoord, contextWidth, contextHeight) {
    argChk(vertexInsideViewport, arguments)

    return vertexCoord[0] >= 0 || vertexCoord[0] < contextWidth ||
           vertexCoord[1] >= 0 || vertexCoord[1] < contextHeight;
  }


  return vertexInsideViewport(triangle[0].coord, contextWidth, contextHeight) ||
    vertexInsideViewport(triangle[1].coord, contextWidth, contextHeight) ||
    vertexInsideViewport(triangle[2].coord, contextWidth, contextHeight);
}




return {partiallyInsideViewport};



});//endRequireJS
