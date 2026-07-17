
// this file only draws the clouds and grass for the game
// the clouds are randomly sized and places across the screen, so there are different clouds each time the player resets the game


const canvas = document.getElementById('screen');
let ctx = canvas.getContext('2d');
let clouds = [] //{x, y, radius}

function DrawGrass(){
    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 400, document.body.clientWidth, 100);
}

function CreateClouds(amount){
    for(let i = 0; i < amount; i++){
        clouds.push({x: Math.floor(Math.random() * (document.body.clientWidth - 0 + 1)) + 0, y: Math.floor(Math.random() * (300 - 10 + 1)) + 10, radius: Math.floor(Math.random() * (40 - 10 + 1)) + 10})
    }
}

function DrawClouds(){
    for(const cloud of clouds){
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.save();
        ctx.translate(cloud.x, cloud.y);
        ctx.arc(0, 0, cloud.radius, 0, 2*Math.PI);
        ctx.arc(0 - cloud.radius, 0, (3/4) * cloud.radius, 0, 2*Math.PI);
        ctx.arc(0 + cloud.radius, 0, (3/4) * cloud.radius, 0, 2*Math.PI);
        ctx.fill();
        ctx.restore();

    }
}

function DrawScene(){
    DrawGrass();
    DrawClouds();
}

export{CreateClouds, DrawScene};