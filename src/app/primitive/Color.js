define(function(require) {
"use strict";


const glm = require('gl-matrix')
const {nonRestNonDefaultArgCheck: argChk} = require('Util')

function chkColor(c) {
  if (c > 1 || c < 0)  throw new TypeError("color out of bounds")
}



function Color (r, g, b, a) { argChk(Color, arguments)

  /*
  function chkColor (c) {
    if (c > 255 || c < 0) {
      throw new TypeError("color out of bounds")
    }
  }
  */

  chkColor(r); chkColor(g); chkColor(b); chkColor(a)

  return glm.vec4.fromValues(r,g,b, a);
}


Color.clone = function clone (another) { argChk(Color.clone, arguments)
  let [r,g,b,a] = another
  return Color(r,g,b,a);
}


return {Color, chkColor};


});//endRequireJS
