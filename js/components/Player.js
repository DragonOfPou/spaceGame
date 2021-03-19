
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
let isShooting = false

export default class Player {

    constructor(playerModel, x, y, radius, shotSpeed, damage, movementSpeed, projectileSpeed, health) {
        this.playerModel = playerModel
        this.x = x
        this.y = y
        this.radius  = radius
        this.shotSpeed = shotSpeed
        this.damage = damage
        this.movementSpeed = movementSpeed
        this.projectileSpeed = projectileSpeed
        this.health = health
        this.maxHealth = this.health
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
        ctx.drawImage(this.playerModel, -this.radius * 3, -this.radius * 3, this.radius * 6, this.radius * 6);
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
    shoot(){}
}

let up = false
let left = false
let down = false
let right = false

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


var int
var xPos
var yPos

addEventListener('mousemove', e => {
    xPos = e.clientX
    yPos = e.clientY
})

// addEventListener("touchstart", e => {
//     isShooting = true

//     clearInterval(int);

//     int = setInterval(function(){

//         shoot(xPos, yPos)
//     }, circle.shotSpeed)
// })

// addEventListener('touchmove', e => {
//     xPos = e.clientX
//     yPos = e.clientY
// })