// Typewriter factory
window.Typewriter = function(options) {
  var text
    , marker
  if(options.container === undefined || options.container === null) {
    throw new Error("No typewriter container defined")
  }
  this.lps = options.lps || 5
  this.tickRate = options.tickRate || 5
  // add a typing marker to the container, and add a typewriter text block
  text = document.createElement('div')
  marker = document.createElement('i')
  text.classList.add('typewriter-text')
  marker.classList.add('typewriter-marker')
  options.container.appendChild(text)
  options.container.appendChild(marker)
  this.container = text
  // start off with the current element being a div
  this.currentElement = this.container
  // used for maintaining order of execution, immediately resolve the first op
  this.currentPromise = Promise.resolve()
  // save the original options, just in case
  this.options = options

  // create a style tag to apply styles
  var head = document.head || document.getElementsByTagName('head')[0]
    , style = document.createElement('style')
    , css = `i {
      background: red;
    }`;

  style.type = 'text/css';

  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.insertBefore(style, head.firstChild);

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
  this.currentPromise = this.currentPromise.then(() => {
    this.currentElement.appendChild(document.createElement("br"));
    return Promise.resolve()
  })
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
