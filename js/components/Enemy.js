import Projectile from "./Projectile.js"
import {canvas,ctx, animation} from "../index.js"
import Powerup from "./Powerup.js"

const [shot1, shot2, shot3, shot4, shot5, enemyRed, enemyGreen, enemyBlue] =
  ['shot1_1', 'shot1_2', 'shot1_3', 'shot1_4', 'shot5', 'enemyRed', 'enemyGreen', 'enemyBlue'].map(id => document.getElementById(id))

var images = [shot1, shot2, shot3, shot4, shot5]

export class Enemy {
    constructor(x, y, radius, health) {
        this.x = x
        this.y = y
        this.radius  = radius
        this.sprite = enemyRed
        this.velocity
        this.health = health
        this.maxHealth = this.health
        this.timer = 0
        this.angle = 0
       if(this.x < canvas.width/2){ this.moveDirectionX = 1} else {this.moveDirectionX = -1}
       if(this.y < canvas.height/2){ this.moveDirectionY = 1} else {this.moveDirectionY = -1}
    }

    draw() {

        let healthbarwidth = 60
        let healthbarheight = 8
        let healthbarColor

        healthbarColor= this.health / this.maxHealth * 120

        ctx.fillStyle = `hsl(${healthbarColor}, 100%, 20%)`
        ctx.fillRect(this.x - healthbarwidth/2 , this.y - this.radius - 13, healthbarwidth, healthbarheight)
        ctx.fillStyle = `hsl(${healthbarColor}, 100%, 50%)`
        ctx.fillRect(this.x - healthbarwidth/2, this.y - this.radius - 13, healthbarwidth * this.health /this.maxHealth, healthbarheight)

        // ctx.beginPath()
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        // ctx.fillStyle = "white"
        // ctx.fill()
        
        ctx.drawImage(this.sprite, this.x-this.radius * 2 , this.y-this.radius* 2.4, this.radius * 4, this.radius * 4);
    }

    update(enemies, player) {
        //player = getPlayer()
        this.draw()

        let angle = Math.atan2(player.y - this.y, player.x - this.x) //player.x und player.y

        this.velocity = {
            x: Math.cos(angle) * 2,
            y: Math.sin(angle) * 2
        }

        this.x += this.velocity.x     
        this.y += this.velocity.y
    }

    // this.angle += this.moveAngle * Math.PI / 180
    // this.x += (this.speed * Math.sin(this.angle)) + Math.random() * 2 * this.moveDirectionX
    // this.y += (this.speed * Math.cos(this.angle)) + Math.random() * 2 * (canvas.height/canvas.width) * this.moveDirectionY
    // }

    destroy(powerups){

        if(Math.random() < 0.3){
            powerups.push(new Powerup(this.x, this.y))
        }
        return(powerups)
    }
}

export class SpawningEnemy extends Enemy {
    constructor(x, y, radius, health) {
        super(x, y, radius + 100, health*5)
        this.sprite = enemyBlue
    }

    update(enemies, player, enemyProjectiles){
        this.timer++
        this.draw()
        let angle = Math.atan2(player.y - this.y, player.x - this.x)

        this.velocity = {
            x: Math.cos(angle) * 2,
            y: Math.sin(angle) * 2
        }

        this.x += this.velocity.x     
        this.y += this.velocity.y
        if(this.timer % 500 === 0){
            this.createEnemy(enemies)
        }
    }

    createEnemy(enemies){
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
        return (enemies)
    }

    destroy(powerups){
        powerups.push(new Powerup(this.x, this.y))
        return powerups
    }

}

export class ShootingEnemy extends Enemy{
    constructor(x, y, radius, health){
        super(x, y, radius, health)
        this.sprite = enemyGreen
        this.randomX = Math.random()
        this.randomY = Math.random()
    }

    update(enemies, player, enemyProjectiles){

        this.draw()
        this.shoot(player, enemyProjectiles)

        if(Math.abs(this.x - player.x) < 1200 && Math.abs(this.x - player.x) > 300 && Math.abs(this.y - player.y) < 700 && Math.abs(this.y - player.y) > 300){
            this.angle = Math.atan2(this.randomY * canvas.height - this.y, this.randomX * canvas.width - this.x)
            console.log("ich laufe random")
        } else{
            this.angle = Math.atan2(player.y - this.y, player.x - this.x)
        }
        
        this.velocity = {
            x: Math.cos(this.angle) * 2,
            y: Math.sin(this.angle) * 2
        }

        if(Math.abs(this.x - player.x) < 300){
            this.velocity.x = -this.velocity.x
            console.log("ich laufe weg")
        }        
        if(Math.abs(this.y - player.y) < 300){
            this.velocity.y = -this.velocity.y
            console.log("ich laufe weg")
        }

        this.x += this.velocity.x     
        this.y += this.velocity.y

        this.velocity.x = Math.abs(this.velocity.x)
        this.velocity.y = Math.abs(this.velocity.y)


        // if(this.timer % 200 === 0){
        //     if(Math.random() < 0.5)
        //     {this.velocity.x = -this.velocity.x}
        //     if(Math.random() < 0.5)
        //     {this.velocity.y = -this.velocity.y}
        // }

         this.timer++

         if(this.timer % 100 == 0){
            this.randomX = Math.random()
            this.randomY = Math.random()
         }

    }
    
    shoot(player, enemyProjectiles){

        if(this.timer % 70 == 0){

            const angle = Math.atan2(player.y - this.y, player.x - this.x)

            const velocity = {
                x: Math.cos(angle) *5 ,
                y: Math.sin(angle) *5
            }
            let rotate = Math.PI/2 + (Math.atan2(player.x - this.x, -(player.y - this.y)))

        enemyProjectiles.push((new Projectile(this.x, this.y, 5, "white", velocity, rotate, images)))
    }
        return enemyProjectiles
    }

}