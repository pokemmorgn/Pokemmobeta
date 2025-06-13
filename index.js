const http = require("http");
const express = require("express");
const { Server } = require("colyseus");
const { WorldRoom } = require("./src/rooms/WorldRoom");

const app = express();
const server = http.createServer(app);

const gameServer = new Server({ server });

gameServer.define("world", WorldRoom);

gameServer.listen(2567);
console.log("✅ Colyseus Cloud server is running!");