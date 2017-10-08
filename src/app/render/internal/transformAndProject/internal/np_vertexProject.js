define(function(require) { "use strict";

const Util = require('Util')
const {nonRestNonDefaultArgCheck: argChk} = Util




/* A simple way to do a 3D-to-2D projection is to divide x and y by z.
 The larger z is, the smaller the result of this division. Which makes
 sense because objects that are further away will appear smaller.
 In a real 3D app, you'd use a projection matrix that is a bit more
 fancy but this is the general idea.

 Note that this calculation may crash the app if newVertex.z == -100,
 or give weird results (such as nan values). In this demo we avoid that
 by always placing the vertices far enough away from the camera. In a
 real app, you'd clip the triangles against the view frustum first (as
 with so many things, Metal takes care of this for you). */

const np_vertexProject = function (width, height, vertexCoord) {
  argChk(np_vertexProject, arguments)





  if (vertexCoord[2] < -100) {
    console.warn("vertex component z < -100  this might crash the app")
  }



  vertexCoord[0] /= (vertexCoord[2] + 100) * 0.01
  vertexCoord[1] /= (vertexCoord[2] + 100) * 0.01

  // Let's say we want the camera / viewport to be about -40 to +40 of our
  // world units (centimeters). So we need to scale up by factor height/80
  // in both x and y directions (so everything stays square).

  vertexCoord[0] *= height / 80
  vertexCoord[1] *= height / 80

  // We want (0, 0) to be in the center of the screen. Initially it is at
  // the bottom-right corner, so shift everything over.
  vertexCoord[0] += width / 2
  vertexCoord[1] += height / 2
}








/* Remember, the above stuff -- transformation to world space, camera space,
   screen space -- is what you can do in a vertex shader. The vertex shader
   takes as input your model's vertices and transforms them into whatever
   you want. You can do basic stuff like we did here (rotations, 3D-to-2D
   projection, etc) but anything goes (for example, turn a grid of vertices
   into a waving flag using a bit of trig).
*/



return {np_vertexProject};

});//endRequireJS
