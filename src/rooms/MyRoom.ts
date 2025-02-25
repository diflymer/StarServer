import { v4 as uuidv4 } from "uuid";

import Matter from "matter-js"; // Подключаем Matter.js

import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { MyState, Player, Entity } from "./MyState";

import Star from '../objects/Star';

import Gravity from '../utils/Gravity';

export class MyRoom extends Room<MyState> {

  engine!: Matter.Engine;
  world!: Matter.World;
  starBody!: Star;
  gravity!: Gravity;

  maxClients = 16;
  countClients = 0;

  names = ['Водичка', 'Звезда', 'Огонёк', 'Камень', 'Петух', 'Тюремщик', 'Водка', 'Коллайдер']

  state = new MyState();

  entities = new Map<string, any>();

  fixedTimeStep = 1000 / 60;

  onCreate(options: any): void | Promise<any> {

    // Создаём Matter.js мир
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.world.gravity.y = 0;

    this.gravity = new Gravity(this);

    let elapsedTime = 0;
    this.setSimulationInterval((deltaTime) => {
      elapsedTime += deltaTime;

      while (elapsedTime >= this.fixedTimeStep) {
        elapsedTime -= this.fixedTimeStep;
        //this.updatePhysics(this.fixedTimeStep)
        this.fixedTick(this.fixedTimeStep);
      }
    });

    Matter.Events.on(this.engine, "collisionStart", (event) => {
      this.handleCollisions(event)
    })

    // this.onMessage(0, (client, payload) => {
    //   // get reference to the player who sent the message
    //   const player = this.state.players.get(client.sessionId);

    //   player.x = payload.x;
    //   player.y = payload.y;
    //   player.vx = payload.vx;
    //   player.vy = payload.vy;
    // });

    this.onMessage('applyStarSteering', (client, payload) => {

      const player = this.state.players.get(client.sessionId);
      const star = this.entities.get(client.sessionId);

      Matter.Body.applyForce(star.body, {x: star.body.position.x + 0.01, y: star.body.position.y}, { x: payload.forceX, y: payload.forceY });
      // // get reference to the player who sent the message


      // //FORCE
      // const maxSpeed = 1.6; // Максимальная скорость
      // const baseForce = 0.02; // Базовая сила

      // let velocity = star.body.velocity;
      // let currentSpeed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

      // // Вектор направления от джойстика
      // let targetX = payload.x;
      // let targetY = payload.y;
      // let targetLength = Math.sqrt(targetX * targetX + targetY * targetY);

      // if (targetLength > 0) {
      //   targetX /= targetLength;
      //   targetY /= targetLength;

      //   // Масштабируем силу в зависимости от длины джойстика
      //   let forceMultiplier = targetLength; // Ограничиваем максимум 1
      //   let forceMagnitude = baseForce * forceMultiplier; // Чем дальше джойстик, тем больше сила

      //   // Вычисляем силу в направлении джойстика
      //   let forceX = targetX * forceMagnitude;
      //   let forceY = targetY * forceMagnitude;

      //   // Если скорость превышает максимум, перенаправляем её
      //   if (currentSpeed >= maxSpeed) {
      //     let normalizedVX = velocity.x / currentSpeed;
      //     let normalizedVY = velocity.y / currentSpeed;

      //     // Вычисляем разницу между текущим направлением и целевым
      //     let adjustForceX = (targetX - normalizedVX) * forceMagnitude;
      //     let adjustForceY = (targetY - normalizedVY) * forceMagnitude;

      //     // Корректируем направление движения
      //     Matter.Body.applyForce(star.body, star.body.position, { x: adjustForceX, y: adjustForceY });

      //   } else {
      //     // Если скорость ниже максимума, просто добавляем силу
      //     Matter.Body.applyForce(star.body, { x: star.body.position.x + 0.01, y: star.body.position.y }, { x: forceX, y: forceY })
      //   }
      // }

    });

    this.onMessage('shift', (client, payload) => {

      const player = this.state.players.get(client.sessionId);
      const star = this.entities.get(client.sessionId);

      star.dash();

    });

    this.onMessage('shoot4', (client, payload) => {

      const player = this.state.players.get(client.sessionId);
      const star = this.entities.get(client.sessionId);

      const shots = star.shoot4();

      shots.forEach((shot: any) => {

        const entity = new Entity();
        entity.x = shot.position.x;
        entity.y = shot.position.y;
        const entityId = uuidv4();
        this.state.entities.set(entityId, entity);
        this.entities.set(entityId, shot);
      });

      this.broadcast("playerShooted4", {
        ownerId: client.sessionId
      });

    });

    this.onMessage('shoot', (client, payload) => {

      const player = this.state.players.get(client.sessionId);
      const star = this.entities.get(client.sessionId);

      const shot = star.shoot(payload);

      const entity = new Entity();
      entity.x = shot.position.x;
      entity.y = shot.position.y;
      const entityId = uuidv4();
      this.state.entities.set(entityId, entity);
      this.entities.set(entityId, shot);

      this.broadcast("playerShooted", {
        ownerId: client.sessionId
      });

    });

    this.onMessage('plusScore', (client, score) => {

      const player = this.state.players.get(client.sessionId);

      player.score += score;

      this.broadcast("plusScore", {
        ownerId: client.sessionId,
        score: player.score
      });

    });

    // this.onMessage('startDeathmatch', (client) => {

    //   this.broadcast("startDeathmatch", {
    //     ownerId: client.sessionId,
    //     score: player.score
    //   });

    //   this.state.players.forEach((player, key) => {

    //     player.score = 0;

    //   });

    // });
  }


  fixedTick(fixedTimeStep: number) {

    Matter.Engine.update(this.engine, fixedTimeStep);

    // Двигаем объект (пример: небольшая сила влево)
    //Matter.Body.applyForce(this.starBody, this.starBody.position, { x: -0.0005, y: 0 });

    this.gravity.applyGravity(this.world);

    this.state.players.forEach((player, key) => {

      //Обновление позиции каждого игрока
      const entity = this.entities.get(key);
      player.x = entity.body.position.x;
      player.y = entity.body.position.y;
      player.vx = entity.body.velocity.x;
      player.vy = entity.body.velocity.y;
      player.angle = entity.body.angle;

      //Ограничение карты
      const mapRadius = 6000;

      const starX = entity.body.position.x;
      const starY = entity.body.position.y;

      // Вычисляем расстояние
      const distanceFromCenter = Math.sqrt(starX * starX + starY * starY);

      if (distanceFromCenter > mapRadius) {
        // Вычисляем силу возврата
        const pullStrength = 0.005 * (distanceFromCenter - mapRadius); // Чем дальше, тем сильнее тяга

        const angleToCenter = Math.atan2(-starY, -starX);
        const forceX = Math.cos(angleToCenter) * pullStrength / 2;
        const forceY = Math.sin(angleToCenter) * pullStrength / 2;

        // Притягиваем звезду обратно
        Matter.Body.applyForce(entity.body, entity.body.position, { x: forceX, y: forceY });
      }

    });

    this.state.entities.forEach((entity, key) => {
      const body = this.entities.get(key);

      if (body) {
        entity.x = body.position.x;
        entity.y = body.position.y;
      } else {
        this.state.entities.delete(key);
      }

    });

  }


  onJoin(client: Client, options: any) {
    this.countClients += 1;
    console.log(client.sessionId, "joined!");


    const mapWidth = 4000;
    const mapHeight = 4000;

    const player = new Player();
    if (Math.random() < 0.5) {
      player.x = (Math.random() * mapWidth);
    } else {
      player.x = (Math.random() * -mapWidth);
    }
    if (Math.random() < 0.5) {
      player.y = (Math.random() * mapHeight);
    } else {
      player.y = (Math.random() * -mapHeight);
    }


    player.vx = 0; player.vy = 0;
    player.angle = 0;
    player.score = 0;

    let name;
    if (this.countClients <= this.names.length) {
      name = this.names[this.countClients - 1];
    } else {
      name = this.names[Math.floor(Math.random() * this.names.length)];
    }

    player.name = name;
    this.countClients += 1;

    // const entity = new Entity();
    // entity.x = (Math.random() * mapWidth);
    // entity.y = (Math.random() * mapHeight);

    const star = new Star(this.world, player.x, player.y);
    star.clientId = client.sessionId;

    const uniqueId = client.sessionId;
    this.entities.set(uniqueId, star);

    // this.state.entities.set(uniqueId, entity);

    // place player in the map of players by its sessionId
    // (client.sessionId is unique per connection!)
    this.state.players.set(uniqueId, player);
  }

  onLeave(client: Client, consented: boolean) {
    this.countClients -= 1;
    console.log(client.sessionId, "left!");

    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  handleCollisions(event: Matter.IEventCollision<Matter.Engine>) {
    event.pairs.forEach((pair) => {
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      // if ((bodyB.label === 'particle' && bodyA.label === 'star')) {

      //   const particle = bodyB.gameObject; // Получаем объект Phaser, связанный с телом1
      //   //this.scene.get('UIScene').events.emit('updateScore', 20);// Добавить 1 очко

      //   if (particle) {
      //     particle.destroy(); // Удаляем весь объект (включая тело и визуальную часть)
      //   }

      //   // const star = bodyA.gameObject; // Получаем объект Phaser, связанный с телом2
      //   // if (star) {
      //   //     star.minusHealth(); // Вызываем метод death() объекта star
      //   // }
      // }

      if ((bodyA.label === 'star' && bodyB.label === 'shot' && bodyB.owner !== bodyA.owner)) {
        bodyA.owner.minusHealth();

        const whoHits = bodyB.owner.clientId;
        const player = this.state.players.get(whoHits);
        player.score += 2;

        this.broadcast("playerMinusHealth", {
          ownerId: bodyA.owner.clientId,
          whoHitsId: whoHits,
          whoHitsScore: player.score
        });
      }

    });
  }

}
