/*
  the Balls' basic function comes from: https://thimbleprojects.org/mfoucault/230435/
  
  the Paddles' basic functionality and input comes from: https://thimbleprojects.org/mfoucault/230435/
*/

$(document).ready(function() {
  
  $("#Start").click(function() {
    window.requestAnimationFrame(draw)
  });
  //checks if the key is pressed sown or if it is released
  $(window).keydown(function(event){
    keys[event.key] = true
  })

  $(window).keyup(function(event){
    delete keys[event.key]
  })
})


var obj = {
  "Germany": ["Bauhaus", "Jugendstil", "Neue Sachlichkeit", "Dachshund", "German Shepherd", "Oktoberfest"],
  "France" : ["Eiffel Tower", "Mona Lisa", "Notre Dame", "Paris", "Cognac", "Oliver Giroud", "Bastille Day"],
  "England": ["The Beatles", "Big Ben", "James Bond", "Cricket", "Football"],
  "Italy": ["Leonardo da Vinci", "Fibonacci", "Ferragosto", "Pizza", "Espresso"],
  "Romania": ["Papanasi", "Toba", "Hotel Translyvania"],
  "South Africa": ["Nelson Mandela", "Apartheid", "Trevor Noah", "Desmond Tutu", "Capetown"],
  "Brazil": ["Neymar", "Rio De Janeiro", "World Cup Soccer"]
}

//alert(String.fromCharCode(evt.keyCode));

var countries = []
for (var o in obj) { countries.push(o); }

var tog_disp = 0
var offset = 0 
//Variables for game:
var lives = 4
var timeBefore = undefined
var rightPressed = false
var leftPressed = false
//creates new paddle controled by variables
var paddle = new Paddle('ArrowRight', 'ArrowLeft')
var keys = {}
//brick stuff
var bCount = 0
var win = 32
var total = 0
var dificulty = 0.15

/*
var Germany = ["","","","",""]

*/

function draw(time){
  // sets up ctx variable
  if(lives!=0){
  if (timeBefore !== undefined){  
    var dTime = time - timeBefore
    var ctx = document.getElementById('canvas').getContext('2d')
    ctx.fillStyle = 'rgba(29, 0, 255, 0.7)'//0.7 clears .7 of                             the layer to create trailing efect
    ctx.fillRect(0,0,500,300)//match canvas size
    ctx.fillStyle = 'black'

    //save canvas
    ctx.save()
    //run looped functions in here
    
    ball.updatePostion(dTime)
    ball.draw(ctx)
    paddle.updatePosition(dTime)
    paddle.checkBounce()
    paddle.draw(ctx)
    drawAll(ctx)
    if(win==0){
      reset()
    }
    
   // create.draw(ctx)
    ctx.restore // resets the loop
  }
  
  timeBefore = time 
  window.requestAnimationFrame(draw)
  }
  if(lives == 0){
    document.getElementById("lose").style.visibility= 'visible' 
  }
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function plusOrMinusOne() {
  return Math.random() < 0.5 ? -1 : 1
}

var ball = {
  x: paddle.x,
  y: paddle.y,
  vx: plusOrMinusOne()*dificulty,
  vy: plusOrMinusOne()*dificulty,
  radius: 10,
  draw: function(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fill()
  },
  
  updatePostion: function(dTime){
    //moves postion by multipling vx by dTime creating a constantly moving variable
    this.x = this.x + this.vx*dTime
    this.y = this.y + this.vy*dTime
    this.checkBoarderCollision()
  },

  checkBoarderCollision: function(){
    //checks if its equal to wall if so reverses velocity
    //checks bottom
    if(this.y+this.radius>= canvas.height){
      this.x = paddle.x + 25
      this.y = paddle.y - 10
      lives --
      document.getElementById("lives").innerHTML = (lives);
      
    }
    //checks top
    if(this.y-this.radius<= 0){
      this.vy = Math.abs(this.vy)}
    //checks right
    if(this.x+this.radius>= canvas.width){
      this.vx = -Math.abs(this.vx)  
    }
    //checks left
    if(this.x-this.radius<= 0){
      this.vx = Math.abs(this.vx)}
  }
}

function Paddle(rightKey, leftKey) {
  //sets position
  this.y = 290
  this.x = 250
  //sets keys
  this.rightKey = rightKey
  this.leftKey = leftKey

  this.updatePosition = function(dTime) {

   if (keys[this.rightKey]) {
      this.x = Math.min(450, this.x + 0.3 * dTime )
    }
    if (keys[this.leftKey]) {
      this.x = Math.max(0, this.x - 0.3 * dTime)
    }
    
  }

  
  this.draw = function(ctx){
    ctx.fillRect(this.x,this.y,50,10)
  }
  this.checkBounce = function(){
    if(ball.y+ball.radius>= 290 && (ball.x + ball.radius >this.x) && (ball.x - ball.radius< this.x+5)){
      if(ball.vx>0){
        ball.vx = 0.10
        ball.vy = -0.17
      }else{
        ball.vx = -0.17
        ball.vy = -0.10
      }
    }
    if(ball.y+ball.radius>= 290 && (ball.x + ball.radius >this.x+6) && (ball.x - ball.radius< this.x+44)){
      if(ball.vx>0){
        ball.vx = 0.15
        ball.vy = -0.15
      }else{
        ball.vx = -0.15
        ball.vy = -0.15
      }
    }
    if(ball.y+ball.radius>= 290 && (ball.x + ball.radius >this.x+45) && (ball.x - ball.radius< this.x+50)){
      ball.vy = -Math.abs(ball.vy)
      if(ball.vx>0){
        ball.vx = 0.17
        ball.vy = -0.10
      }else{
        ball.vx = -0.10
        ball.vy = -0.17
      }
    }
  }
}

    
var b = []
for(var r=0; r<4; r++){
  for(var c=0; c<8; c++){
    b.push(new Brick(10+(60*c),10+(30*r),1,"hello world")); 
    }
}

function Text(x,y,text,country,hit,disp,disp_cnt) {
  this.x = x
  this.y = y
  this.country = country
  this.text = text
  this.disp = 0
  this.disp_count = 0
  this.hit = hit
  this.disp = disp
  this.disp_cnt = disp_cnt
  
  this.draw = function(ctx) {
    // if((this.hit == 0) && (this.disp == 1) && (this.disp_cnt < 60)) {
      this.disp_cnt++
      ctx.font = "20px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(this.text, 200 , this.y)
    
      // prompt("Is this 1 or 2?")
    // }
  }  
}

function Brick(x,y,hit,text){
  this.x = x
  this.y = y
  this.country = countries[Math.abs(Math.floor(Math.random() * countries.length - 1))]
  this.text = obj[this.country][Math.abs(Math.floor(Math.random() * obj[this.country].length - 1))]
  var tiers = [0,1,2]
  var randomOffsett_x = tiers[Math.floor(Math.random() * 2)] * 100
  var randomOffsett_y = tiers[Math.floor(Math.random() * 2)] * 100
  offset = (offset + 1) % 3
  this.textobj = new Text(this.x, this.y + (offset * 100), this.text, this.country, this.hit, this.disp, this.disp_cnt)
  this.hit = hit
  this.disp = 0
  this.disp_cnt = 0

  this.draw = function(ctx){
    
    if(this.hit == 1){
      ctx.fillStyle = '#000000'
      ctx.rect(this.x,this.y,55,25)
      ctx.fill()
      this.checkHit()
    }

    if((this.hit == 0) && (this.disp == 1) && (this.disp_cnt < 60)) {
      this.disp_cnt++
       this.textobj.draw(ctx)
    }
    
    }
  
  this.checkHit = function(){
    
    if((ball.x + 10)>(this.x) && (ball.x - 10)<(this.x + 55) && ball.y + 10>this.y && ball.y - 10<(this.y+25)){
     win--
     total = total + 250
     document.getElementById("insert").innerHTML = total;
     
   // if the ball hits the brick from the bottom, delete the brick and bounce back down
      if((ball.y - 10)<(this.y+25)&&(ball.y - 10)>(this.y+20)){
       ball.vy = Math.abs(ball.vy)
       this.hit--
       this.disp++
       return
     }
      if((ball.x + 10)>(this.x) && (ball.x + 10)<(this.x+5)){
        ball.vx = -Math.abs(ball.vx)
        this.hit--
        this.disp++
        return
      }
      if((ball.y + 10)>(this.y) && (ball.y + 10)<(this.y+5)){
        ball.vy = -Math.abs(ball.vy)
        this.hit--
        this.disp++
        return
      }
      if((ball.x - 10)<(this.x+55)&&(ball.x - 10)>(this.x+50)){
       ball.vx = Math.abs(ball.vx)
       this.hit--
       this.disp++
       return
     }


    }
  }
    
  }

function reset(){
  for(var i=0; i<32;i++){
   b[i].hit = 1
  }
  
  
  win = 32
  ball.x = paddle.x + 25
  ball.y = paddle.y  
  
  dificulty = dificulty + 0.05
}




function drawAll(ctx){
  b[0].draw(ctx)
  b[1].draw(ctx)
  b[2].draw(ctx)
  b[3].draw(ctx)
  b[4].draw(ctx)
  b[5].draw(ctx)
  b[6].draw(ctx)
  b[7].draw(ctx)
  b[8].draw(ctx)
  b[9].draw(ctx)
  b[10].draw(ctx)
  b[11].draw(ctx)
  b[12].draw(ctx)
  b[13].draw(ctx)
  b[14].draw(ctx)
  b[15].draw(ctx)
  b[16].draw(ctx)
  b[17].draw(ctx)
  b[18].draw(ctx)
  b[19].draw(ctx)
  b[20].draw(ctx)
  b[21].draw(ctx)
  b[22].draw(ctx)
  b[23].draw(ctx)
  b[24].draw(ctx)
  b[25].draw(ctx)
  b[26].draw(ctx)
  b[27].draw(ctx)
  b[28].draw(ctx)
  b[29].draw(ctx)
  b[30].draw(ctx)
  b[31].draw(ctx)
}


 
  









  
  
  
  
  
  
  
  
  
  
  
  