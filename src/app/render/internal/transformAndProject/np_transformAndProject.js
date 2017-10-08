define(function(require) { "use strict";

const Util = require('Util')
const {nonRestNonDefaultArgCheck: argChk} = Util


const {np_vertexTransform} = require('./internal/np_vertexTransform')
const {np_vertexCamTransform} = require('./internal/np_vertexCamTransform')
const {np_vertexProject} = require('./internal/np_vertexProject')

const np_transformAndProject = function transformAndProject (
  ctxWidth, ctxHeight, camPos, origin, scale,
  rotation, modelCoord, vertCoord, vertNormal
) { argChk(transformAndProject, arguments)


  if (camPos.length !== 4 || vertCoord.length !== 4) {
    throw new TypeError("wrong data type passed in")
  }
  if (ctxWidth < 320 || ctxHeight < 240) {
    throw new Error("illegal width and height detected")
  }

  np_vertexTransform(origin, scale, rotation, modelCoord, vertCoord, vertNormal)
  np_vertexCamTransform(camPos, vertCoord)
  np_vertexProject(ctxWidth, ctxHeight, vertCoord)

}




return {np_transformAndProject};

});//endRequireJS
