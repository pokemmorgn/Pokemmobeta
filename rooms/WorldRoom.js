// WorldRoom.js
const colyseus = require("colyseus");

class WorldRoom extends colyseus.Room {
  onCreate(options) {
    // Structure partagée par tous les clients
    this.setState({
      players: {}
    });

    // Quand un client envoie des messages
    this.onMessage("move", (client, data) => {
      if (this.state.players[client.sessionId]) {
        // Met à jour la position du joueur
        this.state.players[client.sessionId].x = data.x;
        this.state.players[client.sessionId].y = data.y;
      }
    });
  }

  // Quand un joueur rejoint la room
  onJoin(client, options) {
    // Ajoute le joueur avec une position de départ
    this.state.players[client.sessionId] = { x: 100, y: 100 };
    console.log("Player joined:", client.sessionId);
  }

  // Quand un joueur quitte la room
  onLeave(client, consented) {
    delete this.state.players[client.sessionId];
    console.log("Player left:", client.sessionId);
  }
}

module.exports = { WorldRoom };