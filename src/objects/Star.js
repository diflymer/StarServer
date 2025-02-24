import Matter from "matter-js"; // Подключаем Matter.js

export default class Star {
    clientId;
    constructor(world, x, y) {
        this.world = world;

        this.body = Matter.Bodies.circle(x, y, 15)

        this.body.owner = this;

        this.body.mass = 100;
        this.body.frictionAir = 0;
        this.body.friction = 0;
        this.body.frictionStatic = 0;

        this.body.angularDamping = 0;
        this.body.label = 'star';

        Matter.World.add(this.world, this.body);

        this.isImmortal = false;
        this.maxHealth = 3;
        this.health = this.maxHealth;

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



    dash() {
        const dashForce = 1.5;

        const velocity = this.body.velocity;
        const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);

        if (speed > 0) {
            const direction = { x: velocity.x / speed, y: velocity.y / speed };

            // Применяем силу в этом направлении
            Matter.Body.applyForce(this.body, this.body.position, {
                x: direction.x * dashForce,
                y: direction.y * dashForce
            });

        } else {
            Matter.Body.applyForce(this.body, this.body.position, { x: dashForce, y: 0 });
        }

    }

    shoot4() {

        // Создаем изображение
        let shots = [];

        const radius = 15; // Радиус окружности вокруг звезды
        const centerX = this.body.position.x; // Центр окружности по X
        const centerY = this.body.position.y; // Центр окружности по Y

        const countStars = 20
        for (let i = 1; i <= countStars; i++) {

            const angle = (this.body.angle) + (2 * Math.PI / countStars) * i;

            // Вычисляем позицию shot на окружности
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            const shot = Matter.Bodies.circle(x, y, 10);
            shot.owner = this;
            shot.label = 'shot';
            shot.mass = 0.1;
            shot.frictionAir = 0;
            shot.frictionStatic = 0;

            // Настройки физики
            let shotForce = 0.8;
            Matter.World.add(this.world, shot);
            // Устанавливаем скорость
            Matter.Body.setVelocity(shot, { x: (x - centerX) * shotForce, y: (y - centerY) * shotForce });
            Matter.Body.setAngularVelocity(shot, 0.1);

            Matter.Body.setAngle(shot, angle);
            //shot.setRotation(angle);
            
            setTimeout(() => {
                Matter.World.remove(this.world, shot);
            }, 1000);

            shots.push(shot);


        }
        
        return shots;
        

    }

    minusHealth() {
        console.log('minusHealth')

        if (this.isImmortal) return;

        if (this.health > 1) {

            this.health--;

        } else {
            Matter.Body.setPosition(this.body, { x: 0, y: 0 });
            this.clearForce();
            this.health = this.maxHealth;
        }

        this.isImmortal = true;
        setTimeout(() => {
            this.isImmortal = false;
        }, 2000);

    }

    clearForce() {
        Matter.Body.setVelocity(this.body, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(this.body, 0);
    }

}