const { Room } = require("colyseus");
const schema = require("@colyseus/schema");
const { Schema, type, MapSchema } = schema;

class Player extends Schema {
  constructor(id) {
    super();
    this.id = id;
    this.x = 100;
    this.y = 100;
    this.name = "Player";
  }

  @type("string") id;
  @type("number") x;
  @type("number") y;
  @type("string") name;
}

class State extends Schema {
  constructor() {
    super();
    this.players = new MapSchema();
  }

  @type({ map: Player }) players;
}

class WorldRoom extends Room {
  onCreate(options) {
    this.setState(new State());

    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.x = data.x;
        player.y = data.y;
      }
    });
  }

  onJoin(client) {
    const player = new Player(client.sessionId);
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client) {
    this.state.players.delete(client.sessionId);
  }
}

module.exports = { WorldRoom };
