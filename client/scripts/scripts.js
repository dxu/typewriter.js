document.addEventListener("DOMContentLoaded", function(event) {
  var t = new Typewriter({
    lps: 60,
    container: document.getElementById('test')
  });

  console.log('rwr', t.textMarker, t.textMarker.parentNode)

  t.type('i\'m typing like a noob')
    .pause(0)
    .cr()
    .beginTag('span')
    .css(
      {'font-size': '100px'}
    )
    .ink('#BABABA')
    .type('this text should be way bigger just so you know')
    .changeLPS(10)
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
      }, 1000)
    })
    .changeLPS(1)
    .enableTick()
    .ink()
    .type(' here\'s some more big text but not as big',
      {
        css: {
          'font-size': '45px'
        },
        class: 'testName testName2',
        id: 'test1id'
      })
    .move(document.getElementById('test2'))
})
