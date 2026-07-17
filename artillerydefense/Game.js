import { CannonControl, GetElevation, GetBarrelLength, DisplayPlayerHealth } from "./Cannon.js";
import { ProjectileControl, FireCannon, GetShellType } from "./Projectiles.js";
import { EnemyControl, DisplayEnemyHealth } from "./Enemies.js";
import { PlayerHitEnemy, EnemyHitPlayer, DisplayScore } from "./EnemyPlayerHit.js";
import { DrawScene, CreateClouds } from "./Environment.js";


//What the game is:
// The player controls a cannon to shoot to incoming enemies using projectiles affected by gravity.
// There are different shell types that the player can choose from and can also change the elevation of the turret
// Each file will have a commented section explaining how they work


//The game file:
// This file imports all other files and uses their functions to create the game loop using animation frames


//Context and Canvas//
const canvas = document.getElementById('screen');
let ctx = canvas.getContext('2d');
canvas.width = document.body.clientWidth;

//Variables//
let cannonCooldown = 0;
const cooldownMax = 50;
const cooldownDisplay = document.getElementById('cooldown');
const shellSelection = document.getElementById('shellSelection');
const elevationDisplay = document.getElementById('elevation');
const playButton = document.getElementById('start');
const resetButton = document.getElementById('refresh');
let gameLoop = false;
let lose = false;
const cloudCover = Math.floor(Math.random() * (250 - 50 + 1) + 50)

//Clouds//
CreateClouds(cloudCover)

function Frame(){
    
    ctx.reset();

    if(gameLoop && !lose){
        EnemyControl();
        CannonControl();
        ProjectileControl();
        PlayerHitEnemy();
        lose = EnemyHitPlayer();

        if(cannonCooldown > 0){
            cannonCooldown -= 1;
            cooldownDisplay.innerHTML = `Reloading... (${cannonCooldown})`
        }
        else{
            cooldownDisplay.innerHTML = 'Reloaded!'
        }
    
        elevationDisplay.innerHTML = `Current Elevation: ↑${Math.round(GetElevation() * (180/ Math.PI))}°↓`
        const shell = GetShellType();
        switch(shell){
            case 'Kinetic':
                shellSelection.innerHTML = 'Current Shell: ← Short / [Medium] / Tracer / Long →';
                break;
            case 'HE':
                shellSelection.innerHTML = 'Current Shell: ← [Short] / Medium / Tracer / Long →';
                break;
            case 'AP':
                shellSelection.innerHTML = 'Current Shell: ← Short / Medium / Tracer / [Long] →';
                break;
            case 'Tracer':
                shellSelection.innerHTML = 'Current Shell: ← Short / Medium / [Tracer] / Long →';
        }
    }

    //Environment//
    DrawScene();
    
    if(gameLoop && !lose){
        DisplayEnemyHealth();
        DisplayPlayerHealth();
    }
    
    if(!gameLoop){  //controls list
        ctx.beginPath();
        ctx.font = 'bold 40px serif';
        ctx.fillStyle = 'black'
        ctx.fillText('Controls:', 10, 100);
        ctx.fillText('Elevation: [Up/Down] [w/s]', 10, 150);
        ctx.fillText('Cycle shells: [Left/Right] [q/e]', 10, 200);
        ctx.fillText('Fire Shell: [space]', 10, 250)

    }

    DisplayScore();

    requestAnimationFrame(Frame);
}

window.addEventListener('keydown', ev =>{   //fire cannon
    switch(ev.key){
        case ' ':
            if(cannonCooldown == 0){
                FireCannon(GetElevation(), GetBarrelLength());
                cannonCooldown = cooldownMax;
            }
            break;
    }
})

playButton.addEventListener('click', () => {gameLoop = true}); //start
resetButton.addEventListener('click', () => {window.location.reload()}); //reset

requestAnimationFrame(Frame);
