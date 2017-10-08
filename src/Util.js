define(function() {
"use strict";




const notNull = function (...args) {
  if (arguments.length === 0) {
    throw new TypeError("no args found")
  }

  args.forEach((arg, i) => {
    // == catches undefined
    if (arg == null) {
      throw new TypeError(
        `Arg no. ${i} is null cannot be null or undefined arg was ${arg}`
      )
    }
  })
}

const nonRestNonDefaultArgCheck = function(fn, argsObj) {
  if (arguments.length !== 2) throw new TypeError(
      `Args number incorrect, expected 2 got ${arguments.length}`
  )

  notNull(fn, argsObj)

  let theArgs = Array.from(argsObj)
  theArgs.forEach(arg => notNull(arg))

  if (theArgs.length !== fn.length) throw new TypeError(
      `Args number incorrect, expected ${fn.length} got ${theArgs.length}`
  )

}


return {
  notNull, nonRestNonDefaultArgCheck
};

});//endRequireJS
