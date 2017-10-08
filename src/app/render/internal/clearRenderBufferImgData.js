define(function(require) { "use strict";


const Util = require('Util')
const {nonRestNonDefaultArgCheck: argChk} = Util

const {chkColor} = require('app/primitive/Color')

const io_clearRenderBuffer = function io_clearRenderBuffer (r,g,b,a, canvas) {
  argChk(io_clearRenderBuffer, arguments)

  chkColor(r,g,b,a)

  Util.notNull(canvas.width, canvas.height, canvas.getContext)

  const context = canvas.getContext("2d")
  Util.notNull(context.putImageData)

  const newImageArray = new Uint8ClampedArray(
    canvas.width * canvas.height * 4
  )

  for (let i = 0; i < canvas.width * canvas.height * 4; i += 4) {
    newImageArray[0 + i] = r
    newImageArray[1 + i] = g
    newImageArray[2 + i] = b
    newImageArray[3 + i] = a
  }

  // experimental
  const imageData = new ImageData(
    newImageArray, canvas.width, canvas.height
  )

  context.putImageData(imageData, 0, 0);

  return canvas;
}

return {io_clearRenderBuffer};

});//endRequireJS
