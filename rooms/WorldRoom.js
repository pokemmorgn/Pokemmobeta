// test
const colyseus = require("colyseus");
const Schema = require("@colyseus/schema").Schema;
const type = require("@colyseus/schema").type;

// Classe joueur synchronisée
class Player extends Schema {
    constructor() {
        super();
        this.x = 400;
        this.y = 300;
    }
}
type("number")(Player.prototype, "x");
type("number")(Player.prototype, "y");

// Classe état global
class State extends Schema {
    constructor() {
        super();
        this.players = new Map();
    }
}
type({ map: Player })(State.prototype, "players");

// Room principale
exports.WorldRoom = class extends colyseus.Room {
    onCreate() {
        this.setState(new State());
        this.onMessage("*", (client, data) => {
            const player = this.state.players.get(client.sessionId);
            if (player) {
                if (typeof data.x === "number") player.x = data.x;
                if (typeof data.y === "number") player.y = data.y;
            }
        });
    }
    onJoin(client) {
        const player = new Player();
        this.state.players.set(client.sessionId, player);
    }
    onLeave(client) {
        this.state.players.delete(client.sessionId);
    }
};
