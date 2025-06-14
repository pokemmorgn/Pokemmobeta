const http = require("http");
const express = require("express");
const cors = require("cors"); // <-- ajoute cette ligne
const { Server } = require("colyseus");
const { monitor } = require("@colyseus/monitor");
const { WorldRoom } = require("./rooms/WorldRoom");

const app = express();

// Configure CORS ici, adapte l'origine à ton front
app.use(cors({
  origin: ['https://pokemmorgn.github.io', 'http://localhost:3000'], // liste des domaines autorisés
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
}));

const server = http.createServer(app);
const gameServer = new Server({
  server,
});

gameServer.define("world", WorldRoom);

// Monitor accessible sur /colyseus/monitor
app.use("/colyseus", monitor());

const PORT = process.env.PORT || 2567;
server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
