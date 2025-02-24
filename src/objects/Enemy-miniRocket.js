import Matter from "matter-js"; // Подключаем Matter.js

export default class MiniRocket {
    constructor(world, x, y, radius) {

        this.startX = x;
        this.startY = y;
        this.radius = radius;
        this.speed = 1; // Скорость передвижения
        this.visionRange = 400; // Дальность "зрения"
        this.visionAngle = 80; // Угол зрения в градусах
        this.shootCooldown = 1000; // Интервал стрельбы в мс
        this.canShoot = true;
        this.rotationSpeed = 0.02; // Скорость поворота (чем больше, тем быстрее)
        this.moving = false; // Флаг начала движения
        this.stop = false; // Флаг остановки движения
        this.isPreparingToShoot = true; // Флаг начала подготовки к выстрелу
        this.playerSeen = false;

        this.state = 'idle'; // 'idle', 'moving', 'chasing', 'searching'

        this.dashCooldown = 3000;
        this.canDash = true;

        // Создаем изображение и тело Matter.js
        this.setOrigin(0.3, 0.5)
            .setDepth(16)
            .setScale(0.5)
            .setCircle(15)
            .setFrictionAir(0.01)
            .setMass(100)

        this.setRandomTarget();

        scene.add.existing(this);

    }

    // Выбираем случайную цель для движения
    setRandomTarget() {
        this.targetX = Phaser.Math.Between((this.startX - this.radius / 2) - 200, (this.startX + this.radius / 2) + 200);
        this.targetY = Phaser.Math.Between((this.startY - this.radius / 2) - 200, (this.startY + this.radius / 2) + 200);

        // const angle = Phaser.Math.FloatBetween(this.rotation - this.visionAngle / 2, this.rotation + this.visionAngle / 2); // Выбираем случайный угол в пределах обзора
        // const distance = Phaser.Math.FloatBetween(50, this.radius); // Выбираем случайное расстояние в пределах видимости

        // this.targetX = this.x + Math.cos(angle) * distance;
        // this.targetY = this.y + Math.sin(angle) * distance;

        // this.moving = false; // Останавливаем движение перед поворотом
    }

    // Проверяем, видит ли ракета игрока
    canSeePlayer(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.visionRange) return false;

        const angleToPlayer = Phaser.Math.RadToDeg(Math.atan2(dy, dx));
        const enemyAngle = Phaser.Math.RadToDeg(this.rotation);
        const angleDiff = Phaser.Math.Angle.WrapDegrees(angleToPlayer - enemyAngle);

        return Math.abs(angleDiff) < this.visionAngle / 2;
    }

    // Стрельба по игроку
    shoot(player) {

        let bullet = this.scene.matter.add.image(this.x, this.y, 'bulletLazer')
            .setScale(0.3)
            .setCircle(5)
            .setAngle(Phaser.Math.RadToDeg(this.rotation))
            .setVelocity((Math.cos(this.rotation)) * 25, (Math.sin(this.rotation)) * 25)
            .setFixedRotation()
        bullet.body.label = 'bullet';

        this.scene.time.delayedCall(this.shootCooldown, () => {
            bullet.destroy();
        });

        this.canShoot = false;
        setTimeout(() => (this.canShoot = true), this.shootCooldown);
    }

    // Плавный поворот к цели
    rotateTowardsTarget(targetX, targetY) {
        this.moving = false;
        const targetAngle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
        this.rotation = Phaser.Math.Angle.RotateTo(this.rotation, targetAngle, this.rotationSpeed);

        if (Math.abs(Phaser.Math.Angle.Wrap(targetAngle - this.rotation)) < 0.05) {
            this.moving = true;
        }
    }

    move() {

        const distance = Phaser.Math.Distance.Between(this.x, this.y, this.targetX, this.targetY);

        if (distance < 50) {
            this.state = 'idle'
            return;
        }

        const moveForce = 0.01;
        const angle = this.rotation;

        this.applyForce({ x: Math.cos(angle) * moveForce, y: Math.sin(angle) * moveForce })


    }

    // Обновление состояния ракеты
    update(player) {

        if (this.canSeePlayer(player)) {
            this.state = 'chasing';
        }

        switch (this.state) {
            case 'idle':
                //Выбрать цель
                this.setRandomTarget();
                this.state = 'wait';
                this.scene.time.delayedCall(3000, () => {
                    this.state = 'moving';
                });
                //Повернуться
                //Перейди в moving
                break;
            case 'wait':
                break;
            case 'moving':
                //Повернуться
                this.rotateTowardsTarget(this.targetX, this.targetY);
                if (this.moving) {
                    this.move();
                }
                //Двигаться
                break;
            case 'chasing':
                //Начать двигаться
                this.targetX = player.x;
                this.targetY = player.y;
                this.rotateTowardsTarget(player.x, player.y);
                this.scene.time.delayedCall(this.shootCooldown, () => {
                    if (this.canSeePlayer(player) && this.canShoot && this.moving) this.shoot(player);
                });

                if (!this.canSeePlayer(player)) {
                    this.state = 'wait';
                    this.scene.time.delayedCall(3000, () => {
                        this.state = 'moving';
                    });
                }
                break;
            case 'searching':
                //Начать двигаться
                break;
        }

        // this.move()

        // if (this.canSeePlayer(player)) {
        //     this.playerSeen = true;
        //     // Поворачиваем к игроку и стреляем
        //     this.moving = false;
        //     this.rotateTowardsTarget(player.x, player.y);

        //     this.scene.time.delayedCall(this.shootCooldown, () => {
        //         if (this.canSeePlayer(player) && this.canShoot && this.moving) this.shoot(player);
        //     });

        // } else {
        //     if (this.playerSeen) {
        //         this.playerSeen = false;
        //         this.setRandomTarget();
        //     }
        //     // Поворачиваемся к случайной цели
        //     this.rotateTowardsTarget(this.targetX, this.targetY);

        // }
    }
}