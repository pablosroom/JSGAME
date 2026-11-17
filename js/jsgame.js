const canvas = document.querySelector(".game_window");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
const sprite = { x: 300, y: 175, speed: 3, width: 40, height: 40 };
const isaac = new Image();
const basement = new Image();
isaac.src = "assets/isaac.png";
basement.src = "assets/basement.png"


const keys = {};
window.addEventListener("keydown", (e) => { keys[e.key] = true; });//trackt welke keys worden ingedrukt
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

function moveright(){
    sprite.x += sprite.speed; //beweegt met elke frame
}

function moveleft(){
    sprite.x -= sprite.speed; 
}

function moveup(){
    sprite.y -= sprite.speed; 
}

function movedown(){
    sprite.y += sprite.speed; 
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(basement, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(isaac, sprite.x, sprite.y, sprite.width, sprite.height); //update isaac locatie
}

function loop() {
    if (keys["a"])  moveleft();
    if (keys["d"]) moveright();
    if (keys["w"])    moveup();
    if (keys["s"])  movedown();
    draw();
    requestAnimationFrame(loop);
}

isaac.onload = () => {
    sprite.height = sprite.width * (isaac.naturalHeight / isaac.naturalWidth);//zorgt ervoor dat de size hetzelfde blijft als de png zelf
    loop();//loopt het elke keer dat de image laad
}