// Typewriter
window.Typewriter = function(options) {
  var text
    , marker
  if(options.container === undefined || options.container === null) {
    throw new Error("No typewriter container defined")
  }
  this.lps = options.lps || 5
  this.tickRate = options.tickRate || 5
  // add a typing marker to the container, and add a typewriter text block
  // text = document.createElement('div')
  this.textMarker = document.createElement('i')
  // text.classList.add('typewriter-text')
  this.textMarker.classList.add('typewriter-marker')
  // options.container.appendChild(text)
  options.container.appendChild(this.textMarker)
  this.container = options.container
  // start off with the current element being a div
  this.currentElement = this.container
  // used for maintaining order of execution, immediately resolve the first op
  this.currentPromise = Promise.resolve()
  // save the original options, just in case
  this.options = options


  // create a style tag to apply styles. prepend it so it can be overridden
  var head = document.head || document.getElementsByTagName('head')[0]
    , style = document.createElement('style')
    , css = `

      .typewriter-text {
        display: inline-block;
      }
      .typewriter-marker {
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
      , interval
      , textNode;
    letterCount = 0;
    // return a promise that resolves once it's finished
    return new Promise((resolve) => {

      // create a text node for building the text
      textNode = document.createTextNode('')
      // prepend it in front of the text marker
      this.currentElement.insertBefore(textNode, this.textMarker)

      interval = window.setInterval(() => {
        textNode.textContent += text[letterCount]
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
Typewriter.prototype.endFeed = function() {
  return this
}
