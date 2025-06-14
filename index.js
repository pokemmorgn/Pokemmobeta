const http = require("http");
const express = require("express");
const { Server } = require("colyseus");
const { monitor } = require("@colyseus/monitor");
const { WorldRoom } = require("./rooms/WorldRoom");

const app = express();
const server = http.createServer(app);
const gameServer = new Server({
  server,
});

gameServer.define("world", WorldRoom);

app.use("/colyseus", monitor());

const PORT = process.env.PORT || 2567;
server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
