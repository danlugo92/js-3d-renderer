/*
 To draw the triangles we have to connect these 3 projected vertex pixels
 somehow. This is called rasterizing.

 Metal takes care of most of this for you. Once it has figured out which
 pixels belong to the triangle, the GPU will call the fragment shader for
 each of these pixels -- and that lets you change how this pixel gets drawn.
 Still, it is useful to understand how rasterizing works under the hood.

 To rasterize a triangle, we'll draw horizontal strips. For example, if the
 triangle has these vertices,

           b
                   c
      a

 then the horizontal strips will look like this:

           =
          ====
         ========
        ============
       ========
      ====

 There is one strip for every vertical line on the screen, so strips are 1
 pixel high. I call these "spans".

 To find out where each span starts and ends, we have to interpolate between
 the y-positions of the three vertices to find the corresponding starting and
 ending x-positions, represented by asterisks in the following image:
           b
          *  *
         *      *
        *          c
       *      *
      a   *
 I called these *'s "edges". An edge represents an x-coordinate. Each span has
 two edges, one on the left and one on the right. Once we've found these two
 edges, we simply draw a horizontal line between them. Repeat this for all
 the spans in the triangle, and we'll have filled up the triangle with pixels!
 The keyword in rasterization is interpolation. We interpolate all the things!
 As we calculate these spans and their edges, we not only interpolate the
 x-positions of the vertices, but also their colors, their normal vectors,
 their z-values (for the depth buffer), their texture coordinates, and so on.
 And when we fill up the spans from left to right we interpolate again, across
 the surface of the triangle!
 So rasterization gives us the screen coordinates of each pixel that belongs
 to a given triangle. It also gives us an interpolated color, and this is what
 we write into the framebuffer. That last step, writing the color into the
 framebuffer, is what the fragment shader does.

 Metal will do all the interpolation stuff for you, and then calls a fragment
 shader for each pixel in the triangle. Of course, you can decide to do lots
 of wild things to the pixel color before you write it into the framebuffer.
 Typically, you'd apply a texture or do lighting calculations, but only your
 imagination is the limit!
*/

define(function(require) {
"use strict";



const Util = require('Util')
const {nonRestNonDefaultArgCheck: argChk} = Util
const {Color} = require('app/primitive/Color')
const glm = require('gl-matrix')
const {partiallyInsideViewport} = require('./internal/partiallyInsideViewport')


function Edge (x, r,g,b, a, z, nx,ny,nz) { argChk(Edge, arguments)
  return {
    x, // start or end coordinate of horizontal strip
    color : Color(r,g,b, a), // color at this point
    normal : glm.vec4.fromValues(nx,ny,nz, 1), // interpolated normal vector
    z, // for checking and filling in the depth buffer
  };
}



Edge.blank = function() { argChk(Edge.blank, arguments)
  return Edge(0,0,0,0,0,0,0,0,0);
}



Edge.clone = function (another) { argChk(Edge.clone, arguments)
  const {x, r,g,b, a, z, nx,ny,nz} = another
  return Edge(x, r,g,b, a, z, nx,ny,nz);
}



/* A span describes a horizontal strip that we fill in with pixels. */
/* In this case it'll only be an array of 2 edges.*/


Edge.leftEdge = function (edge1, edge2) { argChk(Edge.leftEdge, arguments)
  return edge1.x < edge2.x ? edge1 : edge2;
}

Edge.rightEdge = function (edge1, edge2) { argChk(Edge.rightEdge, arguments)
  return edge1.x > edge2.x ? edge1 : edge2;
}











/* An edge is one side of such a horizontal strip. */


























/*
  NOTE: need to clean up the logic here pretty bad. Spans and Edges and array
*/





/*
  In this function we interpolate from vertex1 to vertex2. We step one vertical
  pixel at a time and calculate the x-position for each of those vertical lines.
  We also interpolate the other vertex properties, such as their colors.
*/
// return ythe spans
function addEdge (vertex1, vertex2, height, spans, spanLines) {
  argChk(addEdge, arguments)
  Util.notNull(spanLines.first, spanLines.last)

  const {ceil, abs, round} = Math
  Util.notNull(ceil, abs, round)


  const yDiff = ceil(vertex2.coord[1] - 0.5) - ceil(vertex1.coord[1] - 0.5)
  if (yDiff === 0) return;  // degenerate edge


  const [start, end] = yDiff > 0 ? [vertex1,vertex2] : [vertex2,vertex1]



  const len = abs(yDiff)


  let yPos = ceil(start.coord[1] - 0.5) // y should be integer because
  const yEnd = ceil(end.coord[1] - 0.5) // it needs to fit on a 1-px line





  const xStep = (end.coord[0] - start.coord[0]) / len // x can stay f.p. for now
  let xPos = start.coord[0] + xStep / 2

  const zStep = (end.coord[2] - start.coord[2]) / len
  let zPos = start.coord[2] + zStep / 2






  const rStep = (end.color[0] - start.color[0]) / len
  let rPos = start.color[0]


  const gStep = (end.color[1] - start.color[1]) / len
  let gPos = start.color[1]

  const bStep = (end.color[2] - start.color[2]) / len
  let bPos = start.color[2]

  const aStep = (end.color[3] - start.color[3]) / len
  let aPos = start.color[3]



  const nxStep = (end.normal[0] - start.normal[0]) / len
  let nxPos = start.normal[0]

  const nyStep = (end.normal[1] - start.normal[1]) / len
  let nyPos = start.normal[1]

  const nzStep = (end.normal[2] - start.normal[2]) / len
  let nzPos = start.normal[2]


  while (yPos < yEnd) {

    const x = ceil(xPos - 0.5) // now we make x an integer too

    // Don't want to go outside the visible area.
    if (yPos >= 0 && yPos < height) {

      // This is to optimize drawSpans(), so it knows where to start
      // drawing and where to stop.
      if (yPos < spanLines.first) spanLines.first = yPos
      if (yPos > spanLines.last) spanLines.last = yPos

      /*
        HACK: check against originial in case of bug
      */
      // Add this edge to the span for this line.
      spans[yPos].push(Edge(
        x, rPos, gPos, bPos, aPos, zPos, nxPos, nyPos, nzPos
      ))
      /* NOTE: SANITY CHECK */
      if (spans[yPos].length > 2) throw new Error("more than 2 edges")
    } else {
      throw new Error("should we get here????")
    }

    // Move the interpolations one step forward.
    yPos += 1
    xPos += xStep
    zPos += zStep
    rPos += rStep
    gPos += gStep
    bPos += bStep
    aPos += aStep
    nxPos += nxStep
    nyPos += nyStep
    nzPos += nzStep
  }
} // addEdge















/*
  Once we have calculated all the spans for the given triangle, we can draw
  those horizontal strips. We interpolate the x-position (step one pixel at
  a time to the right) and also the other properties such as the color.
*/
function drawSpans (
  width, spans, spanLines, ambientLight, diffuseLight, depthBuffer
) {
  argChk(drawSpans, arguments)
  Util.notNull(spanLines.first, spanLines.last)

  if (  !  Number.isInteger(spanLines.first) ) {
    throw new Error("non integer detected in spanLines.first")
  }
  if (  !  Number.isInteger(spanLines.last) ) {
    throw new Error("non integer detected in spanLines.last")
  }

  if (  !  Number.isSafeInteger(spanLines.first) ) {
    throw new Error("non safe integer detected in spanLines.first")
  }
  if (  !  Number.isSafeInteger(spanLines.last) ) {
    throw new Error("non safe integer detected in spanLines.last")
  }




  const draws = []

  if (spanLines.last === 1) return draws;



  for (let y = spanLines.first; y <= spanLines.last; y++) {
    if (spans[y].length !== 2) {
      throw new Error("two many edges fck")
    }

    let edge1 = Edge.leftEdge(spans[y][0], spans[y][1])
    let edge2 = Edge.rightEdge(spans[y][0], spans[y][1])
    Util.notNull(edge1, edge2)
    Util.notNull(edge1.x, edge2.x)

    // How much to interpolate on each step.
    let step = 1 / (edge2.x - edge1.x)
    let pos = 0

    if (  !(Number.isInteger(edge1.x) && Number.isInteger(edge2.x))  ) {
      throw new Error("non integer detected in Edge x coord")
    }

    if (!(Number.isSafeInteger(edge1.x) && Number.isSafeInteger(edge2.x))){
      throw new Error("non safe integer detected in Edge x coord")
    }

    for (let x = edge1.x; x < edge2.x; x++) {
      // Interpolate between the colors again.
      let r = edge1.color[0] + (edge2.color[0] - edge1.color[0]) * pos
      let g = edge1.color[1] + (edge2.color[1] - edge1.color[1]) * pos
      let b = edge1.color[2] + (edge2.color[2] - edge1.color[2]) * pos
      let a = edge1.color[3] + (edge2.color[3] - edge1.color[3]) * pos

      /*
        The depth buffer makes sure that a triangle that is further away
        does not obscure a triangle that is closer to the camera. This is
        done by storing the z-value of each triangle pixel into the depth
        buffer. To use the depth buffer we also interpolate between these
        z-positions to calculate the z-position each pixel corresponds with.
        We only draw the pixel if no "nearer" pixel has yet been drawn.
        (This is also a feature that Metal provides for you already.)
      */
      let shouldDrawPixel = true
      if (depthBuffer) {
        let z = edge1.z + (edge2.z - edge1.z) * pos
        let offset = x + y * width
        if (depthBuffer[offset] > z) {
          depthBuffer[offset] = z
        } else {
          shouldDrawPixel = false
        }
      } // if depthBuffer

      /*
        Also interpolate the normal vector. Note that for many triangles
        in the cube, all three vertices have the same normal vector. So
        all pixels in such a triangle get identical normal vectors. But
        this is not a requirement: I've also included a triangle whose
        vertices have different normal vectors, giving it a more "rounded"
        look.
      */
      let nx = edge1.normal[0] + (edge2.normal[0] - edge1.normal[0]) * pos
      let ny = edge1.normal[1] + (edge2.normal[1] - edge1.normal[1]) * pos
      let nz = edge1.normal[2] + (edge2.normal[2] - edge1.normal[2]) * pos


      if (shouldDrawPixel) {
        const {max, min} = Math
        const vec2fv = glm.vec2.fromValues
        Util.notNull(vec2fv)
        const [diffuseX, diffuseY, diffuseZ] = diffuseLight.direction
        const [diffuseR, diffuseG, diffuseB, diffuseIntensity] = diffuseLight.color



        const [ambientR, ambientG, ambientB, ambientIntensity] =
                                                          ambientLight
        //
        Util.notNull(diffuseX, diffuseY, diffuseZ)
        Util.notNull(ambientR, ambientG, ambientB, ambientIntensity)
        /*
          This is where the fragment shader does its job. It is called
          once for every pixel that we must draw, with interpolated values
          for the color, texture coordinates, and so on. Here you can do
          all kinds of fun things. We calculate the color of the pixel
          based on a very simple lighting model, but you can also sample
          from a texture, etc.
        */
        let factor = min(max(0,-1*(nx*diffuseX + ny*diffuseY + nz*diffuseZ)), 1)

        r *= ambientR*ambientIntensity + factor*diffuseR*diffuseIntensity
        g *= ambientG*ambientIntensity + factor*diffuseG*diffuseIntensity
        b *= ambientB*ambientIntensity + factor*diffuseB*diffuseIntensity

        // BUG: 0 - 1 instead of 0 - 255
        r = max(min(r, 1), 0)   // clamp the colors
        g = max(min(g, 1), 0)   // so they don't
        b = max(min(b, 1), 0)   // become too bright
        // FIXME: insideViewport
        draws.push({
          coord: vec2fv(x, y),
          color: Color(r,g,b,a),
          insideViewport: true
        })
      }

      pos += step
    } // for let x
  } // for let y

  return draws;
} // drawSpans



































function rasterizer (
  triangle, width, height, ambientLight, diffuseLight, depthBuffer
) {
  argChk(rasterizer, arguments)


  let spans = [], draws = [];


  if (!partiallyInsideViewport(triangle, width, height)) return draws;


  let spanLines = {
    first : Number.MAX_SAFE_INTEGER,
    last : -1
  }




  for (let i = 0; i < height; i++) {
    spans[i] = []
  }

  // Interpolate all the things!
  addEdge(triangle[0], triangle[1], height, spans, spanLines)
  addEdge(triangle[1], triangle[2], height, spans, spanLines)
  addEdge(triangle[2], triangle[0], height, spans, spanLines)

  // puts 3 draws or more into the draws array
  draws.push(
    ...drawSpans(width, spans, spanLines, ambientLight, diffuseLight, depthBuffer)
  )

  return draws;
}








return {
  rasterizer,
};







});//endRequireJS
