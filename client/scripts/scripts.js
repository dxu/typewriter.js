document.addEventListener("DOMContentLoaded", function(event) {
  var t = new Typewriter({
    lps: 10,
    container: document.getElementById('test')
  });

  t.type('i\'m typing like a noob')
    .pause(1000)
    .cr()
    .changeLPS(60)
    .beginTag('span')
    .type('this text should be way bigger just so you know')
})
