define(function(require) { "use strict";


class Animator {
  constructor(bounceSpeed = 60, bounceAccel = 80) {
    this.bounceSpeed = bounceSpeed
    this.bounceAccel = bounceAccel
    this.previousTime = Date.now()
  }

  animate(model) {
    let now = Date.now()
    let deltaTime = now - this.previousTime
    this.previousTime = now
    if (deltaTime <= 0) return; // delta time too small
    if (deltaTime > 1) {deltaTime = 0.1} // delta time too large

    this.bounceSpeed += this.bounceAccel * deltaTime

    /*
    model.coord[0] += this.bounceSpeed * deltaTime
    model.coord[1] += this.bounceSpeed * deltaTime

    if (model.coord[1] < 0 || model.coord[1] > this.height) {
      model.coord[1] -= this.bounceSpeed * deltaTime    // restore position
      this.bounceSpeed = -this.bounceSpeed           // reverse direction
    }
    if (model.coord[0] < 0 ||model.coord[0] > this.width) {
      model.coord[0] -= this.bounceSpeed * deltaTime    // restore position
      this.bounceSpeed = -this.bounceSpeed           // reverse direction
    }
    // Change the scaling of the cube based on the bounce position.
    model.scale[1] = (model.coord[1] + 30) / 50
    model.scale[0] = 1.5 - model.scale[1] / 2
    model.scale[1] = model.scale[0]
    */

    // Add some rotations, just for the fun of it.
    const rnd = () => Number((1 + Math.random()).toPrecision(3))
    model.rotation[0] += rnd() * deltaTime
    model.rotation[1] += rnd() * deltaTime
    model.rotation[2] += rnd() * deltaTime
  }
}

return {Animator};



});//endRequireJS
