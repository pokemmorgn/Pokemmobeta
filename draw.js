let canvas, ctx;

export function setupCanvas() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
}

export function drawGame(player, others = {}) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Autres joueurs
  for (const id in others) {
    const p = others[id];
    ctx.fillStyle = "blue";
    ctx.fillRect(p.x, p.y, 30, 30);
    ctx.fillStyle = "black";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(p.name || "Other", p.x + 15, p.y - 6);
  }

  // Joueur principal
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);
  ctx.fillStyle = "black";
  ctx.font = "16px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(player.name, player.x + player.size / 2, player.y - 10);
}

//