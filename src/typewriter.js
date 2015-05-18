// Typewriter factory
module.exports = typewriter = function(options) {
  if(options.container === undefined || options.container === null) {
    throw new Error("No typewriter container defined")
  }
  this.lps = options.lps || 5
  this.tickRate = options.tickRate || 5
  this.container = options.container
  // start off with the current element being a div
  this.currentElement = this.container
}

// defines the container with the text
typewriter.prototype.feed = function(container) {
  this.container = this.currentElement = container
  return this
}

// insert a carriage return in the form of a br tag
typewriter.prototype.cr = function() {
  this.container.appendChild(document.createElement("br"));
  return this
}

// creates and puts a text node
typewriter.prototype.type = function(text) {
  this.container.currentElement.appendChild(document.createTextNode(text))
  return this
}


// this should return
// <p> this is text <a>this is a link</a></p>
// .tag('p').text('this is text ').tag('a').text('this is a link')






// create a tag, and set that as the current operating element
typewriter.prototype.tag = function(tag, classes, id) {
  this.currentElement = document.createElement(tag)
  this.container.currentElement.appendChild(this.currentElement)
  return this
}

// pause the typewriter
typewriter.prototype.pause = function(duration) {
  setTimeout(function(){}, duration)
  return this
}

// finish this container
typewriter.prototype.endFeed = function(container) {

}
