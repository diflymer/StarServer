import { Schema, MapSchema, type, ArraySchema } from "@colyseus/schema";
 
export class Player extends Schema {
    @type("number") x: number;
    @type("number") y: number;
    @type("number") vx: number = 0;
    @type("number") vy: number = 0;
    @type("number") angle: number = 0;

    @type("string") name: string = 'noname';
    @type("number") score: number = 0;
    @type("number") health: number = 3;
    @type("number") maxHealth: number = 3;
    @type("boolean") dead: boolean = false;
}

export class Entity extends Schema {
    @type("number") x: number;
    @type("number") y: number;
    @type("number") vx: number;
    @type("number") vy: number;
    @type("string") type: string = null;
}
 
export class MyState extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
    @type({ map: Entity }) entities = new MapSchema<Entity>();
}