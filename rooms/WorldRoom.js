const colyseus = require("colyseus");

class Player {
    constructor(x = 400, y = 300) {
        this.x = x;
        this.y = y;
    }
}

class State {
    constructor() {
        this.players = {};
    }
    createPlayer(sessionId) {
        this.players[sessionId] = new Player();
    }
    removePlayer(sessionId) {
        delete this.players[sessionId];
    }
    movePlayer(sessionId, x, y) {
        if (this.players[sessionId]) {
            this.players[sessionId].x = x;
            this.players[sessionId].y = y;
        }
    }
}

exports.WorldRoom = class extends colyseus.Room {
    onCreate() {
        this.setState(new State());
        this.onMessage("*", (client, data) => {
            this.state.movePlayer(client.sessionId, data.x, data.y);
        });
    }
    onJoin(client) {
        this.state.createPlayer(client.sessionId);
    }
    onLeave(client) {
        this.state.removePlayer(client.sessionId);
    }
};