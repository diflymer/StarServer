import Matter from "matter-js"; // Подключаем Matter.js

export default class Star {
    clientId;
    constructor(room, world, x, y) {
        this.room = room;
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

    // minusHealth() {

    //     if (this.isImmortal) return;

    //     if (this.health > 1) {

    //         this.health--;


    //     } else {
    //         this.dead();
    //     }

    //     this.isImmortal = true;
    //     this.scene.time.delayedCall(2000, () => {
    //         this.isImmortal = false;
    //     });
    //     //this.scene.events.emit('starHealthChanged', this.health, this.maxHealth);

    // }


    // minusHealthAndTp(x, y) {

    //     if (this.isImmortal) return;

    //     if (this.health > 1) {

    //         this.health--;
    //         this.setPosition(x, y);


    //     } else {
    //         this.setPosition(0, 0);
    //         this.health = this.maxHealth;
    //     }

    //     this.clearForce();

    //     this.isImmortal = true;
    //     this.scene.time.delayedCall(2000, () => {
    //         this.isImmortal = false;
    //     });
    //     this.scene.events.emit('starHealthChanged', this.health, this.maxHealth);

    // }

    dash(dist) {
        const dashForce = 1.5;

        const velocity = this.body.velocity;
        const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);

        const dx = dist.x - this.body.position.x;
        const dy = dist.y - this.body.position.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length > 0) {
            const impulseX = (dx / length) * dashForce;
            const impulseY = (dy / length) * dashForce;

            Matter.Body.applyForce(this.body, this.body.position, { x: impulseX, y: impulseY });
        }

        // if (speed > 0) {
        //     const direction = { x: velocity.x / speed, y: velocity.y / speed };

        //     // Применяем силу в этом направлении
        //     Matter.Body.applyForce(this.body, this.body.position, {
        //         x: direction.x * dashForce,
        //         y: direction.y * dashForce
        //     });

        // } else {
        //     Matter.Body.applyForce(this.body, this.body.position, { x: dashForce, y: 0 });
        // }

    }

    shoot4() {

        // Создаем изображение
        let shots = [];

        const radius = 15; // Радиус окружности вокруг звезды
        const centerX = this.body.position.x; // Центр окружности по X
        const centerY = this.body.position.y; // Центр окружности по Y

        const countStars = 20
        for (let i = 1; i <= countStars; i++) {

            // const angle = (this.body.angle) + (2 * Math.PI / countStars) * i;
            const angle = (2 * Math.PI / countStars) * i;

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

    shoot(dist) {
        const radius = 25; // Радиус окружности вокруг звезды

        const centerX = this.body.position.x; // Центр окружности по X
        const centerY = this.body.position.y; // Центр окружности по Y

        let isEnemy = true;
        let angle;

        angle = Math.atan2(dist.y - this.body.position.y, dist.x - this.body.position.x);

        // Вычисляем позицию shot на окружности
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        let shot = Matter.Bodies.circle(x, y, 10);
        shot.owner = this;
        shot.label = 'shot';
        shot.mass = 0.1;
        shot.frictionAir = 0;
        shot.frictionStatic = 0;

        Matter.World.add(this.world, shot);
        // Устанавливаем скорость

        Matter.Body.setAngularVelocity(shot, 0.1);

        const speed = 10; // Начальная скорость пули

        Matter.Body.setVelocity(shot, { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed });

        setTimeout(() => {
            Matter.World.remove(this.world, shot);
        }, 3000);

        return shot;
    }

    minusHealth() {

        if (this.isImmortal) return;

        if (this.health > 1) {

            this.health--;

        } else {
            this.health--;
            this.dead()
        }

        this.isImmortal = true;
        setTimeout(() => {
            this.isImmortal = false;
        }, 2000);

    }


    dead() {

        const player = this.room.state.players.get(this.clientId)
        if (player) {
            player.dead = true;
            this.room.broadcast('playerDead', {
                ownerId: this.clientId
            })
            this.body.isStatic = true;
    
            setTimeout(() => {
                this.respawn();
            }, 3000)
        }
    }

    respawn() {
        const player = this.room.state.players.get(this.clientId)
        if (player){
            player.dead = false;

            this.room.broadcast('playerRespawn', {
                ownerId: this.clientId,
                maxHealth:this.maxHealth,
            })
            this.body.isStatic = false;
    
            const x = Math.floor(Math.random() * (4000 - (-4000) + 1)) + (-4000);
            const y = Math.floor(Math.random() * (4000 - (-4000) + 1)) + (-4000);
            Matter.Body.setPosition(this.body, { x, y });
            this.clearForce();
            this.health = this.maxHealth;
        }

    }

    clearForce() {
        Matter.Body.setVelocity(this.body, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(this.body, 0);
    }

}