document.addEventListener("DOMContentLoaded", function(event) {
  var t = new Typewriter({
    lps: 20,
    container: document.getElementById('test')
  });

  t.type('i\'m typing like a noob')
    .pause(3000)
    .beginTag('span')
    .type('this text should be way bigger just so you know')
})
