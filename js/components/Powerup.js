import {ctx} from "../index.js"

export default class Powerup {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.radius  = 50
        this.color = "yellow"
    }

    draw(rotation) {

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