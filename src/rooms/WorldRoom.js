const { Room } = require("colyseus");

exports.WorldRoom = class WorldRoom extends Room {
  onCreate() {
    this.setState({ players: {} });

    this.onMessage("move", (client, { x, y }) => {
      const p = this.state.players[client.sessionId];
      if (!p) return;

      // Anti-TP simple
      const dx = Math.abs(p.x - x);
      const dy = Math.abs(p.y - y);
      if (dx > 100 || dy > 100) return;

      p.x = x;
      p.y = y;
    });
  }

  onJoin(client, options) {
    this.state.players[client.sessionId] = {
      wallet: options.wallet || "unknown",
      x: 100,
      y: 100,
    };
  }

  onLeave(client) {
    delete this.state.players[client.sessionId];
  }
};