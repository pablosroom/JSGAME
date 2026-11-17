const canvas = document.querySelector(".game_window");
const ctx = canvas.getContext("2d");
const sprite = { x: 300, y: 175, speed: 2, size: 32 };
const img = new Image();
img.src = "assets/isaac.png";

function move(){
    sprite.x += sprite.speed; //beweegt met elke frame
    if (sprite.x > canvas.width) sprite.x = -sprite.size; //beweegt door aan de andere kant
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.drawImage(img, sprite.x, sprite.y, sprite.size, sprite.size); //update isaac locatie
}

function loop() {
    move();
    draw();
    requestAnimationFrame(loop);
}

img.onload = () => loop();//loopt het elke keer dat de image laad