const canvas = document.querySelector(".game_window");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
const anim = { time: 0, fps: 12, facing: "down" };
const headFrame = { sx: 8,  sy: 22, sw: 32, sh: 30 };   //coordinaten van het hoofd van isaac dat naar beneden kijkt

const heads = makeFrames(8, 22, 32, 30, 8, 40);
const walkSide = makeFrames(8, 120, 32, 20, 10, 32);
const headFor = { down: heads[0], right: heads[2], up: heads[4], left: heads[6] };//maakt een lijst van frames waar het hoofd naar een bepaalde kant kijkt

function makeFrames(sx, sy, sw, sh, count, step) {
    const frames = [];
    for (let i = 0; i < count; i++) { //doet voor elke frame 1 push naar de volgende sectie van de sprite sheet
        frames.push({ sx: sx + i * step, sy: sy, sw: sw, sh: sh });
    }
    return frames;
}

const walkDown = makeFrames(8, 76, 32, 20, 10, 32); //alle frames van de rij "Walk up/down"

const sprite = { x: 1589, y: 756, speed: 180, width: 32, height: 38 }; //speed = i pixels per seconde
const world = { width: 3210, height: 1550 };  
const camera = { x: 0, y: 0 };
const isaac = new Image();
const basement = new Image();
const tutorial = new Image();
isaac.src = "assets/isaac_sheet.png";
basement.src = "assets/basement.png"
tutorial.src = "assets/tutorial.png"

const border_top = 10;//pixels van de border van het scherm waar de muur is
const border_bottom = 20;//andere waarde voor onder kant en zijkanten
const border_x = 35;

const keys = {};
window.addEventListener("keydown", (e) => { keys[e.key] = true; });//trackt welke keys worden ingedrukt
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

function stop_on_edge() {
    sprite.x = Math.max(border_x, Math.min(world.width - sprite.width - border_x, sprite.x));//zorgt dat isaac stopt bij de muur
    sprite.y = Math.max(border_top, Math.min(world.height - sprite.height - border_bottom, sprite.y));
}

function drawIsaac() {  
    const horizontal = anim.facing === "left" || anim.facing === "right"; //kijkt of isaac opzij loopt
    const frames = horizontal ? walkSide : walkDown; //kiest de rij met frames die bij de richting past
    const index = Math.floor(anim.time * anim.fps) % frames.length; //welk frame nu getekend wordt
    const bodyFrame = frames[index];
    const headFrame = headFor[anim.facing]; //kiest het hoofd dat bij de richting past
    const x = Math.round(sprite.x); //afgeronde positie, zodat de pixels scherp blijven
    const y = Math.round(sprite.y);
    const bodyY = y + 19;

    ctx.save();
    if (anim.facing === "left") {
        ctx.translate(x + bodyFrame.sw, 0); //spiegelt de benen horizontaal
        ctx.scale(-1, 1);//flipt isaac
        ctx.drawImage(
            isaac,
            bodyFrame.sx, bodyFrame.sy, bodyFrame.sw, bodyFrame.sh,
            0, bodyY, bodyFrame.sw, bodyFrame.sh
        );
    } else {
        ctx.drawImage(
            isaac,
            bodyFrame.sx, bodyFrame.sy, bodyFrame.sw, bodyFrame.sh,
            x, bodyY, bodyFrame.sw, bodyFrame.sh
        );
    }
    ctx.restore();

    ctx.drawImage(
        isaac,
        headFrame.sx, headFrame.sy, headFrame.sw, headFrame.sh,
        x, y, headFrame.sw, headFrame.sh
    );
    
}

function update_camera() {
    camera.x = sprite.x + sprite.width / 2 - canvas.width / 2;// centered de camera altijd op isaac
    camera.y = sprite.y + sprite.height / 2 - canvas.height / 2;

    camera.x = Math.max(0, Math.min(world.width - canvas.width, camera.x));//laat niks zien buiten de wereld
    camera.y = Math.max(0, Math.min(world.height - canvas.height, camera.y));

    camera.x = Math.round(camera.x);   //rond de pixels af
    camera.y = Math.round(camera.y);
}

let moving = false;

function moveright(dt){ 
    sprite.x += sprite.speed * dt; anim.facing = "right"; moving = true; 
}

function moveleft(dt){  
    sprite.x -= sprite.speed * dt; anim.facing = "left"; moving = true; 
}

function moveup(dt){    
    sprite.y -= sprite.speed * dt; anim.facing = "up"; moving = true; 
}

function movedown(dt){
    sprite.y += sprite.speed * dt; anim.facing = "down"; moving = true; //prototype voor animatie
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);//alles dat hieronder staat beweegt met de camera!

    ctx.drawImage(basement, 0, 0, world.width, world.height);
    drawIsaac();

    ctx.restore();//alles dat hieronder staat beweegt NIET met de camera!
}

let lastTime = 0;
function loop(time) {
    const dt = Math.min((time - lastTime) / 1000, 0.05);  // seconde sinds de laatste frame
    lastTime = time;//zorgt ervoor dat de snelheid hetzelfde is no matter de fps

    moving = false; //begint elke frame opnieuw

    if (keys["a"]) moveleft(dt);
    if (keys["d"]) moveright(dt);
    if (keys["w"]) moveup(dt);
    if (keys["s"]) movedown(dt);

    if (moving) anim.time += dt; //de animatie timer loopt alleen tijdens het lopen
    else anim.time = 0; //stilstaan = terug naar het eerste frame

    stop_on_edge();
    update_camera();
    draw();

    requestAnimationFrame(loop);
}

isaac.onload = () => {
    requestAnimationFrame(loop);//loopt het elke keer dat de image laad
}