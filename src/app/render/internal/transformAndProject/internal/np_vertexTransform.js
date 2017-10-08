define(function(require) { "use strict";

/*
  Each 3D model in the app (we only have one, the cube) is defined
  in its own,local space (aka "model space"). In order to draw
  these models on the screen, we have to make them undergo several
  "transformations":

  1. First we have to take the models and place them inside the
  larger 3D world. This is a transformation to "world space".

  2. Then we position the camera and look at the world through this
  camera, a transformation to "camera space". At this point we can
  already throw away some triangles that are not visible (culling).

  3. Finally, we project this 3D view onto a 2D surface so that we
  can show it on the screen; this projection is a transformation to
  screen space" (also known as "viewport space").


  This is where all the math happens. To make clear what is going
  on, I used straightfoward math -- mostly addition,
  multiplication, the occasional sine and cosine. In a real 3D+
  application you'd stick most of these calculations inside
  matrices, as they are much more efficient and easy to use.

  But those matrices will do the exact same things you see here!
  A lot of the stuff that happens in this function would normally
  be done by a vertex shader on the GPU. The vertex shader takes
  the model's vertices and transforms them from local 3D space to
  2D space, and all the steps inbetween.
*/

const Util = require('Util')
const {nonRestNonDefaultArgCheck: argChk} = Util
const glm = require('gl-matrix')

const np_vertexTransform = function (
  origin, scale, rotation, modelCoord, vertCoord, vertNormal
) { argChk(np_vertexTransform, arguments)
  let tempA, tempB;


  // We may need to adjust the model's origin, which is a translation.
  glm.vec4.sub(vertCoord, vertCoord, origin)

  // Scale the vertex:
  glm.vec4.mul(vertCoord, vertCoord, scale)





  // Rotate about the X-axis. This rotates the vertex around the model's
  // adjusted origin.
  tempA = Math.cos(rotation[0]) * vertCoord[1] +
                              Math.sin(rotation[0]) * vertCoord[2]
  tempB = -Math.sin(rotation[0]) * vertCoord[1] +
                              Math.cos(rotation[0]) * vertCoord[2]
  //
  vertCoord[1] = tempA
  vertCoord[2] = tempB

  // Rotate about the Y-axis:
  tempA =  Math.cos(rotation[1]) * vertCoord[0] +
                              Math.sin(rotation[1]) * vertCoord[2]
  tempB = -Math.sin(rotation[1]) * vertCoord[0] +
                              Math.cos(rotation[1]) * vertCoord[2]
  //
  vertCoord[0] = tempA
  vertCoord[2] = tempB

  // Rotate about the Z-axis:
  tempA =  Math.cos(rotation[2]) * vertCoord[0] +
                              Math.sin(rotation[2]) * vertCoord[1]
  tempB = -Math.sin(rotation[2]) * vertCoord[0] +
                              Math.cos(rotation[2]) * vertCoord[1]
  //
  vertCoord[0] = tempA
  vertCoord[1] = tempB

  // Finally, perform translation to the model's position in the 3D world.
  glm.vec4.add(vertCoord, vertCoord, modelCoord)

  // We also need to rotate the normal vector so that it stays aligned
  // with the orientation of the vertex. Because in this demo app we only
  // rotate about the Y-axis, I've only included that rotation code, not
  // the other axes. If I had used a matrix for the vertex coordinates,
  // then I simply could've multiplied the normal vector with that same
  // rotation matrix.

  tempA =  Math.cos(rotation[1]) * vertNormal[0] +
                                Math.sin(rotation[1]) * vertNormal[2]
  tempB = -Math.sin(rotation[1]) * vertNormal[0] +
                                Math.cos(rotation[1]) * vertNormal[2]
  vertNormal[0] = tempA
  vertNormal[2] = tempB

  vertCoord[3] = 1
}


return {np_vertexTransform};

});//endRequireJS
