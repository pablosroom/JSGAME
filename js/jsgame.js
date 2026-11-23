const canvas = document.querySelector(".game_window");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
const headFrame = { sx: 8,  sy: 22, sw: 32, sh: 30 };   //coordinaten van het hoofd van isaac dat naar beneden kijkt
const bodyFrame = { sx: 8,  sy: 76, sw: 32, sh: 20 }; //benen naar beneden
const sprite = { x: 215, y: 175, speed: 3, width: 30, height: 30 };
const isaac = new Image();
const basement = new Image();
const tutorial = new Image();
isaac.src = "assets/isaac_sheet.png";
basement.src = "assets/basement.png"
tutorial.src = "assets/tutorial.png"

const border_top = 30;//pixels van de border van het scherm waar de muur is
const border_bottom = 50;//andere waarde voor onder kant en zijkanten
const border_x = 40;

const keys = {};
window.addEventListener("keydown", (e) => { keys[e.key] = true; });//trackt welke keys worden ingedrukt
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

function drawIsaac() {  
    const bodyY = sprite.y + 19;

    ctx.drawImage(
        isaac,
        bodyFrame.sx, bodyFrame.sy, bodyFrame.sw, bodyFrame.sh,
        sprite.x, bodyY, bodyFrame.sw, bodyFrame.sh
    );

    ctx.drawImage(
        isaac,
        headFrame.sx, headFrame.sy, headFrame.sw, headFrame.sh,
        sprite.x, sprite.y, headFrame.sw, headFrame.sh
    );
}

function stop_on_edge() {
    sprite.x = Math.max(border_x, Math.min(canvas.width - sprite.width - border_x, sprite.x));//zorgt dat isaac stopt bij de muur
    sprite.y = Math.max(border_top, Math.min(canvas.height - sprite.height - border_bottom, sprite.y));//zorgt dat er verschillende lengtes van de muur worden bijgehouden voor elke muur (boven en onder)
}

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

    const tx = (canvas.width - tutorial.naturalWidth) / 2;
    const ty = (canvas.height - tutorial.naturalHeight) / 2;//zet de coords van de tutorial in het midden van de canvas
    ctx.drawImage(tutorial, tx, ty);

    drawIsaac();
}

function loop() {
    if (keys["a"])  moveleft();
    if (keys["d"]) moveright();
    if (keys["w"])    moveup();
    if (keys["s"])  movedown();
    stop_on_edge()
    draw();
    requestAnimationFrame(loop);//start de animatie loop
}

isaac.onload = () => {
    loop();//loopt het elke keer dat de image laad
}