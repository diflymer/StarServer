import Matter from "matter-js"; // Подключаем Matter.js

export default class Star{
    constructor(world, x, y) {

        this.body = Matter.Bodies.circle(x, y, 15)
        
        this.body.mass = 100;
        this.body.frictionAir = 0;
        this.body.friction = 0;
        this.body.frictionStatic = 0;

        this.body.angularDamping = 0;
        this.body.label = 'star';

        Matter.World.add(world, this.body);

        // this.isImmortal = false;
        // this.maxHealth = 3;
        // this.health = this.maxHealth;

        // if (main) {
        //     //Дэш
        //     let canDash = true;
        //     let needScoreDash = 20;

        //     this.scene.input.keyboard.on('keydown-SHIFT', () => {

        //         if (!canDash) return;
        //         canDash = false;
        //         this.scene.time.delayedCall(2000, () => { canDash = true });

        //         let score = UIscene.score;
        //         if (score < needScoreDash) return;
        //         UIscene.events.emit('updateScore', -needScoreDash);

        //         let dashForce = 1.5;

        //         const velocity = this.body.velocity;
        //         const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);

        //         if (speed > 0) {
        //             const direction = { x: velocity.x / speed, y: velocity.y / speed };

        //             // Применяем силу в этом направлении
        //             this.scene.matter.body.applyForce(this.body, this.body.position, {
        //                 x: direction.x * dashForce,
        //                 y: direction.y * dashForce
        //             });
        //         } else {
        //             this.applyForce({ x: dashForce, y: 0 })
        //         }

        //     });
        // }

    }

    clearForce() {
        this.setVelocity(0, 0);
        this.setAngularVelocity(0);
    }

    minusHealth() {

        if (this.isImmortal) return;

        if (this.health > 1) {

            this.health--;


        } else {
            this.setPosition(0, 0);
            this.clearForce();
            this.health = this.maxHealth;
        }

        this.isImmortal = true;
        this.scene.time.delayedCall(2000, () => {
            this.isImmortal = false;
        });
        this.scene.events.emit('starHealthChanged', this.health, this.maxHealth);

    }

    minusHealthAndTp(x, y) {

        if (this.isImmortal) return;

        if (this.health > 1) {

            this.health--;
            this.setPosition(x, y);


        } else {
            this.setPosition(0, 0);
            this.health = this.maxHealth;
        }

        this.clearForce();

        this.isImmortal = true;
        this.scene.time.delayedCall(2000, () => {
            this.isImmortal = false;
        });
        this.scene.events.emit('starHealthChanged', this.health, this.maxHealth);

    }


}