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
let score = 0
let isShooting = false

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


var rotation = 0

class Circle {

    constructor(x, y, radius, shotSpeed, damage, movementSpeed, projectileSpeed) {
        this.x = x
        this.y = y
        this.radius  = radius
        this.shotSpeed = shotSpeed
        this.damage = damage
        this.movementSpeed = movementSpeed
        this.projectileSpeed = projectileSpeed
    }
    
    draw() {
        // ctx.beginPath()
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        // ctx.fillStyle = "white"
        // ctx.fill()

        ctx.save()
        ctx.translate(this.x, this.y)

        this.rotate = (Math.atan2( xPos - this.x, -(yPos - this.y)) )
        // if(this.rotate < 0){
        //     this.rotate = this.rotate + Math.PI
        // }else{
        //     this.rotate = this.rotate - Math.PI
        // }

        ctx.rotate(this.rotate)
        ctx.drawImage(playerModel, -this.radius * 3, -this.radius * 3, this.radius * 6, this.radius * 6);
        ctx.restore()
    
    }

    move() {
        if(up && this.y - this.radius > 0){
            this.y = this.y - this.movementSpeed
        }
        if(left && this.x - this.radius > 0){
            this.x = this.x - this.movementSpeed
        }
        if(down && this.y + this.radius < canvas.height){
            this.y = this.y + this.movementSpeed
        }
        if(right && this.x + this.radius < canvas.width){
            this.x = this.x + this.movementSpeed
        }
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity, rotate) {
        this.x = x
        this.y = y
        this.radius  = radius
        this.color = color
        this.velocity = velocity
        this.rotate = rotate
        this.animationStatus = 0
    }

    draw() {

        // ctx.beginPath()
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        // ctx.fillStyle = this.color
        // ctx.fill()

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotate)
        
        // if(frame < 30){
        //     ctx.drawImage(shot, -50, -50, 100, 100)
        // } else{
        //     ctx.drawImage(shot2, -50, -50, 100, 100)

        //     if(frame > 60)            frame = 0
        // }

        switch(true){
            case this.animationStatus < 10:
                ctx.drawImage(shot1, -50, -50, 100, 100)
                break
            case this.animationStatus < 20:
                ctx.drawImage(shot2, -50, -50, 100, 100)
                break
            case this.animationStatus < 30:
                ctx.drawImage(shot3, -50, -50, 100, 100)
                break
            case this.animationStatus < 40:
                ctx.drawImage(shot4, -50, -50, 100, 100)
                break
            default:
                ctx.drawImage(shot5, -50, -50, 100, 100)
                this.animationStatus = 30
                break
        }

        this.animationStatus ++
        ctx.restore()
    }

    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}

class Enemy {
    constructor(x, y, radius, health, color, velocity) {
        this.x = x
        this.y = y
        this.radius  = radius
        this.color = color
        this.velocity = velocity
        this.health = health
        this.maxHealth = this.health
    }

    draw() {

        let healthbarwidth = 60
        let healthbarheight = 8
        let healthbarColor = "red"

        if(this.health /this.maxHealth < 0.6){
            healthbarColor = "orange"
        }
        if(this.health /this.maxHealth < 0.3){
            healthbarColor = "yellow"
        }

        ctx.fillStyle = "rgb(255, 255, 255, 0.5)"
        ctx.fillRect(this.x - healthbarwidth/2 - 2, this.y - this.radius - 15, healthbarwidth + 4, healthbarheight+ 4)
        ctx.fillStyle = healthbarColor
        ctx.fillRect(this.x - healthbarwidth/2, this.y - this.radius - 13, healthbarwidth * this.health /this.maxHealth, healthbarheight)

        ctx.beginPath()
        ctx.moveTo (this.x +  this.radius * Math.cos(0), this.y +  this.radius *  Math.sin(0));          

        for (var i = 1; i <= this.health;i += 1) {
        ctx.lineTo (this.x + this.radius * Math.cos(i * 2 * Math.PI / this.health), this.y + this.radius * Math.sin(i * 2 * Math.PI / this.health));
        }
        ctx.fillStyle = this.color
        ctx.fill()

    }

    update() {
        this.draw()

        let angle = Math.atan2(circle.y - this.y, circle.x - this.x)

        this.velocity = {
            x: Math.cos(angle) * 2,
            y: Math.sin(angle) * 2
        }

        this.x += this.velocity.x     
        this.y += this.velocity.y
    }

    destroy(){
        if(Math.random() < 0.3){
            powerups.push(new Powerup(this.x, this.y))
        }
    }
}

class BossEnemy extends Enemy {
    constructor(x, y, radius, health, color, velocity) {
        super(x, y, radius + 100, health*5, color, velocity)
    }

    update(){
        this.draw()
        let angle = Math.atan2(circle.y - this.y, circle.x - this.x)

        this.velocity = {
            x: Math.cos(angle) * 2,
            y: Math.sin(angle) * 2
        }

        this.x += this.velocity.x     
        this.y += this.velocity.y
        if(Math.random() < 0.002){
            this.createEnemy()
        }
    }

    createEnemy(){

        let createdEnemyx
        let createdEnemyy
        
        if(Math.random() < 0.5){
            createdEnemyx = this.x + this.radius + Math.random() * 50
        } else{
            createdEnemyx = this.x - this.radius - Math.random() * 50
        }
        if(Math.random() < 0.5){
            createdEnemyy = this.y + this.radius + Math.random() * 50
        } else{
            createdEnemyy = this.y - this.radius - Math.random() * 50
        }

            enemies.push(new Enemy(createdEnemyx, createdEnemyy, this.radius - 100, this.maxHealth/5, this.color, this.velocity))
    }

    destroy(){
        powerups.push(new Powerup(this.x, this.y))
    }
}

class Powerup {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.radius  = 50
        this.color = "yellow"
    }

    draw() {

        // ctx.beginPath()
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        // ctx.fillStyle = this.color
        // ctx.fill()
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(rotation* Math.PI)

        ctx.drawImage(damageUp, -this.radius/2, -this.radius/2, this.radius, this.radius);
        ctx.restore()
    }
}

const centerX = canvas.width / 2
const centerY = canvas.height / 2
//let circle = new Circle(centerX, centerY, 30, "white", 100)
let projectiles = []
let enemies = []
let powerups = []

function init() {
    circle = new Circle(centerX, centerY, 30, 150, 10, 6, 4)
    projectiles = []
    enemies = []
    powerups= []
    score = 0;
    interval = 2000;
    scoreAfter.innerHTML = 0
    scoreElement.innerHTML = 0
    speed.innerHTML = 0
    ingameMusic.play();
}

let intervalTimer

function spawnEnemies() {

    clearInterval(intervalTimer)

    intervalTimer = setInterval(() => { 

        speed.innerHTML = interval       
        //interval -= 400

        const radius = Math.random() * (20 - 10) + 10
        const health = Math.random() * (10 - 3) + 3 + score/1000
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

        var angle = Math.atan2(circle.y - y, circle.x - x)

        var velocityFactor = Math.random() * (3-1) + 1

        const velocity = {
            x: Math.cos(angle) * velocityFactor,
            y: Math.sin(angle) * velocityFactor
        }

        if(Math.random() < 0.9){
            enemies.push(new Enemy(x, y, radius, health, color, velocity))
        } else{
            enemies.push(new BossEnemy(x, y, radius, health, color, velocity))
        }

    }, interval)
}

let animationId
const guiDamage = document.getElementById("damage")
const guiShotSpeed = document.getElementById("shotSpeed")
const guiMovementSpeed = document.getElementById("movementSpeed")
const guiProjectileSpeed = document.getElementById("projectileSpeed")
var lastLoop = new Date()
let backgroundAnimation = 0
let backgroundA = 0
const image = document.getElementById('background')

function animate() {
    animationId = requestAnimationFrame(animate)
    var thisLoop = new Date()
    var fps = 1000 / (thisLoop - lastLoop)
    lastLoop = thisLoop
    console.log(fps)

    rotation += Math.PI/100
    // if(rotation >= Math.PI){
    //     rotation = - Math.PI
    // }

    guiDamage.innerHTML = circle.damage
    guiShotSpeed.innerHTML = circle.shotSpeed
    guiMovementSpeed.innerHTML = circle.movementSpeed
    guiProjectileSpeed.innerHTML = circle.projectileSpeed

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

    circle.draw()
    circle.move()

    powerups.forEach((powerup, indexPowerup) => {
        powerup.draw()

        const dist = Math.hypot(circle.x - powerup.x, circle.y - powerup.y)
        if (dist - circle.radius - powerup.radius < 1){
           powerups.splice(indexPowerup, 1) 

           let random = Math.random()

           switch(true){

                case random <= 0.25:
                    if(circle.shotSpeed >= 50){
                        circle.shotSpeed -= 10
                        guiShotSpeed.animate([
                            {color: "green"},
                                {color: "white"}                            
                        ], {
                            duration: 2000
                        })
                    }
                    break 
                case random <= 0.5:
                    if(circle.movementSpeed <= 13){
                        circle.movementSpeed ++
                        guiMovementSpeed.animate([
                            {color: "green"},
                                {color: "white"}                            
                        ], {
                            duration: 2000
                        })
                    }
                    break 
                case random <= 0.75:
                    if(circle.damage < 50){
                        circle.damage ++
                        guiDamage.animate([
                            {color: "green"},
                                {color: "white"}                            
                        ], {
                            duration: 2000
                        })
                    }
                    break
                case random <= 1:
                    if(circle.projectileSpeed < 20){
                        circle.projectileSpeed ++
                        guiProjectileSpeed.animate([
                            {color: "green"},
                                {color: "white"}                            
                        ], {
                            duration: 2000
                        })
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
        enemy.update()

        const dist = Math.hypot(circle.x - enemy.x, circle.y - enemy.y)

        if (dist - enemy.radius - circle.radius < 1){
            cancelAnimationFrame(animationId)
            ingameMusic.pause()
            ingameMusic.currentTime = 0
            gameisRunning = false
            scoreAfter.innerHTML = score
            scoreDisplay.style.display = "flex"
        }

        projectiles.forEach((projectile, indexProjectile) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

            if (dist - enemy.radius - projectile.radius < 1){
                setTimeout(() => {

                    if(enemy.health - circle.damage/10 <= 2){
                        enemy.destroy()
                        enemies.splice(indexEnemy, 1)
                        projectiles.splice(indexProjectile, 1)
                        score += 50
                    } else {
                        enemy.health -= circle.damage/10
                        projectiles.splice(indexProjectile, 1)
                        score += 10
                    }
                    scoreElement.innerHTML = score
                }, 0)
            }
        })
    })
}

var gameisRunning = false

startButton.addEventListener("click", () => {
    scoreDisplay.style.display = "none"
    gameisRunning = true
    init()
    animate()
    spawnEnemies()
})

var int
var xPos
var yPos

addEventListener("mousedown", e => {

    isShooting = true

    clearInterval(int);

    int = setInterval(function(){

        shoot(xPos, yPos)
    }, circle.shotSpeed)
})

addEventListener("mouseup", e => {
    isShooting = false
})

addEventListener("touchstart", e => {
    isShooting = true

    clearInterval(int);

    int = setInterval(function(){

        shoot(xPos, yPos)
    }, circle.shotSpeed)
})

addEventListener('mousemove', e => {
    xPos = e.clientX
    yPos = e.clientY
})

addEventListener('touchmove', e => {
    xPos = e.clientX
    yPos = e.clientY
})

function shoot(x, y) {

    if(isShooting===true){


        const angle = Math.atan2(y - circle.y, x - circle.x)

        const velocity = {
            x: Math.cos(angle) * circle.projectileSpeed,
            y: Math.sin(angle) * circle.projectileSpeed
        }

        let rotate = Math.PI/2 + (Math.atan2(xPos - circle.x, -(yPos - circle.y)))

    projectiles.push(new Projectile(circle.x, circle.y, 5, "white", velocity, rotate))
    }
 }

 let up = false
 let left = false
 let down = false
 let right = false
 let pauseState = false

addEventListener("keydown", (e) => {
    switch(e.key){
        case "w":
            up = true
            break
        case "a":
            left = true
            break
        case "s":
            down = true
            break
        case "d":
            right = true
            break
        case "p":
            if(gameisRunning){
                pauseState = !pauseState
                if(pauseState){
                    cancelAnimationFrame(animationId)
                    pause.style.display = "block"
                    ingameMusic.pause()
                }else{
                    requestAnimationFrame(animate)
                    pause.style.display = "none"
                    ingameMusic.play()
            }
        }
    }
})

addEventListener("keyup", (e) => {
    switch(e.key){
        case "w":
            up = false
            break
        case "a":
            left = false
            break
        case "s":
            down = false
            break
        case "d":
            right = false
            break
    }
})

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
