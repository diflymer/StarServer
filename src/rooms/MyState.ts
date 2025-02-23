import { Schema, MapSchema, type, ArraySchema } from "@colyseus/schema";
 
export class Player extends Schema {
    @type("number") x: number;
    @type("number") y: number;
    @type("number") vx: number;
    @type("number") vy: number;
    @type("string") name: string;
}

export class Entity extends Schema {
    @type("number") x: number;
    @type("number") y: number;
    @type("number") vx: number;
    @type("number") vy: number;
}
 
export class MyState extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
    @type({ map: Entity }) entities = new MapSchema<Entity>();
}