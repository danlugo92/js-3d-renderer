define(function(require) { "use strict";

const {nonRestNonDefaultArgCheck: argChk} =require('Util')

const inCanvas = function inCanvas (width, height, x, y) {
  argChk(inCanvas, arguments)
  return x > 0 && x < width && y > 0 && y < height;
}

return {inCanvas};

});//endRequireJS