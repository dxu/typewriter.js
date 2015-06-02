document.addEventListener("DOMContentLoaded", function(event) {
  var t = new Typewriter({
    lps: 20,
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
    .delete(1)
    .disableTick()
    .pause(10000)
    .execute(function(){
      console.log('this is inside a synchronous function!')
    })
    .delete(2)
    .pause(1000)
    .executeAsync(function(resolve){
      setTimeout(function(){
        console.log('this is inside an asynchronous setTimeout!')
        resolve()
      }, 3000)
    })
    .delete(3)
    .pause(1000)
    .delete(4)
    .pause(5000)
    .changeLPS(6)
    .enableTick()
    .type(' here\'s some more big text')
})
