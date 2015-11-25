var img
 , wineImg
 , pizzaAngle =0
 , canvas = document.getElementById("canvaslogo")
 , canvasWidth = 300
 , canvasHeight = 300

function setup(){

  createCanvas(300,300);
  beerImg = loadImage("images/beer.png");
   coffeeImg = loadImage("images/coffee-cup.png");
   cookieImg = loadImage("images/cookie.png");
  angleMode(DEGREES)
}
function draw(){
  background(128);
  pizzaAngle += 1
  push();
  translate((canvasWidth/2),(canvasHeight/2));
  //  rotate(pizzaAngle);
  textSize(32);
   text("C", 10, 30);
  fill(0, 0, 0, 0);
   image(beerImg, 0, 100, 50, 50);
   image(coffeeImg, -0, 85 , 50, 50);
   image(cookieImg, -0, 60 , 50, 50)
  pop();
}
