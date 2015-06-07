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
    .css(
      {'font-size': '100px'}
    )
    .ink('#BABABA')
    .type('this text should be way bigger just so you know',
      {
        css: {
          'font-size': '45px'
        },
        class: 'testName',
        id: 'test1id'
      }
     )
    .changeLPS(3)
    .delete(1)
    .disableTick()
    .execute(function(){
      console.log('this is inside a synchronous function!')
    })
    .delete(2)
    .executeAsync(function(resolve){
      setTimeout(function(){
        console.log('this is inside an asynchronous setTimeout!')
        resolve()
      }, 3000)
    })
    .delete(3)
    .pause(1000)
    .delete(4)
    .pause(1000)
    .changeLPS(6)
    .enableTick()
    .ink()
    .type(' here\'s some more big text')
})
