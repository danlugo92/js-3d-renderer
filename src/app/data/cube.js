define(function(require) {
"use strict";


const {Vertex} = require('app/primitive/Vertex')
const {Model} = require('app/primitive/Model')


/*
  The Model is just a list of triangles.
  The 3D Model we're using in this app is a basic cube. The scale is -10 units
  to +10 units. The units can be whatever you want, so let's say centimeters.
  You would typically load your Models from a .obj file but because this is a
  simple demo we define the geometry by hand.
*/
const triangles = []

let triangle = []

triangle[0] = Vertex( -10,  -10,   10,  0,  0,  1,  1, 0, 0, 1)
triangle[1] = Vertex( -10,   10,   10,  0,  0,  1,  1, 0, 0, 1)
triangle[2] = Vertex(  10,  -10,   10,  0,  0,  1,  1, 0, 0, 1)
triangles.push(triangle)

triangle = []
triangle[0] = Vertex( -10,   10,   10,  0,  0,  1,  1, 0, 0, 1)
triangle[1] = Vertex(  10,  -10,   10,  0,  0,  1,  1, 0, 0, 1)
triangle[2] = Vertex(  10,   10,   10,  0,  0,  1,  1, 0, 0, 1)
triangles.push(triangle)

triangle = []
triangle[0] = Vertex( -10,  -10,  -10,  1,  0,  0,  1, 0, 0, -1)
triangle[1] = Vertex(  10,  -10,  -10,  0,  1,  0,  1, 0, 0, -1)
triangle[2] = Vertex(  10,   10,  -10,  0,  0,  1,  1, 0, 0, -1)
triangles.push(triangle)

triangle = []
triangle[0] = Vertex( -10,  -10,  -10,  1,  1,  0,  1, 0, 0, -1)
triangle[1] = Vertex(  10,   10,  -10,  0,  1,  1,  1, 0, 0, -1)
triangle[2] = Vertex( -10,   10,  -10,  1,  0,  1,  1, 0, 0, -1)
triangles.push(triangle)

triangle = []
triangle[0] = Vertex( -10,   10,  -10,  1,  0,  0,  1, 0, 1, 0)
triangle[1] = Vertex( -10,   10,   10,  1,  0,  0,  1, 0, 1, 0)
triangle[2] = Vertex(  10,   10,  -10,  1,  0,  0,  1, 0, 1, 0)
triangles.push(triangle)

triangle = []
triangle[0] = Vertex( -10,   10,   10,  1,  0,  0,  1, 0, 1, 0)
triangle[1] = Vertex(  10,   10,  -10,  1,  0,  0,  1, 0, 1, 0)
triangle[2] = Vertex(  10,   10,   10,  1,  0,  0,  1, 0, 1, 0)
triangles.push(triangle)

triangle = []
triangle[0] = Vertex( -10,  -10,  -10,  1,  1,  1,  1, 0, -1, 0)
triangle[1] = Vertex(  10,  -10,  -10,  1,  1,  1,  1, 0, -1, 0)
triangle[2] = Vertex( -10,  -10,   10,  1,  1,  1,  1, 0, -1, 0)
triangles.push(triangle)

triangle = []
triangle[0] = Vertex( -10,  -10,   10,  1,  1,  1,  1, 0, -1, 0)
triangle[1] = Vertex(  10,  -10,   10,  1,  1,  1,  1, 0, -1, 0)
triangle[2] = Vertex(  10,  -10,  -10,  1,  1,  1,  1, 0, -1, 0)
triangles.push(triangle)

triangle = []
triangle[0] = Vertex(  10,  -10,  -10,  0,  1,  0,  1, 1, 0, 0)
triangle[1] = Vertex(  10,  -10,   10,  0,  1,  0,  1, 1, 0, 0)
triangle[2] = Vertex(  10,   10,  -10,  0,  1,  0,  1, 1, 0, 0)
triangles.push(triangle)

triangle = []
triangle[0] = Vertex(  10,  -10,   10,  0,  1,  0,  1, 1, 0, 0)
triangle[1] = Vertex(  10,   10,  -10,  0,  1,  0,  1, 1, 0, 0)
triangle[2] = Vertex(  10,   10,   10,  0,  1,  0,  1, 1, 0, 0)
triangles.push(triangle)

// The yellow side has normal vectors that point in different directions,
// which makes it appear rounded when lighting is applied. For the other
// sides all vertices have the same normal vectors, making them appear flat.

triangle = []
triangle[0] = Vertex( -10,  -10,  -10,  1,  1,  0,  1, -0.577, -0.577, -0.577)
triangle[1] = Vertex( -10,   10,  -10,  1,  1,  0,  1, -0.577,  0.577, -0.577)
triangle[2] = Vertex( -10,  -10,   10,  1,  1,  0,  1, -0.577, -0.577,  0.577)
triangles.push(triangle)

triangle = []
triangle[0] = Vertex( -10,  -10,   10,  1,  1,  0,  1, -0.577, -0.577,  0.577)
triangle[1] = Vertex( -10,   10,   10,  1,  1,  0,  1, -0.577,  0.577,  0.577)
triangle[2] = Vertex( -10,   10,  -10,  1,  1,  0,  1, -0.577,  0.577, -0.577)
triangles.push(triangle)



const cube = Model(0,0,0, 1,1,1, 0,0,0, 10,0,10, triangles)




return cube;



});//endRequireJS
