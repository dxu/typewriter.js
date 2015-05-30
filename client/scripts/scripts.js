document.addEventListener("DOMContentLoaded", function(event) {
  var t = new Typewriter({
    lps: 60,
    container: document.getElementById('test')
  });

  console.log('rwr', t.textMarker, t.textMarker.parentNode)

  t.type('i\'m typing like a noob')
    .pause(0)
    .cr()
    .changeLPS(20)
    .beginTag('span')
    .type('this text should be way bigger just so you know')
    .changeLPS(3)
    .delete(4)
    .pause(1000)
    .changeLPS(60)
    .type(' here\'s some more big text')
})
