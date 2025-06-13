const { Room } = require("colyseus");

class WorldRoom extends Room {
  onCreate(options) {
    console.log("🌍 WorldRoom created");

    // Définir la boucle de jeu (par ex. 20 fois par seconde)
    this.setSimulationInterval((deltaTime) => this.update(deltaTime));
  }

  onJoin(client, options) {
    console.log(`👤 ${client.sessionId} joined the world`);
    // Tu pourrais ici envoyer la position du joueur, la map, etc.
  }

  onMessage(client, message) {
    console.log(`📩 ${client.sessionId} sent`, message);

    // Exemple simple de broadcast
    this.broadcast("player_action", {
      from: client.sessionId,
      data: message
    });
  }

  update(deltaTime) {
    // Boucle de jeu régulière ici
    // ex : gestion de position, collision, animation...
  }

  onLeave(client, consented) {
    console.log(`👋 ${client.sessionId} left the world`);
  }

  onDispose() {
    console.log("🧹 WorldRoom disposed");
  }
}

module.exports = { WorldRoom };