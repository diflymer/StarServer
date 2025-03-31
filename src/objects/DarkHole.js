import Matter from "matter-js"; // Подключаем Matter.js
import { v4 as uuidv4 } from "uuid";

import { Entity } from "../rooms/MyState";

export default class DarkHole {
    constructor(room, world, x, y) {
        this.room = room;
        this.world = world;

        this.body = Matter.Bodies.circle(x, y, 4);

        this.body.mass = 10000;
        this.body.inverseMass = 0.01;
        this.body.density = 1.5;

        this.body.frictionAir = 1;
        this.body.friction = 1;
        this.body.frictionStatic = 0.5;

        this.body.label = 'darkHole';
        this.body.angularDamping = 0;

        Matter.World.add(this.world, this.body);

        const entity = new Entity();
        entity.x = this.body.position.x;
        entity.y = this.body.position.y;
        entity.vx = this.body.velocity.x;
        entity.vy = this.body.velocity.y;
        entity.type = "darkHole";
        const entityId = uuidv4();
        this.room.state.entities.set(entityId, entity);
        this.room.entities.set(entityId, this.body);
    }
}