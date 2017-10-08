define(function(require) { "use strict";

const Util = require('Util')
const {nonRestNonDefaultArgCheck: argChk} = Util
const glm = require('gl-matrix')

/* Currently we're viewing the 3D world from (0, 0, 0), straight down the z
   axis. You can imagine there is a "camera" object, and we can place this
   camera anywhere we want and make it look anywhere we want.

   This means we need to transform the objects from "world space" into "camera
   space". This uses the same math as before, but in the opposite direction.
   In practice, you'd also use a matrix for this. (In fact, you'd combine the
   model matrix and the camera matrix into a single matrix.) */

// Move everything in the world opposite to the camera, i.e. if the
// camera moves to the left, everything else moves to the right.
// Likewise, you can perform rotations as well. If the camera rotates
// to the left with angle alpha, everything else rotates away from the
// camera to the right with angle -alpha. (I did not implement that in
// this demo.)
const np_vertexCamTransform = function (camPos, vertCoord) {
  argChk(np_vertexCamTransform, arguments)


  glm.vec4.sub(vertCoord, vertCoord, camPos)
  vertCoord[3] = 1
};



  /* At this point you may want to throw away triangles that aren't going to
   be visible anyway, for example those that are behind the camera or those
   that are facing away from the camera. (Not implemented but it involves a
   bit more math. Metal or OpenGL will automatically do this for you.) */


/* Now we have a set of triangles described in camera space. The units of
   this camera space are whatever you want them to be (we chose centimeters)
   but we need to convert this to pixels somehow.

   Also, we need to decide where on the screen to place the camera space's
   origin (we'll put it in the center).

   And we have to project from 3D coordinates to 2D coordinates somehow, i.e.
   we need to get rid of the z-axis.
   That all happens in this final transformation step.
   Note that Metal does things in a slightly different order: the projection
   transform puts the vertices in "clip space" first, but we directly convert
   them to screen space. (It's the big picture that matters, not the details.)

   As before, I'm illustrating how to do this with basic math operations.
   Typically you'd combine all these operations into a projection matrix and
   pass that to your vertex shader, so applying it to the vertices happens
   on the GPU.

   Note that the output array still contains Triangle objects even though we
   no longer use the z position of the Vertex object. As it turns out, we can
   use this z-value for a depth buffer, i.e. to determine whether to overwrite
   any existing fragments later on when we attempt to draw the triangles.
*/

return {np_vertexCamTransform};

});//endRequireJS
