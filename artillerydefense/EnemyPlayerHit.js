
import { GetEnemies, GetEnemyProjectiles } from "./Enemies.js";
import { GetPlayerProjectiles } from "./Projectiles.js";

// this file handles the hitboxes and collisions for both the player and enemies
// the centres of the projectiles are checked to see if they fall in the range of the x and coordinates of enemies and the player to detect if they hit
// the player health is also stored and altered here

const canvas = document.getElementById('screen');
let ctx = canvas.getContext('2d');
const playerPosition = {x: 10, y: 380, width: 80, height: 20};
let playerHealth = 3;
let score = 0;

function PlayerHitEnemy(){
    let enemies = GetEnemies();
    const playerProjectiles = GetPlayerProjectiles();
    let xCheck = false;
    let yCheck = false;

    for(const proj of playerProjectiles){
        for(const enemy of enemies){
            if(proj.x >= enemy.x && proj.x <= enemy.x + 50 && proj.shell != 'tracer' && enemy.destroyed == false){  //checks x bounds and shell type 50px width
                xCheck = true;
            }
            if(proj.y <= 400 && proj.y >= enemy.y){  //checks y bounds 30px height
                yCheck = true;
            }
            if(xCheck && yCheck){ //if proj is within x and y range
                enemy.health -= 1;
                proj.ground = true;

                if(enemy.health == 0){
                    score += (enemy.cannon) ? 2 : 1;
                    enemy.destroyed = true;
                }
            }
            xCheck = false;
            yCheck = false;
        }

        enemies = enemies.filter(enemy => enemy.destroyed);
    }

    return enemies;
}

function EnemyHitPlayer(){
    let enemies = GetEnemies();
    let enemyProjectiles = GetEnemyProjectiles();
    
    for(const enemy of enemies){ //enemy reaching player
        if(enemy.x < 90 && enemy.destroyed == false){   //90 is where edge of player base is
            playerHealth -= 1;
            enemy.destroyed = true;
        }
    }

    for(const proj of enemyProjectiles){ //projectiles from enemy tanks/cannons
        if(proj.x < 80 && proj.x > 10 && proj.y < 400 && proj.y > 350 && proj.ground == false){//10 -> 80 x    350 -> 400 y
            playerHealth -= 1;
            proj.ground = true;
        }
    }

    enemies = enemies.filter(enemy => !enemy.destroyed);
    enemyProjectiles = enemyProjectiles.filter(proj => !proj.ground);

    if(playerHealth == 0){
        return true; //player loses
    }
    else{
        return false; //not player loss (yet)
    }


}

function DisplayScore(){
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.font = 'bold 25px serif'
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function CheckLose(){
    if(playerHealth == 0){
        return true;
    }
    else{
        return false
    }
}

function GetPlayerHealth(){
    return playerHealth;
}

export {PlayerHitEnemy, EnemyHitPlayer, GetPlayerHealth, DisplayScore}