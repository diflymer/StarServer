import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { MyState, Player } from "./MyState";

import Phaser from "phaser"; // Подключаем Phaser
import Matter from "matter-js"; // Подключаем Matter.js

export class MyRoom extends Room<MyState> {
  maxClients = 8;
  countClients = 0;

  names = ['Истинный', 'Звезда', 'Огонёк', 'Водяной', 'Петух', 'Тюремщик', 'Водка', 'Коллайдер']

  state = new MyState();

  onCreate(options: any): void | Promise<any> {
    this.onMessage(0, (client, payload) => {
      // get reference to the player who sent the message
      const player = this.state.players.get(client.sessionId);

      player.x = payload.x;
      player.y = payload.y;
    });
  }


  onJoin(client: Client, options: any) {
    this.countClients += 1;
    console.log(client.sessionId, "joined!");


    const mapWidth = 800;
    const mapHeight = 600;

    // create Player instance
    const player = new Player();

    // place Player at a random position
    player.x = (Math.random() * mapWidth);
    player.y = (Math.random() * mapHeight);
    let name;
    if (this.countClients <= this.names.length) {
      name = this.names[this.countClients - 1];
    } else {
      name = this.names[Math.floor(Math.random() * this.names.length)];
    }

    player.name = name;

    // place player in the map of players by its sessionId
    // (client.sessionId is unique per connection!)
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    this.countClients -= 1;
    console.log(client.sessionId, "left!");

    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
