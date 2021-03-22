const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

export default class Projectile {
    constructor(x, y, radius, color, velocity, rotate, images) {
        this.x = x
        this.y = y
        this.radius  = radius
        this.color = color
        this.velocity = velocity
        this.rotate = rotate
        this.images = images
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
                ctx.drawImage(this.images[0], -50, -50, 100, 100)
                break
            case this.animationStatus < 20:
                ctx.drawImage(this.images[1], -50, -50, 100, 100)
                break
            case this.animationStatus < 30:
                ctx.drawImage(this.images[2], -50, -50, 100, 100)
                break
            case this.animationStatus < 40:
                ctx.drawImage(this.images[3], -50, -50, 100, 100)
                break
            default:
                ctx.drawImage(this.images[4], -50, -50, 100, 100)
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