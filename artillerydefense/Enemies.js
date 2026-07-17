
// this file handlles the enemy spawning, moving and projectiles and explosions
// the projectiles and explosions work in the same way the player's do, except the angle is randomly chosen
// the enemies spawn at the edge of the screen, and move across slowly, their goal to reach the player, and some to shoot at them as well


const canvas = document.getElementById('screen');
let ctx = canvas.getContext('2d');
let enemies = []; //{x, y, cannon: bool, strong: bool}
let enemyProjectiles = [] //{x, y, xspeed, yspeed, termVel, ground}
let enemyExplosions = [];
const floor = 400;
let enemyDelay = 0;
const maxDelay = 400;
const groundLevel = 380; //constant for all enemies (all have 20px tall rect) & 50px long
const basicSpeed = 1;
const cannonSpeed = 0.5;
const gravity = 0.1
const termVel = 5;
const cooldownReset = 300;
const explosionSpeed = 2;
const fadeSpeed = 0.05;

function AdvanceEnemies(){
    for(const enemy of enemies){
        enemy.x -= enemy.speed;
    }
}

function DrawEnemies(){
    for(const enemy of enemies){
        if(enemy.destroyed == false && enemy.cannon == false){
            ctx.beginPath();
            ctx.fillStyle = 'rgb(150, 150, 150)';
            ctx.fillRect(enemy.x, enemy.y+15, 50, 15);
            ctx.save();
            ctx.translate(enemy.x, enemy.y + 15);
            ctx.moveTo(5, 0);
            ctx.lineTo(10, -15);
            ctx.lineTo(40, -15);
            ctx.lineTo(45, 0);
            ctx.fillStyle = 'darkgrey';
            ctx.fill();
            ctx.restore();
        }
        else if(enemy.destroyed == false && enemy.cannon == true){
            ctx.beginPath();
            ctx.save();
            ctx.translate(enemy.x + 25, enemy.y + 20);
            ctx.moveTo(0, 0);
            ctx.rotate(Math.PI + enemy.angle);
            ctx.strokeStyle = 'rgb(50, 50, 50)';
            ctx.lineWidth = 5;
            ctx.lineTo(35, 0);
            ctx.stroke();
            ctx.restore();

            ctx.beginPath();
            ctx.fillStyle = 'darkgrey';
            ctx.save();
            ctx.translate(enemy.x, enemy.y + 20)
            ctx.moveTo(0, 0);
            ctx.fillRect(0, 0, 50, 10);
            ctx.arc(25, 0, 20, 0, Math.PI, true);
            ctx.fill();
            ctx.restore();
        }
    }

}

function DisplayEnemyHealth(){
    for(const enemy of enemies){
        if(enemy.destroyed == false){
            ctx.beginPath();
            ctx.font = 'bold 20px serif';
            ctx.fillStyle = 'white';
            ctx.fillText(`${enemy.health}`, enemy.x + 21, enemy.y + 50);
        }
    }
}

function SpawnEnemy(){
    let speed;

    if(enemyDelay <= 0){
        enemyDelay = Math.floor(Math.random() * (300 - 200 + 1) + 200); //spawn rate of enemies (between 200 and 300)

        //1 in 3 chance for cannon enemy
        if(Math.floor(Math.random() * 3) == 1){
            speed = Math.random() * (0.7 - 0.3 + 1) + 0.3; //Random speed between 0.3 & 0.7 px (cannon)
            enemies.push({x: document.body.clientWidth, y: 370, cannon: true, health: 2, destroyed: false, speed, cooldown: cooldownReset, angle: 0.1});
        }
        else{
            speed = Math.random() * (1.2 - 0.8 + 1) + 0.8; //Random speed between 1.2 & 0.8 px (basic)
            enemies.push({x: document.body.clientWidth, y: 370, cannon: false, health: 1, destroyed: false, speed});
        }

        //1 in 15 chance for strong enemy (add 2 to health)
        if(Math.floor(Math.random() * 15) == 1){
            enemies[enemies.length-1].health += 2;
        }
    }
    else{
        enemyDelay -= 1 //Decreases timer to next enemy spawn
    }
}

function EnemyFire(fireangle, fireSpeed){
    for(const enemy of enemies){
        if(enemy.cooldown <= 0 && enemy.cannon == true && enemy.destroyed == false){
            enemy.angle = fireangle;
            enemyProjectiles.push({x: enemy.x, y: enemy.y, xSpeed: fireSpeed * Math.cos(enemy.angle), ySpeed: fireSpeed * Math.sin(enemy.angle), termVel, ground: false});
            enemy.cooldown = cooldownReset
        }
        else if(enemy.cannon == true){
            enemy.cooldown -= 1;
        }
        }
}

function UpdateEnemyProjectiles(){
    for(const proj of enemyProjectiles){
        proj.x -= proj.xSpeed;
        proj.y -= proj.ySpeed;
        proj.ySpeed -= gravity;

        if(proj.y > 400){
            proj.ground = true;
        }

        if(proj.ground){
            enemyExplosions.push({x: proj.x, y: proj.y, radius: 5, alpha: 1, finished: false})
        }
    }
    enemyExplosions = enemyExplosions.filter(exp => !exp.finished);
}

function DrawEnemyProjectiles(){
    for(const proj of enemyProjectiles){
        if(proj.ground == false){
            ctx.beginPath();
            ctx.fillStyle = 'gray';
            ctx.arc(proj.x, proj.y, 5, 0, 2 * Math.PI);
            ctx.fill();
            }
    }
}

function UpdateEnemyExplosions(){
    for(const explosion of enemyExplosions){
        explosion.alpha -= fadeSpeed;
        explosion.radius += explosionSpeed;

        if(explosion.alpha <= 0){
            explosion.finished = true;
        }
    }

    enemyExplosions = enemyExplosions.filter(exp => !exp.finished);
} 

function DrawEnemyExplosions(){
    for(const explosion of enemyExplosions){
        if(explosion.finished == false){
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 165, 0, ${explosion.alpha})`;
            ctx.arc(explosion.x, explosion.y, explosion.radius, 0, 2*Math.PI);
            ctx.fill();
        }
    }
}

function GetEnemies(){
    return enemies;
}

function GetEnemyProjectiles(){
    return enemyProjectiles;
}

function EnemyControl(){
    SpawnEnemy();
    AdvanceEnemies();
    DrawEnemies();
    UpdateEnemyProjectiles();
    DrawEnemyProjectiles();
    UpdateEnemyExplosions();
    DrawEnemyExplosions();
    let angle = Math.random() * (1.22 - 0.17) + 0.17;
    EnemyFire(angle, 10);
}

export {EnemyControl, GetEnemies, GetEnemyProjectiles, DisplayEnemyHealth};