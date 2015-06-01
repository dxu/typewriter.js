// Typewriter
window.Typewriter = function(options) {
  var text
    , marker
  if(options.container === undefined || options.container === null) {
    throw new Error("No typewriter container defined")
  }
  this.lps = options.lps || 5
  // times per second it ticks
  this.tickRate = options.tickRate || 2
  // the amount of time you wait until the tickMark starts ticking again
  this.tickDelay = options.tickDelay || 2000
  // add a typing marker to the container, and add a typewriter text block
  // text = document.createElement('div')
  this.textMarker = document.createElement('i')
  // the aspect ratio of the textMarker, w/h
  this.textMarkerAspectRatio = 1/2

  // text.classList.add('typewriter-text')
  this.textMarker.classList.add('typewriter-marker')
  // options.container.appendChild(text)
  options.container.appendChild(this.textMarker)
  this.container = options.container
  // start off with the current element being a div
  this.currentElement = this.container
  // used for maintaining order of execution, immediately resolve the first op
  this.currentPromise = Promise.resolve()


  // this.tickAction used
  this.tick = options.tick
  this.untick = options.untick
  this.currentPromise = Promise.resolve()
  // save the original options, just in case
  this.options = options


  // tick interval internal
  this.tickInterval = undefined

  // create a style tag to apply styles. prepend it so it can be overridden
  var head = document.head || document.getElementsByTagName('head')[0]
    , style = document.createElement('style')
    , css = `

      .typewriter-text {
        display: inline-block;
      }
      .typewriter-marker {
        vertical-align: bottom;
        background: red;
        display: inline-block;
        height: 40px;
        width: 20px;
      }
    `;

  style.type = 'text/css';

  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.insertBefore(style, head.firstChild);


  this._init()

  return this
}

Typewriter.prototype._init = function() {
  this.startTicking()
}

// defines the container with the text
Typewriter.prototype.feed = function(container) {
  this.container = this.currentElement = container
  return this
}

// Creates a <span> and uses that as the container for setting the text. This
// will stop the ticking
Typewriter.prototype.type = function(text) {
  this.currentPromise = this.currentPromise.then(() => {
    var letterCount
      , interval
      , textNode
      , spanTag;
    letterCount = 0;
    // return a promise that resolves once it's finished
    return new Promise((resolve) => {
      // if there is no text, then immediately resolve
      if(text.length === 0) {
        resolve()
      }

      // shouldn't tick when it's typing
      this.stopTicking()
      // TODO: allow the user to add identifiers for the text elements
      // create a span element as a wrapper for the text
      spanTag = document.createElement('span')
      // create a text node for building the text
      textNode = document.createTextNode('')
      spanTag.appendChild(textNode)
      // prepend it in front of the text marker
      this.currentElement.insertBefore(spanTag, this.textMarker)

      // add the first letter of the text content, and then update the size of
      // the text marker
      textNode.textContent += text[0]
      console.log('height', spanTag.offsetHeight)
      this.textMarker.style.height = spanTag.offsetHeight
      this.textMarker.style.width = spanTag.offsetHeight * this.textMarkerAspectRatio
      letterCount++

      interval = window.setInterval(() => {
        // finished typing
        if(letterCount === text.length) {
          clearInterval(interval);
          resolve()
          return
        }
        // otherwise continue typing
        textNode.textContent += text[letterCount]
        letterCount++
      }, 1/this.lps * 1000)
    })
  }).catch(console.log.bind(console))


  // when the new promise (of typing) finishes, we should start the ticking
  this.currentPromise.then(() => {
    console.log('finished ticking')
    // this.startTicking()
  })
  return this
}

// takes in a function to execute at this time
Typewriter.prototype.execute = function(func) {
  return this
}

// TEST CASES TO WRITE:
// 1.
// a. create some text
// b. create a div inside the div
// c. exit the div (back to the parent)
// d. create some more text
// e. remove the text
// f. does it remove from the last text node?
Typewriter.prototype.delete = function(count) {
  this.currentPromise = this.currentPromise.then(() => {
    // return a promise that only resolves once we've deleted `count` letters
    return new Promise((resolve) => {
      // should stop ticking when you start deleting
      this.stopTicking()
      // this.currentElement.textContent = this.currentElement.textContent.slice(0, -1)

      // filter out the last textnode, and from that text node
      for(var i=this.currentElement.childNodes.length; --i>=0; ) {
        // if its a text node, setup an interval removing letters from it, and then return
        if(this.currentElement.childNodes[i].nodeType === 3) {
          let interval = window.setInterval(() => {
            this.currentElement.childNodes[i].nodeValue = this.currentElement.childNodes[i].nodeValue.slice(0, -1)
            if(count-- === 0) {
              window.clearInterval(interval)
              resolve()
            }
          }, 1/this.lps * 1000)
          return
        }
      }
      // if there are no text nodes, then resolve and return
      resolve()
    })
  }).catch(console.log.bind(console))

  // when the new promise (of typing) finishes, we should start the ticking
  this.currentPromise.then(() => {
    console.log('finished ticking')
    // this.startTicking()
  })

  return this
}

// this should return
// <p> this is text <a>this is a link</a></p>
// .tag('p').text('this is text ').tag('a').text('this is a link')

// create a tag, and set that as the current operating element
Typewriter.prototype.beginTag = function(tag) {
  this.currentPromise = this.currentPromise.then(() => {
    var newTag = document.createElement(tag)
    // append the text marker to this new tag
    newTag.appendChild(this.textMarker.parentNode.removeChild(this.textMarker))

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
Typewriter.prototype.stopTicking = function() {
  console.log('cleared interval', this.tickInterval)
  window.clearInterval(this.tickInterval)
  // make sure that the marker is unticked
  this._untick(this.currentElement, this.textMarker)
  return this
}

// enable cursor tick
Typewriter.prototype.startTicking = function() {
  var currentlyTicked = false
  this.tickInterval = window.setInterval(() => {
    // if it's currently ticked then tick, otherwise untick
    currentlyTicked ? this._untick(this.currentElement, this.textMarker) :
      this._tick(this.currentElement, this.textMarker)
    currentlyTicked = !currentlyTicked
  }, 1000 / this.tickRate)

  return this
}

var lastDisplay

// TODO: If I hide an already hidden element, when I show, will it show, or will it remain hidden?
// the forward tick function
Typewriter.prototype._tick = (function(){
  console.log('tick')
  return function(currentElement, textMarker) {
    if(this.tick !== undefined && this.tick !== null) {
      this.tick(currentElement, textMarker)
    }
    // otherwise the default action is to hide the textMarker
    else {
      lastDisplay = textMarker.style.display
      textMarker.style.display = 'none'
    }
    return this
  }
})()

// the forward tick function
Typewriter.prototype._untick = function(currentElement, textMarker) {
  console.log('untick')
  if(this.untick !== undefined && this.untick !== null) {
    this.untick(currentElement, textMarker)
  }
  // otherwise the default action is to hide the textMarker
  else {
    textMarker.style.display = lastDisplay
  }
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
Typewriter.prototype.endFeed = function() {
  return this
}
