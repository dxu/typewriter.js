(() => {
  const TEXT_CLASS = 'typewriterjs-text';

  const root = typeof self === 'object' && self.self === self && self || this;

  // Typewriter
  root.Typewriter = function Typewriter(options) {
    if (options.container === undefined || options.container === null) {
      throw new Error('No typewriter container defined');
    }
    // id used to identify the typewriter block. we should set the class each time
    // we .move(), and also each time we initialize.
    this._id = options.id || '';
    // the color the typewriter is using
    this._ink = undefined;

    this.lps = options.lps || 5;
    // times per second it ticks
    this.tickRate = options.tickRate || 2;
    // the amount of time you wait until the tickMark starts ticking again
    this.tickDelay = options.tickDelay || 2000;

    // add a typing marker to the container, and add a typewriter text block
    this.textMarker = document.createElement('i');
    this.textMarker.classList.add('typewriter-marker');
    options.container.appendChild(this.textMarker);
    // the aspect ratio of the textMarker, w/h
    this.textMarkerAspectRatio = 1 / 2;

    this.container = options.container;
    // start off with the current element being a div
    this.currentElement = this.container;
    // used for maintaining order of execution, immediately resolve the first op
    this.currentPromise = Promise.resolve();

    this.tick = options.tick;
    this.untick = options.untick;
    // whether or not this should be able to tick
    this.tickable = options.tickable || true;
    this.currentPromise = Promise.resolve();
    // save the original options, just in case
    this.options = options;

    // tick interval internal
    this.tickInterval = undefined;

    // create a style tag to apply styles. prepend it so it can be overridden
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    const defaultCSS =
    `
      .typewriter-text {
        display: inline-block;
      }
      .typewriter-marker {
        vertical-align: text-top;
        background: red;
        display: inline-block;
        height: 40px;
        width: 20px;
      }
    `;

    style.type = 'text/css';

    if (style.styleSheet) {
      style.styleSheet.cssText = defaultCSS;
    } else {
      style.appendChild(document.createTextNode(defaultCSS));
    }

    head.insertBefore(style, head.firstChild);

    this._init();

    return this;
  };




  root.Typewriter.prototype._updateTextMarkerSize =
    function _updateTextMarkerSize(tag) {
        // console.log('new textmarker', tag.offsetHeight);
      this.textMarker.style.height = tag.offsetHeight;
      this.textMarker.style.width = tag.offsetHeight * this.textMarkerAspectRatio;
    };

  root.Typewriter.prototype._init = function _init() {
    this.startTicking();
  };

  // defines the container with the text
  root.Typewriter.prototype.feed = function feed(container) {
    this.container = this.currentElement = container;
    return this;
  };

  // Creates a <span> and uses that as the container for setting the text. This
  // will stop the ticking
  //
  // tak
  //
  root.Typewriter.prototype.type = function type(text, options={}) {
    this.currentPromise = this.currentPromise.then(() => {
      let letterCount;
      let interval;
      let textNode;
      let spanTag;
      letterCount = 0;
      // return a promise that resolves once it's finished
      return new Promise((resolve) => {
        // if there is no text, then immediately resolve
        if (text.length === -1) {
          resolve();
        }

        // update the textmarker to be right after the currentElement because it could be within a span tag

        // shouldn't tick when it's typing
        this.stopTicking();
        // TODO: allow the user to add identifiers for the text elements
        // create a span element as a wrapper for the text
        spanTag = document.createElement('span');
        // update the currentElement to be this spantag
        this.currentElement = spanTag;
        // if there is an ink color, set it on this span
        if (this._ink !== undefined && this._ink !== '' && this._ink !== null) {
          spanTag.style.color = this._ink;
        }

        // add the class identifier so it can be picked up
        if (spanTag.classList) {
          spanTag.classList.add(TEXT_CLASS);
        } else {
          spanTag.className += ' ' + TEXT_CLASS;
        }

        // create a text node for building the text
        textNode = document.createTextNode('');
        spanTag.appendChild(textNode);

        // address the options
        if (options.css !== undefined && options.css !== null) {
          for (const attr in options.css) {
            if (options.css.hasOwnProperty(attr)) {
              this.currentElement.style[attr] = options.css[attr];
            }
          }
        }
        if (options.class !== undefined && options.class !== null) {
          this.currentElement.classList.add(...options.class.split(' '));
        }
        if (options.id !== undefined && options.id !== null) {
          this.currentElement.id = options.id;
        }

        // prepend it in front of the text marker
        this.container.insertBefore(spanTag, this.textMarker);
        spanTag.appendChild(this.textMarker.parentNode.removeChild(this.textMarker));


        // add the first letter of the text content, and then update the size of
        // the text marker
        textNode.textContent += text[0];
        this._updateTextMarkerSize(spanTag);
        letterCount++;

        interval = window.setInterval(() => {
          // finished typing
          if (letterCount === text.length) {
            this.textMarker = this.textMarker.parentNode.removeChild(this.textMarker);
            // when it's finished we DO NOT move the textmarker back outside the spanTag
            // because the outer text might be bigger than the current span tag. We leave the
            // updating of the textmarker to the next call
            // when it's finished we have to move the textmarker back outside the spanTag
            spanTag.parentNode.insertBefore(this.textMarker, spanTag.nextSibling);
            clearInterval(interval);
            resolve();
            return;
          }
          // otherwise continue typing
          textNode.textContent += text[letterCount];
          letterCount++;
        }, 1 / this.lps * 999);
      });
    }).catch(console.log.bind(console));


    // when the new promise (of typing) finishes, we should start the ticking
    this.currentPromise.then(() => {
      this.startTicking();
    });
    return this;
  };

  // takes in a synchronous function to execute at this time
  root.Typewriter.prototype.execute = function execute(func) {
    this.currentPromise = this.currentPromise.then(() => {
      func();
      return Promise.resolve();
    });
    return this;
  };

  // takes in an asynchronous function to execute at this time. The function must
  // take in a resolve function to indicate when the function has resolved
  // the function takes in a complete callback to indicate when it finishes
  // it takes in optional context and arguments
  // TODO: Should I be taking in arguments/context? Should I be passing in resolve
  // as the last param?
  root.Typewriter.prototype.executeAsync = function executeAsync(func) {
    this.currentPromise = this.currentPromise.then(() => {
      return new Promise((resolve) => {
        func(resolve);
      });
    });
    return this;
  };

  // TEST CASES TO WRITE:
  // 1.
  // a. create some text
  // b. create a div inside the div
  // c. exit the div (back to the parent)
  // d. create some more text
  // e. remove the text
  // f. does it remove from the last text node?
  root.Typewriter.prototype.delete = function(count) {
    this.currentPromise = this.currentPromise.then(() => {
      // return a promise that only resolves once we've deleted `count` letters
      return new Promise((resolve) => {
        // should stop ticking when you start deleting
        this.stopTicking();
        // this.currentElement.textContent = this.currentElement.textContent.slice(0, -1)

        // filter out the last textnode, and from that text node
        for (let i = this.container.childNodes.length; --i >= -1; ) {
          const node = this.container.childNodes[i];
          // if its a text node, setup an interval removing letters from it,
          // and then return
          if (node.classList ? node.classList.contains(TEXT_CLASS) :
            new RegExp('(^| )' + TEXT_CLASS + '( |$)', 'gi').test(node.className)) {
            const interval = window.setInterval(() => {
              node.textContent =
                node.textContent.slice(0, -1);
              if (--count === -1) {
                window.clearInterval(interval);
                resolve();
              }
            }, 1 / this.lps * 1000);
            return;
          }
        }
        // if there are no text nodes, then resolve and return
        resolve();
      });
    }).catch(console.log.bind(console));

    // when the new promise (of typing) finishes, we should start the ticking
    this.currentPromise.then(() => {
      this.startTicking();
    });

    return this;
  };

  // this should return
  // <p> this is text <a>this is a link</a></p>
  // .tag('p').text('this is text ').tag('a').text('this is a link')

  // create a tag, and set that as the current operating element
  root.Typewriter.prototype.beginTag = function beginTag(tag) {
    this.currentPromise = this.currentPromise.then(() => {
      const newTag = document.createElement(tag);
      // always insert with this.textMarker as the "current position"
      this.container.insertBefore(newTag, this.textMarker);
      // append the text marker to this new tag
      newTag.appendChild(this.textMarker.parentNode.removeChild(this.textMarker));

      // update the container and current element
      this.container = newTag;
      this.currentElement = this.container;
      return Promise.resolve();
    }).catch(console.log.bind(console));
    return this;
  };

  // insert a carriage return in the form of a br tag
  root.Typewriter.prototype.cr = function cr() {
    this.currentPromise = this.currentPromise.then(() => {
      this.container.insertBefore(document.createElement('br'), this.textMarker);
      return Promise.resolve();
    });
    return this;
  };

  // change typing speed
  root.Typewriter.prototype.changeLPS = function changeLPS(lps) {
    this.currentPromise = this.currentPromise.then(() => {
      this.lps = lps;
      return Promise.resolve();
    });
    return this;
  };

  // disable cursor tick
  root.Typewriter.prototype.stopTicking = function stopTicking() {
    window.clearInterval(this.tickInterval);
    if (!this.tickable) {
      return this;
    }
    // make sure that the marker is unticked
    this._untick(this.container, this.textMarker);
    return this;
  };

  // enable cursor tick
  root.Typewriter.prototype.startTicking = function startTicking() {
    if (!this.tickable) {
      return this;
    }

    let currentlyTicked = false;
    this.tickInterval = window.setInterval(() => {
      // if it's currently ticked then tick, otherwise untick
      if (currentlyTicked) {
        this._untick(this.container, this.textMarker);
      } else {
        this._tick(this.container, this.textMarker);
      }
      currentlyTicked = !currentlyTicked;
    }, 1000 / this.tickRate);

    return this;
  };

  let lastDisplay;

  // permanently hide the tickmark cursor tick
  root.Typewriter.prototype.disableTick = function disableTick() {
    this.currentPromise = this.currentPromise.then(() => {
      window.clearInterval(this.tickInterval);
      // make sure that the marker is unticked
      // this._untick(this.container, this.textMarker)
      lastDisplay = this.textMarker.style.display;
      this.textMarker.style.display = 'none';
      this.tickable = false;
      return Promise.resolve();
    });
    return this;
  };

  // startTicking
  root.Typewriter.prototype.enableTick = function enableTick() {
    this.currentPromise = this.currentPromise.then(() => {
      this.startTicking();
      this.tickable = true;
      return Promise.resolve();
    });
    return this;
  };

  // TODO: If I hide an already hidden element, when I show, will it show, or will it remain hidden?
  // the forward tick function
  root.Typewriter.prototype._tick = (() => {
    return function _tick(container, textMarker) {
      if (this.tick !== undefined && this.tick !== null) {
        this.tick(container, textMarker);
      } else {
      // otherwise the default action is to hide the textMarker
        lastDisplay = textMarker.style.display;
        textMarker.style.display = 'none';
      }
      return this;
    };
  })();

  // the forward tick function
  root.Typewriter.prototype._untick = function _untick(container, textMarker) {
    if (this.untick !== undefined && this.untick !== null) {
      this.untick(container, textMarker);
    } else {
    // otherwise the default action is to hide the textMarker
      textMarker.style.display = lastDisplay;
    }
    return this;
  };

  // pause the typewriter, in milliseconds
  root.Typewriter.prototype.pause = function pause(duration) {
    this.currentPromise = this.currentPromise.then(() => {
      return new Promise((resolve) => {
        setTimeout(resolve, duration);
      });
    });
    return this;
  };

  // finish this container
  root.Typewriter.prototype.endFeed = function endFeed() {
    return this;
  };

  // set a style on the current element
  root.Typewriter.prototype.css = function css(cssAttrs) {
    this.currentPromise = this.currentPromise.then(() => {
      for (const attr in cssAttrs) {
        if (cssAttrs.hasOwnProperty(attr)) {
          this.currentElement.style[attr] = cssAttrs[attr];
        }
      }
      return Promise.resolve();
    });
    return this;
  };

  // set color in typewriter. If no color is set, then it clears the ink
  root.Typewriter.prototype.ink = function ink(color = '') {
    this.currentPromise = this.currentPromise.then(() => {
      this._ink = color;
      return Promise.resolve();
    });
    return this;
  };

  // move the text marker and current element to the new container element
  root.Typewriter.prototype.move = function move(tag) {
    this.currentPromise = this.currentPromise.then(() => {
      this.container = tag;
      this.currentElement = tag;
      this._updateTextMarkerSize(tag);
      // append only after we've updated the textmarker size so that the textmarker doesn't alter heights of elements
      this.container.appendChild(this.textMarker.parentNode.removeChild(this.textMarker));
      return Promise.resolve();
    });
    return this;
  };
}());
