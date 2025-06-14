const client = new Colyseus.Client("wss://TON-SOUSDOMAINE.colyseus.cloud"); // Remplace par ton URL
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let room;
let players = new Map();

async function start() {
  room = await client.joinOrCreate("world_room"); // adapte au nom exact de ta room

  // Quand un joueur est ajouté
  room.state.players.onAdd = (player, sessionId) => {
    players.set(sessionId, { x: player.x, y: player.y });
  };

  // Quand un joueur est modifié
  room.state.players.onChange = (player, sessionId) => {
    players.set(sessionId, { x: player.x, y: player.y });
  };

  // Quand un joueur part
  room.state.players.onRemove = (player, sessionId) => {
    players.delete(sessionId);
  };

  // Ecoute les touches fléchées pour déplacer notre joueur
  window.addEventListener("keydown", (event) => {
    const myPlayer = room.state.players.get(room.sessionId);
    if (!myPlayer) return;

    let x = myPlayer.x;
    let y = myPlayer.y;

    switch (event.key) {
      case "ArrowLeft": x -= 5; break;
      case "ArrowRight": x += 5; break;
      case "ArrowUp": y -= 5; break;
      case "ArrowDown": y += 5; break;
    }

    // Envoie la nouvelle position au serveur
    room.send({ x, y });
  });

  requestAnimationFrame(gameLoop);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dessine tous les joueurs
  players.forEach(({ x, y }, sessionId) => {
    ctx.beginPath();
    ctx.fillStyle = sessionId === room.sessionId ? "red" : "white";
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(gameLoop);
}

start();
