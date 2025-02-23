import Matter from "matter-js"; // Подключаем Matter.js

export default class Gravity {
    constructor(scene) {
        this.scene = scene;
        this.G = 0.0005; // Гравитационная постоянная
    }

    applyGravity(world) {

        const bodies = world.bodies;

        bodies.forEach((body1) => {
            if (body1.label === 'notGravity') return;

            bodies.forEach((body2) => {
                if (body1 === body2) return;
                if (body2.label === 'notGravity') return;

                const dx = body2.position.x - body1.position.x; // Разница по оси X
                const dy = body2.position.y - body1.position.y; // Разница по оси Y
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 10) return;

                const mass1 = body1.mass;
                const mass2 = body2.mass;
                const forceMagnitude = (this.G * mass1 * mass2) / (distance * distance);
                const forceX = (body2.position.x - body1.position.x) * forceMagnitude / distance;
                const forceY = (body2.position.y - body1.position.y) * forceMagnitude / distance;

                Matter.Body.applyForce(body1, body1.position, { x: forceX, y: forceY });
            });
        });
    }
}
