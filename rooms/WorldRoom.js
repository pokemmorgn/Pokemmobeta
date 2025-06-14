const { Room, Client } = require("colyseus");

class Player {
  constructor(id) {
    this.id = id;
    this.x = 100;
    this.y = 100;
    this.name = "Player";
  }
}

class WorldRoom extends Room {
  onCreate(options) {
    this.setState({ players: {} });

    this.onMessage("move", (client, data) => {
      const player = this.state.players[client.sessionId];
      if (player) {
        player.x = data.x;
        player.y = data.y;
      }
    });
  }

  onJoin(client) {
    this.state.players[client.sessionId] = new Player(client.sessionId);
  }

  onLeave(client) {
    delete this.state.players[client.sessionId];
  }
}

module.exports = { WorldRoom };
