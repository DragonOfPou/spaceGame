const { ['log']: c } = console;

import Player from "./components/Player.js"
import Projectile from "./components/Projectile.js"
//import Enemy from "./components/Enemy.js"
import {Enemy, BossEnemy} from "./components/Enemy.js"

var ingameMusic = new Audio('./assets/sounds/ingame.mp3');
ingameMusic.loop = true
ingameMusic.volume = 0.2

const volSlider = document.getElementById("myVol");
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const scoreElement = document.getElementById("scoreElement")
const startButton = document.getElementById("start")
const scoreDisplay = document.getElementById("scoreDisplay")
const scoreAfter = document.getElementById("scoreAfter")
const speed = document.getElementById("speed")
const pause = document.getElementById("pause")
const highscores = document.getElementById("highscores")
const highscoresWrap = document.getElementById("highscoresWrap")
let score = 0
var gameIsRunning = false
var rotation = 0
var player

const shot1 = document.getElementById('shot1');
const shot2 = document.getElementById('shot2');
const shot3 = document.getElementById('shot3');
const shot4 = document.getElementById('shot4');
const shot5 = document.getElementById('shot5');
const damageUp = document.getElementById('damageUp');

const model1 = document.getElementById("model1")
const model2 = document.getElementById("model2")
const model3 = document.getElementById("model3")                            
const playerModel = model2

canvas.width = innerWidth;
canvas.height = innerHeight;
var highscoresArray = JSON.parse("[" + localStorage.getItem("highscoreList") + "]")
if(highscoresArray[0] <= 0) {highscoresArray[0] = [0]}


const centerX = canvas.width / 2
const centerY = canvas.height / 2
let interval
let projectiles = []
let enemies = []
let powerups = []
let scoreString = highscoresArray.join()
highscores.innerHTML = scoreString.replaceAll(",", "<br>")

function init() {
    scoreDisplay.style.display = "none"
    highscoresWrap.style.display = "none"
    gameIsRunning = true
    player = new Player(centerX, centerY, 30, 150, 10, 6, 4, 1)

    projectiles = []
    enemies = []
    powerups= []
    score = 0
    interval = 2000
    scoreAfter.innerHTML = 0
    scoreElement.innerHTML = 0
    speed.innerHTML = 0
    ingameMusic.play()
    guiHealth.style.width = `${player.health / player.maxHealth * 100}%`
    guiHealth.style.background = `hsl(${(player.health / player.maxHealth * 120)}, 100%, 50%)`
    guiHealthBackground.style.background = `hsl(${(player.health / player.maxHealth * 120)}, 100%, 20%)`
    guiHealthNumber.innerHTML = `${player.health} / ${player.maxHealth}`
}

let intervalTimer

function spawnEnemies() {

    clearInterval(intervalTimer)

    intervalTimer = setInterval(() => { 

        speed.innerHTML = interval       
        //interval -= 400

        const radius = Math.random() * (20 - 10) + 10
        const enemyHealthValue = Math.random() * (8 - 1) + 1 + score/1000
        let x
        let y

        if(Math.random() < 0.5){
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }

        const color = `hsl(${Math.random() * 360}, 50%, 50%)`

        var angle = Math.atan2(player.y - y, player.x - x)

        var velocityFactor = Math.random() * (3-1) + 1

        const velocity = {
            x: Math.cos(angle) * velocityFactor,
            y: Math.sin(angle) * velocityFactor
        }

        if(Math.random() < 0.9){
            enemies.push(new Enemy(x, y, radius, enemyHealthValue, color, velocity))
        } else{
            enemies.push(new BossEnemy(x, y, radius, enemyHealthValue, color, velocity))
        }

    }, interval)
}

let animationId
const guiDamage = document.getElementById("damage")
const guiShotSpeed = document.getElementById("shotSpeed")
const guiMovementSpeed = document.getElementById("movementSpeed")
const guiProjectileSpeed = document.getElementById("projectileSpeed")
const guiHealth = document.getElementById("health")
const guiHealthBackground = document.getElementById("healthBackground")
const guiHealthNumber = document.getElementById("healthNumber")

var lastLoop = new Date()
let backgroundAnimation = 0
let backgroundA = 0
const image = document.getElementById('background')

function animate() {
    animationId = requestAnimationFrame(animate)
    var thisLoop = new Date()
    var fps = 1000 / (thisLoop - lastLoop)
    lastLoop = thisLoop
    //console.log(fps)

    guiDamage.innerHTML = player.damage
    guiShotSpeed.innerHTML = player.shotSpeed
    guiMovementSpeed.innerHTML = player.movementSpeed
    guiProjectileSpeed.innerHTML = player.projectileSpeed
    guiDamage.value = player.damage
    rotation += Math.PI*100

    // if(backgroundA  < 200){
    //     ctx.drawImage(image, -backgroundAnimation/10, -backgroundAnimation/10, canvas.width + backgroundAnimation/5, canvas.height+backgroundAnimation/5)
    //     backgroundAnimation++

    // } else{
    //     if(backgroundA < 400){
    //         ctx.drawImage(image, -backgroundAnimation/10, -backgroundAnimation/10, canvas.width + backgroundAnimation/5, canvas.height+backgroundAnimation/5)
    //         backgroundAnimation--
    //     } else{
    //         backgroundA = 0
    //         backgroundAnimation = 0
    //     }
    // }
    // backgroundA++

    ctx.fillStyle = "rgb(0, 0, 0, 1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)



    player.draw()
    player.move()


    powerups.forEach((powerup, indexPowerup) => {
        powerup.draw(rotation)

        const dist = Math.hypot(player.x - powerup.x, player.y - powerup.y)
        if (dist - player.radius - powerup.radius < 1){
           powerups.splice(indexPowerup, 1) 

           let random = Math.random()

           switch(true){

                case random <= 0.25:
                    if(player.shotSpeed >= 50){
                        player.shotSpeed -= 10
                        statsUpAnimation(guiShotSpeed)
                    }
                    break 
                case random <= 0.5:
                    if(player.movementSpeed <= 13){
                        player.movementSpeed ++
                        statsUpAnimation(guiMovementSpeed)
                    }
                    break 
                case random <= 0.75:
                    if(player.damage < 50){
                        player.damage ++
                        statsUpAnimation(guiDamage)
                    }
                    break
                case random <= 1:
                    if(player.projectileSpeed < 20){
                        player.projectileSpeed ++
                        statsUpAnimation(guiProjectileSpeed)
                    }
                }
            }
    })

    projectiles.forEach((projectile, indexProjectile) => {
        projectile.update()

        if (projectile.x - projectile.radius < 0 || projectile.x + projectile.radius > canvas.width ||
            projectile.y - projectile.radius < 0 || projectile.y + projectile.radius > canvas.height){
            projectiles.splice(indexProjectile, 1)
        }
    })

    enemies.forEach((enemy, indexEnemy) => {
        enemy.update(enemies, player)

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

        if (dist - enemy.radius - player.radius < 1){
            player.health --
            enemies.splice(indexEnemy, 1)
            } if(player.health <= 0 && gameIsRunning === true){
                
                cancelAnimationFrame(animationId)
                ingameMusic.pause()
                ingameMusic.currentTime = 0
                gameIsRunning = false
                scoreAfter.innerHTML = score
                scoreDisplay.style.display = "flex"
                highscoresWrap.style.display = "block"

                if(highscoresArray.length < 10){
                    highscoresArray.push(score)
                } if(score > highscoresArray[10]){
                    } else{
                        highscoresArray.pop()
                        highscoresArray.push(score)
                    }
                highscoresArray.sort(function(a, b){return b-a})
                localStorage.setItem("highscoreList", highscoresArray)
                scoreString = highscoresArray.join()
                highscores.innerHTML = scoreString.replaceAll(",", "<br>")
        }

        guiHealth.style.width = `${player.health / player.maxHealth * 100}%`
        guiHealth.style.background = `hsl(${(player.health / player.maxHealth * 120)}, 100%, 50%)`
        guiHealthBackground.style.background = `hsl(${(player.health / player.maxHealth * 120)}, 100%, 20%)`
        guiHealthNumber.innerHTML = `${player.health} / ${player.maxHealth}`

        projectiles.forEach((projectile, indexProjectile) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

            if (dist - enemy.radius - projectile.radius < 1){
                setTimeout(() => {

                    if(enemy.health - player.damage/10 <= 0){
                        enemy.destroy(powerups)
                        enemies.splice(indexEnemy, 1)
                        projectiles.splice(indexProjectile, 1)
                        score += 50
                    } else {
                        enemy.health -= player.damage/10
                        projectiles.splice(indexProjectile, 1)
                        score += 10
                    }
                    scoreElement.innerHTML = score
                }, 0)
            }
        })
    })
}

startButton.addEventListener("click", () => {
    init()
    animate()
    spawnEnemies()
})

function shoot(x, y) {

    if(isShooting===true){


        const angle = Math.atan2(y - player.y, x - player.x)

        const velocity = {
            x: Math.cos(angle) * player.projectileSpeed,
            y: Math.sin(angle) * player.projectileSpeed
        }

        let rotate = Math.PI/2 + (Math.atan2(xPos - player.x, -(yPos - player.y)))

    projectiles.push(new Projectile(player.x, player.y, 5, "white", velocity, rotate))
    }
 }

volSlider.addEventListener("input", setVol);

function setVol() {
ingameMusic.volume = volSlider.value / 200;
}

let models = ["./assets/pictures/model1.png", "./assets/pictures/model2.png", "./assets/pictures/model3.png"]

model1.addEventListener("mousedown", chooseModelLeft)
model3.addEventListener("mousedown", chooseModelRight)

function chooseModelLeft(){
    models.unshift(models.pop());
    model1.src = models[0]
    model2.src = models[1]
    model3.src = models[2]
    playerModel.src = model2.src
}
function chooseModelRight(){
    models.push(models.shift());
    model1.src = models[0]
    model2.src = models[1]
    model3.src = models[2]
    playerModel.src = model2.src
}

function statsUpAnimation(guiElement){
    guiElement.animate([
        {color: "green"},{color: "white"}],
        {duration: 2000
    })
}

var pauseState = false

addEventListener("keydown", (e) =>{
    if(e.key == "p"){
        if(gameIsRunning){
            pauseState = !pauseState
            if(pauseState){
                cancelAnimationFrame(animationId)
                pause.style.display = "block"
                ingameMusic.pause()
                clearInterval(intervalTimer)
            }else{
                requestAnimationFrame(animate)
                pause.style.display = "none"
                ingameMusic.play()
                spawnEnemies()
        }
        }
    }
})

var int
var xPos
var yPos
var isShooting = false

addEventListener("mousedown", e => {

    isShooting = true

    clearInterval(int);

    if(gameIsRunning){
        int = setInterval(function(){

            shoot(xPos, yPos)
        }, player.shotSpeed)
    }
})

addEventListener("mouseup", e => {
    isShooting = false
})

addEventListener('mousemove', e => {
    xPos = e.clientX
    yPos = e.clientY
})

// export default function getPlayer() {
//     return player
// }

export {ctx}