define(function(require) { "use strict";

/*
There are two best contenders:

Create a 1×1 image data, set the color, and putImageData at the location:
var id = myContext.createImageData(1,1); // only do this once per page
var d  = id.data;                        // only do this once per page
d[0]   = r;
d[1]   = g;
d[2]   = b;
d[3]   = a;
myContext.putImageData( id, x, y );
Use fillRect() to draw a pixel (there should be no aliasing issues):
ctx.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";
ctx.fillRect( x, y, 1, 1 );

I recommend testing against browsers you care about for maximum speed.
As of July 2017, fillRect() is 5-6× faster on Firefox v54 and Chrome v59
(Win7x64).
*/

const Util = require('Util')
const {nonRestNonDefaultArgCheck: argChk} = Util


const io_setPixelFillRect = function io_setPixelFillRect (
  x, y, r, g, b, a, canvas
) { argChk(io_setPixelFillRect, arguments)
  const {round: ro} = Math

  Util.notNull(canvas.width, canvas.height, canvas.getContext)

  const context = canvas.getContext("2d")
  const {width, height} = canvas

  Util.notNull(context.fillStyle, context.fillRect)

  if (width < 320 || height < 240) {
    throw new Error("canvas too small detected")
  }


  if (x > width || y > height || x < 0 || y < 0) {
    throw new Error("trying to draw outside of the canvas area")
  }


  context.fillStyle = `rgba(${ro(r*255)},${ro(g*255)},${ro(b*255)}, ${a})`



  context.fillRect( x, y, 1, 1 )

  return canvas;
}





return {io_setPixelFillRect};


});//endRequireJS
