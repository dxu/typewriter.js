// Typewriter factory
window.Typewriter = function(options) {
  if(options.container === undefined || options.container === null) {
    throw new Error("No typewriter container defined")
  }
  this.lps = options.lps || 5
  this.tickRate = options.tickRate || 5
  this.container = options.container
  // start off with the current element being a div
  this.currentElement = this.container
  // used for maintaining order of execution, immediately resolve the first op
  this.currentPromise = Promise.resolve()
  return this
}

// defines the container with the text
Typewriter.prototype.feed = function(container) {
  this.container = this.currentElement = container
  return this
}

// creates and puts a text node
Typewriter.prototype.type = function(text) {
  this.currentPromise = this.currentPromise.then(() => {
    var letterCount
      , interval;
    letterCount = 0;
    return new Promise((resolve) => {
      interval = setInterval(() => {
        this.currentElement.innerHTML += text[letterCount]
        letterCount++
        // finished typing
        if(letterCount === text.length) {
          clearInterval(interval);
          resolve()
        }
      }, 1/this.lps * 1000)
    })
  }).catch(console.log.bind(console))
  return this
}

// this should return
// <p> this is text <a>this is a link</a></p>
// .tag('p').text('this is text ').tag('a').text('this is a link')

// create a tag, and set that as the current operating element
Typewriter.prototype.beginTag = function(tag, classes, id) {
  this.currentPromise = this.currentPromise.then(() => {
    var newTag = document.createElement(tag)
    this.currentElement.appendChild(newTag)
    this.currentElement = newTag
    return Promise.resolve()
  }).catch(console.log.bind(console))
  return this
}

// insert a carriage return in the form of a br tag
Typewriter.prototype.cr = function() {
  this.currentElement.appendChild(document.createElement("br"));
  return this
}

// change typing speed
Typewriter.prototype.changeLPS = function(lps) {
  this.currentPromise = this.currentPromise.then(() => {
    this.lps = lps
    return Promise.resolve()
  })
  return this
}

// disable cursor tick
Typewriter.prototype.stopTick = function() {
  return this
}

// enable cursor tick
Typewriter.prototype.startTick = function() {
  return this
}

// pause the typewriter, in milliseconds
Typewriter.prototype.pause = function(duration) {
  this.currentPromise = this.currentPromise.then(function() {
    return new Promise(function(resolve) {
      setTimeout(resolve, duration)
    })
  })
  return this
}

// finish this container
Typewriter.prototype.endFeed = function(container) {
  return this
}
