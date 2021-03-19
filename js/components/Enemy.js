//import getPlayer from "../index.js"
import {ctx} from "../index.js"
import Powerup from "./Powerup.js"
//let player

export class Enemy {
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
        let healthbarColor

        healthbarColor= this.health / this.maxHealth * 120

        ctx.fillStyle = `hsl(${healthbarColor}, 100%, 20%)`
        ctx.fillRect(this.x - healthbarwidth/2 , this.y - this.radius - 13, healthbarwidth, healthbarheight)
        ctx.fillStyle = `hsl(${healthbarColor}, 100%, 50%)`
        ctx.fillRect(this.x - healthbarwidth/2, this.y - this.radius - 13, healthbarwidth * this.health /this.maxHealth, healthbarheight)

        ctx.beginPath()
        ctx.moveTo (this.x +  this.radius * Math.cos(0), this.y +  this.radius *  Math.sin(0));          

        for (var i = 1; i <= this.health + 2;i += 1) {
        ctx.lineTo (this.x + this.radius * Math.cos(i * 2 * Math.PI / (this.health + 2)), this.y + this.radius * Math.sin(i * 2 * Math.PI / (this.health + 2)));
        }
        ctx.fillStyle = this.color
        ctx.fill()
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

    destroy(powerups){

        if(Math.random() < 0.3){
            powerups.push(new Powerup(this.x, this.y))
        }
        return(powerups)
    }
}

export class BossEnemy extends Enemy {
    constructor(x, y, radius, health, color, velocity) {
        super(x, y, radius + 100, health*5, color, velocity)
    }

    update(enemies, player){
        this.draw()
        let angle = Math.atan2(player.y - this.y, player.x - this.x)

        this.velocity = {
            x: Math.cos(angle) * 2,
            y: Math.sin(angle) * 2
        }

        this.x += this.velocity.x     
        this.y += this.velocity.y
        if(Math.random() < 0.002){
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