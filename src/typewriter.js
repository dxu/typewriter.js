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
  return this
}

// defines the container with the text
Typewriter.prototype.feed = function(container) {
  this.container = this.currentElement = container
  return this
}

// insert a carriage return in the form of a br tag
Typewriter.prototype.cr = function() {
  this.currentElement.appendChild(document.createElement("br"));
  return this
}

// creates and puts a text node
Typewriter.prototype.type = function(text) {
  var letterCount
    , interval;

  letterCount = 0;
  interval = setInterval(() => {
    this.currentElement.innerHTML += text[letterCount]
    letterCount++
    if(letterCount === text.length) {
      clearInterval(interval);
    }
  }, 1/this.lps * 1000);

  return this
}

// this should return
// <p> this is text <a>this is a link</a></p>
// .tag('p').text('this is text ').tag('a').text('this is a link')

// create a tag, and set that as the current operating element
Typewriter.prototype.beginTag = function(tag, classes, id) {
  this.currentElement = document.createElement(tag)
  this.container.currentElement.appendChild(this.currentElement)
  return this
}

// pause the typewriter
Typewriter.prototype.pause = function(duration) {
  setTimeout(function(){}, duration)
  return this
}

// finish this container
Typewriter.prototype.endFeed = function(container) {

}
