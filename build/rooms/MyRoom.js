"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyRoom = void 0;
const core_1 = require("@colyseus/core");
const MyState_1 = require("./MyState");
class MyRoom extends core_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 4;
        //state = new MyRoomState();
        this.state = new MyState_1.MyState();
    }
    onCreate(options) {
        this.onMessage(0, (client, payload) => {
            // get reference to the player who sent the message
            const player = this.state.players.get(client.sessionId);
            const velocity = 2;
            player.x = payload.x;
            player.y = payload.y;
        });
    }
    onJoin(client, options) {
        console.log(client.sessionId, "joined!");
        const mapWidth = 800;
        const mapHeight = 600;
        // create Player instance
        const player = new MyState_1.Player();
        // place Player at a random position
        player.x = (Math.random() * mapWidth);
        player.y = (Math.random() * mapHeight);
        // place player in the map of players by its sessionId
        // (client.sessionId is unique per connection!)
        this.state.players.set(client.sessionId, player);
    }
    onLeave(client, consented) {
        console.log(client.sessionId, "left!");
        this.state.players.delete(client.sessionId);
    }
    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
}
exports.MyRoom = MyRoom;
