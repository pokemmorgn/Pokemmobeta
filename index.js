const { listen } = require("@colyseus/tools");
const { Server } = require("colyseus");
const { WorldRoom } = require("./rooms/WorldRoom");

const port = Number(process.env.PORT || 2567);

const gameServer = new Server();
gameServer.define("world", WorldRoom);

listen(gameServer, { port });